<?php
/**
 * Entries Pagination plugin for Craft CMS 3.x
 *
 * Add custom entries pagination
 *
 * @link      http://site.url
 * @copyright Copyright (c) 2021 Ye. Sokolov
 */

namespace yesokolov\entriespagination\controllers;

use craft\controllers\ElementIndexesController;
use yesokolov\entriespagination\assetbundles\entriespagination\EntriesPaginationCPSectionAsset;
use yesokolov\entriespagination\EntriesPagination;

use Craft;
use craft\web\Controller;
use yii\web\AssetBundle;

/**
 * Main Controller
 *
 * Generally speaking, controllers are the middlemen between the front end of
 * the CP/website and your plugin’s services. They contain action methods which
 * handle individual tasks.
 *
 * A common pattern used throughout Craft involves a controller action gathering
 * post data, saving it on a model, passing the model off to a service, and then
 * responding to the request appropriately depending on the service method’s response.
 *
 * Action methods begin with the prefix “action”, followed by a description of what
 * the method does (for example, actionSaveIngredient()).
 *
 * https://craftcms.com/docs/plugins/controllers
 *
 * @author    Ye. Sokolov
 * @package   EntriesPagination
 * @since     1.0.0
 */
class MainController extends Controller
{
    protected $allowAnonymous = ['entries','ajax','get-elements'];
    public function actionEntries($sectionHandle = null)
    {
       $pages = EntriesPagination::pages($sectionHandle);
        $pages['pages'] = count($pages['pages']) > 1 ? $pages['pages'] : array();
        return $this->renderTemplate(
            'entries-pagination/entries-pagination.twig',
            [
                'elementType' => "craft\\elements\\Entry",
                'title' => 'Entries',
                'pages'=> $pages['pages'],
                'num' => $pages['number'],
                'last' => $pages['last'],
                'current' => $pages['current'],
                'ajax' => $pages['ajax']
            ]
        );
    }
    public function actionAjax($sectionHandle = null){
        $this -> requireAcceptsJson();
        if($sectionHandle == '*'){
            $sectionHandle = null;
        }elseif($sectionHandle == 'singles'){
            $sectionHandle = 'singles';
        }
        $pages = EntriesPagination::pages($sectionHandle);
        $pages['pages'] = count($pages['pages']) > 1 ? $pages['pages'] : array();
        return $this->asJson([
            'pages'=> $pages['pages'],
            'num' => $pages['number'],
            'last' => $pages['last'],
            'current' => $pages['current'],
            'ajax' => $pages['ajax']
        ] );
    }
    public function actionGetElements(){
        $elementsController = new ElementIndexesController();
        $elements = $elementsController->actionGetElements();
        Craft::dd($elements);
    }
}
