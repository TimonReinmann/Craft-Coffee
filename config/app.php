<?php
/**
 * Yii Application Config
 *
 * Edit this file at your own risk!
 *
 * The array returned by this file will get merged with
 * vendor/craftcms/cms/src/config/app.php and app.[web|console].php, when
 * Craft's bootstrap script is defining the configuration for the entire
 * application.
 *
 * You can define custom modules and system components, and even override the
 * built-in system components.
 *
 * If you want to modify the application config for *only* web requests or
 * *only* console requests, create an app.web.php or app.console.php file in
 * your config/ folder, alongside this one.
 */

use craft\helpers\App;

return [
    'id' => App::env('CRAFT_APP_ID') ?: 'CraftCMS',
    'modules' => [
        'my-module' => \modules\Module::class,
    ],
    //'bootstrap' => ['my-module'],
    '*' => [
        'components' => [
            'mailer' => function () {
                /**
                 * Check the .env file for settings
                 */
                // Get the stored email settings
                $settings = App::mailSettings();

                // Override the transport adapter class
                $settings->transportType = craft\mail\transportadapters\Smtp::class;

                // Override the transport adapter settings
                $settings->transportSettings = [
                    'host' => APP::env('SMTP_HOST'),
                    'port' => APP::env('SMTP_PORT'),
                    'useAuthentication' => APP::env('SMTP_USE_AUTHENTICATION'),
                    'encryptionMethod' => APP::env('ENCRYPTION_METHOD'),
                    'username' => APP::env('SMTP_USER'),
                    'password' => APP::env('SMTP_PW'),
                ];

                $config = App::mailerConfig($settings);
                return Craft::createObject($config);
            },
            'deprecator' => [
                // Throw exceptions on deprecation warnings
                'throwExceptions' => App::env('CRAFT_ENVIRONMENT') === 'local',
            ],
        ]
    ],
];
