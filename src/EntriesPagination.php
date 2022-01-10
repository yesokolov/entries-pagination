<?php
/**
 * Entries Pagination plugin for Craft CMS 3.x
 *
 * Add custom entries pagination
 *
 * @link      http://site.url
 * @copyright Copyright (c) 2021 Ye. Sokolov
 */

namespace yesokolov\entriespagination;

use craft\models\Section;
use yesokolov\entriespagination\services\Main as MainService;
use yesokolov\entriespagination\models\Settings;

use Craft;
use craft\base\Plugin;
use craft\services\Plugins;
use craft\events\PluginEvent;
use craft\web\UrlManager;
use craft\events\RegisterUrlRulesEvent;
use craft\controllers\ElementIndexesController;
use yii\base\ActionEvent;
use yii\base\Event;
use craft\web\View;
use craft\events\TemplateEvent;
use craft\events\RegisterTemplateRootsEvent;
use craft\elements\Entry;
use craft\helpers\ArrayHelper;
/**
 * Craft plugins are very much like little applications in and of themselves. We’ve made
 * it as simple as we can, but the training wheels are off. A little prior knowledge is
 * going to be required to write a plugin.
 *
 * For the purposes of the plugin docs, we’re going to assume that you know PHP and SQL,
 * as well as some semi-advanced concepts like object-oriented programming and PHP namespaces.
 *
 * https://docs.craftcms.com/v3/extend/
 *
 * @author    Ye. Sokolov
 * @package   EntriesPagination
 * @since     1.0.0
 *
 * @property  MainService $main
 * @property  Settings $settings
 * @method    Settings getSettings()
 */
class EntriesPagination extends Plugin
{
    // Static Properties
    // =========================================================================

    /**
     * Static property that is an instance of this plugin class so that it can be accessed via
     * EntriesPagination::$plugin
     *
     * @var EntriesPagination
     */
    public static $plugin;

    // Public Properties
    // =========================================================================

    /**
     * To execute your plugin’s migrations, you’ll need to increase its schema version.
     *
     * @var string
     */
    public $schemaVersion = '1.0.0';

    /**
     * Set to `true` if the plugin should have a settings view in the control panel.
     *
     * @var bool
     */
    public $hasCpSettings = true;

    /**
     * Set to `true` if the plugin should have its own section (main nav item) in the control panel.
     *
     * @var bool
     */
    public $hasCpSection = false;

    // Public Methods
    // =========================================================================
    public $viewState;
    /**
     * Set our $plugin static property to this class so that it can be accessed via
     * EntriesPagination::$plugin
     *
     * Called after the plugin class is instantiated; do any one-time initialization
     * here such as hooks and events.
     *
     * If you have a '/vendor/autoload.php' file, it will be loaded for you automatically;
     * you do not need to load it in your init() method.
     *
     */
    public function init()
    {
        parent::init();
        self::$plugin = $this;

        // Do something after we're installed
        Event::on(
            UrlManager::class,
            UrlManager::EVENT_REGISTER_SITE_URL_RULES,
            function (RegisterUrlRulesEvent $event) {
                $event->rules['siteActionTrigger1'] = 'entries-pagination/main';
            }
        );

        // Register our CP routes
        Event::on(
            UrlManager::class,
            UrlManager::EVENT_REGISTER_CP_URL_RULES,
            function (RegisterUrlRulesEvent $event) {
                $event->rules['entries'] = 'entries-pagination/main/entries';
                $event->rules['entries/<sectionHandle:{handle}>'] = ['route'=>'entries-pagination/main/entries', 'params' => ['<sectionHandle>']];
                $event->rules['pagination-ajax'] = 'entries-pagination/main/ajax';
                $event->rules['pagination-ajax/*/<num>'] = ['route' => 'entries-pagination/main/ajax','params' => [ '*', '<num>']];
                $event->rules['pagination-ajax/<sectionHandle>/<num>'] =  ['route' => 'entries-pagination/main/ajax','params' => ['<sectionHandle>','<num>']];
                $event->rules['element-ajax'] = 'entries-pagination/main/get-elements';
            }
        );
        Event::on(
            Plugins::class,
            Plugins::EVENT_AFTER_INSTALL_PLUGIN,
            function (PluginEvent $event) {
                if ($event->plugin === $this) {
                    // We were just installed
                }
            }
        );

/**
 * Logging in Craft involves using one of the following methods:
 *
 * Craft::trace(): record a message to trace how a piece of code runs. This is mainly for development use.
 * Craft::info(): record a message that conveys some useful information.
 * Craft::warning(): record a warning message that indicates something unexpected has happened.
 * Craft::error(): record a fatal error that should be investigated as soon as possible.
 *
 * Unless `devMode` is on, only Craft::warning() & Craft::error() will log to `craft/storage/logs/web.log`
 *
 * It's recommended that you pass in the magic constant `__METHOD__` as the second parameter, which sets
 * the category to the method (prefixed with the fully qualified class name) where the constant appears.
 *
 * To enable the Yii debug toolbar, go to your user account in the AdminCP and check the
 * [] Show the debug toolbar on the front end & [] Show the debug toolbar on the Control Panel
 *
 * http://www.yiiframework.com/doc-2.0/guide-runtime-logging.html
 */
        Craft::info(
            Craft::t(
                'entries-pagination',
                '{name} plugin loaded',
                ['name' => $this->name]
            ),
            __METHOD__
        );
    }
    function pages($sectionHandle,$pageNum){
        $pages = array();
        $pageTrigger = Craft::$app -> request -> generalConfig -> pageTrigger;
        if($sectionHandle == 'singles'){
            $entries = ArrayHelper::where(\Craft::$app->sections->getAllSections(), 'type', Section::TYPE_SINGLE);
            $entriesNum = count($entries);
        }elseif($sectionHandle == null){
            $entriesNum = Entry::find()->anyStatus()->count();
        }else{
            $sectionArray = explode(':',$sectionHandle);
            if(count($sectionArray) == 1) {
                $entriesNum = Entry::find()->section($sectionHandle)->anyStatus()->count();
            }else{
                $sectionHandle = Craft::$app -> getSections() -> getSectionByUid($sectionArray[1]);
                $sectionHandle = $sectionHandle -> handle;
                $entriesNum = Entry::find()->section($sectionHandle)->anyStatus()->count();
            }
        }
        if($entriesNum % 100 == 0){
            $pagesNum = $entriesNum / 100;
        }else{
            $pagesNum = floor($entriesNum / 100) + 1;
        }
        $pages['pages'] = array();
        for($i = 1;$i<$pagesNum + 1; $i++ ){
            $current = $i == $pageNum ? true: false;
            if($sectionHandle == null){
                $url = '/admin/entries/'.$pageTrigger.$i;
            }else{
                $url = '/admin/entries/'.$sectionHandle.'/'.$pageTrigger.$i;
            }
            if($i == $pageNum or $i == $pageNum - 1 or $i == $pageNum - 2 or $i == 1 or $i == $pagesNum or $i == $pageNum + 1 or $i == $pageNum + 2 ){
                $empty = ($i != 1 and !array_key_exists($i - 1 ,$pages['pages']) ) ? '...':'';
                $pages['pages'][$i] = array('num' => $i, 'url' => $url, 'current' => $current, 'empty' => $empty );
            }
        }
        $lastpage = $pagesNum == $pageNum ? true:false;
        $pages['number'] = $entriesNum;
        $pages['current'] = $pageNum;
        $pages['last'] = $lastpage;
        $pages['ajax'] = EntriesPagination::getInstance()->getSettings()->enableAjax;
        return $pages;
    }

    // Protected Methods
    // =========================================================================

    /**
     * Creates and returns the model used to store the plugin’s settings.
     *
     * @return \craft\base\Model|null
     */
    protected function createSettingsModel()
    {
        return new Settings();
    }

    /**
     * Returns the rendered settings HTML, which will be inserted into the content
     * block on the settings page.
     *
     * @return string The rendered settings HTML
     */
    protected function settingsHtml(): string
    {
        return Craft::$app->view->renderTemplate(
            'entries-pagination/settings',
            [
                'settings' => $this->getSettings()
            ]
        );
    }
}
