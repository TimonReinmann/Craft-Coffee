<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

use craft\helpers\App;

$isDev = App::env('CRAFT_ENVIRONMENT') === 'dev';
$isProd = App::env('CRAFT_ENVIRONMENT') === 'prod';

return [
    '*' => [
        // Verification duration 2 weeks
        'verificationCodeDuration' => 1209600,

        // Default Week Start Day (0 = Sunday, 1 = Monday...)
        'defaultWeekStartDay' => 1,

        // Whether asset URLs should be revved so browsers don’t load cached versions when they’re modified.
        'revAssetUrls' => true,

        // Whether generated URLs should omit "index.php"
        'omitScriptNameInUrls' => true,

        // Control panel trigger word
        'cpTrigger' => App::env('CP_TRIGGER') ?? 'cp',

        'loginPath' => App::env('CP_TRIGGER') ?? 'cp',

        // The secure key Craft will use for hashing and encrypting data
        'securityKey' => App::env('SECURITY_KEY'),

        // Errors redirected to error.twig in root
        'errorTemplatePrefix' => '_',

        // 64MB max file upload
        'maxUploadFileSize' => 110000000,

        // set it to false to prevent Admin changes
        'allowAdminChanges' => true,

        'useEmailAsUsername' => true,

        'aliases' => [
            '@baseUrl' => App::env('DEFAULT_SITE_URL'),
            '@webroot' => dirname(__DIR__) . '/web',
            '@assetsBasePath' => '@webroot/assets',
            '@volumesBasePath' => '@webroot/volumes',
            '@controlPanelCss' => '/assets/styles/app/cp/main.css',
            // Image calculation in "_components/img.twig"
            '@defaultImgType' => 'webp',
            '@fallbackImgType' => 'jpeg',
            '@mobileSrcSet' => '540', // size for mobile srcSet
            '@imgMaxWidth' => '2880', // upper limit for image calculations
            '@imgMaxTolerance' => '1.2', // a value between 1 - 2 if a srcset should be calculated if it hits threshold
            '@imgDefaultWidth' => '1200', // default img size for the src="" attribute
        ],
    ],

    // Local environment settings
    'local' => [
        'devMode' => true,

        // Set this to `false` to prevent administrative changes from being made on Staging
        'allowAdminChanges' => true,

        // Don’t allow updates on Staging
        'allowUpdates' => true,

        // Disable template caching for development
        'enableTemplateCaching' => false,
    ],

    // Dev environment settings
    'dev' => [
        'devMode' => true,

        // Set this to `false` to prevent administrative changes from being made on Staging
        'allowAdminChanges' => false,

        // Don’t allow updates on Staging
        'allowUpdates' => false,

        // Prevent crawlers from indexing pages and following links
        'disallowRobots' => true,
    ],

    // Staging environment settings
    'stage' => [
        'devMode' => false,

        // Set this to `false` to prevent administrative changes from being made on Staging
        'allowAdminChanges' => false,

        // Don’t allow updates on Staging
        'allowUpdates' => false,

        // Prevent crawlers from indexing pages and following links
        'disallowRobots' => true,

        'aliases' => [
            '@controlPanelCss' => '/assets/styles/app/cp/main.min.css',
        ]
    ],

    // Production environment settings
    'prod' => [
        'devMode' => false,

        // Set this to `false` to prevent administrative changes from being made on Production
        'allowAdminChanges' => false,

        // Don’t allow updates on Production
        'allowUpdates' => false,

        // Prevent crawlers from indexing pages and following links
        'disallowRobots' => false,

        'aliases' => [
            '@controlPanelCss' => '/assets/styles/app/cp/main.min.css',
        ]
    ],
];
