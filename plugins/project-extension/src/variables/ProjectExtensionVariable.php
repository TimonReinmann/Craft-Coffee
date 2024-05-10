<?php
/**
 * Project Extension plugin for Craft CMS 3.x
 *
 * The purpose of this plugin is to define missing functionality of your project
 *
 * @link      https://yoo.digital
 * @copyright Copyright (c) 2021 Yanick Recher
 */

namespace yoo\projectextension\variables;

use yoo\projectextension\ProjectExtension;

use Craft;

/**
 * Project Extension Variable
 *
 * Craft allows plugins to provide their own template variables, accessible from
 * the {{ craft }} global variable (e.g. {{ craft.projectExtension }}).
 *
 * https://craftcms.com/docs/plugins/variables
 *
 * @author    Yanick Recher
 * @package   ProjectExtension
 * @since     1.0.0
 */
class ProjectExtensionVariable {
    // Public Methods
    // =========================================================================

    /**
     * Whatever you want to output to a Twig template can go into a Variable method.
     * You can have as many variable functions as you want.  From any Twig template,
     * call it like this:
     *
     *     {{ craft.projectExtension.exampleVariable }}
     *
     * Or, if your variable requires parameters from Twig:
     *
     *     {{ craft.projectExtension.exampleVariable(twigValue) }}
     *
     * @param null $optional
     * @return string
     */
    public function exampleVariable($optional = null): string {
        $result = "And away we go to the Twig template...";
        if ($optional) {
            $result = "I'm feeling optional today...";
        }
        return $result;
    }
}
