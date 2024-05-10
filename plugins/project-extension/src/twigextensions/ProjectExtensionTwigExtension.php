<?php
/**
 * Project Extension plugin for Craft CMS 3.x
 *
 * The purpose of this plugin is to define missing functionality of your project
 *
 * @link      https://yoo.digital
 * @copyright Copyright (c) 2021 Yanick Recher
 */

namespace yoo\projectextension\twigextensions;

use yoo\projectextension\ProjectExtension;

use Craft;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use yoo\projectextension\services\ProjectExtensionService;

/**
 * Twig can be extended in many ways; you can add extra tags, filters, tests, operators,
 * global variables, and functions. You can even extend the parser itself with
 * node visitors.
 *
 * http://twig.sensiolabs.org/doc/advanced.html
 *
 * @author    Yanick Recher
 * @package   ProjectExtension
 * @since     1.0.0
 */
class ProjectExtensionTwigExtension extends AbstractExtension {
    // Public Methods
    // =========================================================================

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName(): string {
        return 'ProjectExtension';
    }

    /**
     * Returns an array of Twig filters, used in Twig templates via:
     *
     *      {{ 'something' | someFilter }}
     *
     * @return array
     */
    public function getFilters(): array {
        return [
            new TwigFilter('integer', [$this, 'integerFunction']),
        ];
    }

    /**
     * Returns an array of Twig functions, used in Twig templates via:
     *
     *      {% set this = someFunction('something') %}
     *
     * @return array
     */
    public function getFunctions(): array {
        return [
            'compileScss' => new TwigFunction('compileScss', [$this, 'compileScssFunction']),
            'highlightedText' => new TwigFunction('highlightedText', [$this, 'highlightedTextFunction']),
            'storybookTableContentType' => new TwigFunction(
                'storybookTableContentType',
                [$this, 'storybookTableContentTypeFunction']
            ),
        ];
    }


    /**
     * @param $string
     * @return int
     */
    public function integerFunction($string): int {
        return (int)$string;
    }

    /**
     * @param $type string
     * @param $value string|array
     * @return string
     */
    public function storybookTableContentTypeFunction(string $type, string|array $value): string {
        return match ($type) {
            'boolean' => $value ? 'true' : 'false',
            'string' => $value,
            'redactor' => '--- Redactor Content ---',
            'object' => is_array($value) ? '{' . $this->convert_multi_array($value) . '}' : $value,
            'entry' => '--- Single Entry ---',
            'entries' => '--- Array of Entries ---',
            'asset' => '--- Single Asset ---',
            'assets' => '--- Array of Assets ---',
            'category' => '--- Single Category ---',
            'categories' => '--- Array of Categories ---',
            default => '',
        };
    }

    /**
     * @param $arr
     * @param string $glue
     * @return string
     */
    function convert_multi_array($arr, string $glue = ','): string {
        $ret = '';
        foreach ($arr as $key => $value) {
            if (is_array($value)) {
                $ret .= $this->convert_multi_array($value, $glue);
            } else {
                $ret .= '"' . $key . '":"' . $value . '"' . $glue;
            }
        }
        return substr($ret, 0, -1);
    }

    /**
     * @param string $scss
     * @return string
     */
    function compileScssFunction(string $scss): string {
        return ProjectExtension::$plugin->projectExtensionService->compileScss($scss);
    }
}
