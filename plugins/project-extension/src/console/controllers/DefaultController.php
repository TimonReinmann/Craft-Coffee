<?php
/**
 * Project Extension plugin for Craft CMS 3.x
 *
 * The purpose of this plugin is to define missing functionality of your project
 *
 * @link      https://yoo.digital
 * @copyright Copyright (c) 2021 Yanick Recher
 */

namespace yoo\projectextension\console\controllers;

use yoo\projectextension\ProjectExtension;

use Craft;
use yii\console\Controller;
use yii\helpers\Console;

/**
 * Default Command
 *
 * The first line of this class docblock is displayed as the description
 * of the Console Command in ./craft help
 *
 * Craft can be invoked via commandline console by using the `./craft` command
 * from the project root.
 *
 * Console Commands are just controllers that are invoked to handle console
 * actions. The segment routing is plugin-name/controller-name/action-name
 *
 * The actionIndex() method is what is executed if no sub-commands are supplied, e.g.:
 *
 * ./craft project-extension/default
 *
 * Actions must be in 'kebab-case' so actionDoSomething() maps to 'do-something',
 * and would be invoked via:
 *
 * ./craft project-extension/default/do-something
 *
 * @author    Yanick Recher
 * @package   ProjectExtension
 * @since     1.0.0
 */
class DefaultController extends Controller {
    // Public Methods
    // =========================================================================

    /**
     * Handle project-extension/default console commands
     *
     * The first line of this method docblock is displayed as the description
     * of the Console Command in ./craft help
     *
     * @return mixed
     */
    public function actionIndex(): mixed {
        $result = 'something';

        echo "Welcome to the console DefaultController actionIndex() method\n";

        return $result;
    }

    /**
     * Handle project-extension/default/create-example-text console commands
     *
     * The first line of this method docblock is displayed as the description
     * of the Console Command in ./craft help
     *
     * @return void
     */
    public function actionCreateExampleText(): void {
        $entryHome = \craft\elements\Entry::find()->section('home')->one();

        $text = "
            Hallo ich bin ein dynamischer Test Text.<br>
            Du kannst mich auf der Homeseite direkt editieren.<br><br>
            
            Die Komponente erhält Ihr CSS separat erstellt welches nur an der 
            Stelle geladen wird wo diese Komponente benutzt wird. 
            Schau dir dazu das Beispiel in der Komponente \"example-component.twig\" an.<br><br>
            
            
            Sorge dafür das Js Logik immer über Dynamic imports auf der Page integriert wird.";

        $entryHome->richText = $text;

        \Craft::$app->elements->saveElement($entryHome);
    }
}
