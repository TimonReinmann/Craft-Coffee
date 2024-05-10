<?php

use craft\helpers\App;

$env = (string)App::env('CRAFT_ENVIRONMENT');
$fallBack = 'dev-test@yoo.digital';

$toEmail = ($env !== 'prod' and $env !== 'production') ? $fallBack : App::env('CONTACT_RECEIVER_INFO');

if (isset($_POST['toEmail'])) {
    if ($_POST['toEmail'] === 'example-email@from-template.com') { // use the email address which is used in the form
        $toEmail = App::env('CONTACT_RECEIVER_INFO'); // Add this Var to your .env file
    }
}

return [
    'toEmail' => $toEmail,
    'prependSubject' => Craft::t('site', 'A example Subject...'),
    'prependSender' => '',
    'successFlashMessage' => 'success'
];
