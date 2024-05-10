<?php
/**
 * Project Extension plugin for Craft CMS 3.x
 *
 * The purpose of this plugin is to define missing functionality of your project
 *
 * @link      https://yoo.digital
 * @copyright Copyright (c) 2021 Yanick Recher
 */

namespace yoo\projectextension\utilities;

use yoo\projectextension\ProjectExtension;
use yoo\projectextension\assetbundles\projectextensionutilityutility\ProjectExtensionUtilityUtilityAsset;

use Craft;
use craft\base\Utility;

/**
 * Project Extension Utility
 *
 * Utility is the base class for classes representing Control Panel utilities.
 *
 * https://craftcms.com/docs/plugins/utilities
 *
 * @author    Yanick Recher
 * @package   ProjectExtension
 * @since     1.0.0
 */
class ProjectExtensionUtility extends Utility {
    // Static
    // =========================================================================

    /**
     * Returns the display name of this utility.
     *
     * @return string The display name of this utility.
     */
    public static function displayName(): string {
        return Craft::t('project-extension', 'ProjectExtensionUtility');
    }

    /**
     * Returns the utility’s unique identifier.
     *
     * The ID should be in `kebab-case`, as it will be visible in the URL (`admin/utilities/the-handle`).
     *
     * @return string
     */
    public static function id(): string {
        return 'projectextension-project-extension-utility';
    }

    /**
     * Returns the path to the utility's SVG icon.
     *
     * @return string|null The path to the utility SVG icon
     */
    public static function iconPath(): string|null {
        return Craft::getAlias(
            "@yoo/projectextension/assetbundles/projectextensionutilityutility/dist/img/ProjectExtensionUtility-icon.svg"
        );
    }

    /**
     * Returns the number that should be shown in the utility’s nav item badge.
     *
     * If `0` is returned, no badge will be shown
     *
     * @return int
     */
    public static function badgeCount(): int {
        return 0;
    }

    /**
     * Returns the utility's content HTML.
     *
     * @return string
     */
    public static function contentHtml(): string {
        Craft::$app->getView()->registerAssetBundle(ProjectExtensionUtilityUtilityAsset::class);

        $someVar = 'Have a nice day!';
        return Craft::$app->getView()->renderTemplate(
            'project-extension/_components/utilities/ProjectExtensionUtility_content',
            [
                'someVar' => $someVar
            ]
        );
    }
}
