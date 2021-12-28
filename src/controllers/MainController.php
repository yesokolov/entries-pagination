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
use craft\elements\Entry;
use yesokolov\entriespagination\assetbundles\entriespagination\EntriesPaginationCPSectionAsset;
use yesokolov\entriespagination\EntriesPagination;

use Craft;
use craft\web\Controller;
use yii\base\ActionEvent;
use yii\base\Event;
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
    protected $allowAnonymous = ['index', 'entries','ajax'];
    public function actionEntries($sectionHandle = null)
    {
       $pages = EntriesPagination::pages($sectionHandle);
       $num = $pages['number'];
       $last = $pages['last'];
       $current = $pages['current'];
       unset($pages['number']);
       unset($pages['last']);
       unset($pages['current']);
        $pages = count($pages) > 1 ? $pages : array();
        return $this->renderTemplate(
            'entries-pagination/entries-pagination.twig',
            [
                'elementType' => "craft\\elements\\Entry",
                'title' => 'Entries',
                'pages'=> $pages,
                'num' => $num,
                'last' => $last,
                'current' => $current
            ]
        );
    }
    public function actionAjax($sectionHandle = null){
        if($sectionHandle == '*'){
            $sectionHandle = null;
        }elseif($sectionHandle == 'singles'){
            $sectionHandle = 'singles';
        }
        $pages = EntriesPagination::pages($sectionHandle);
        $num = $pages['number'];
        $last = $pages['last'];
        $current = $pages['current'];
        unset($pages['number']);
        unset($pages['last']);
        unset($pages['current']);
        $pages = count($pages) > 1 ? $pages : array();
        return $this->renderTemplate('entries-pagination/paginate.twig', [
            'pages'=> $pages,
            'num' => $num,
            'last' => $last,
            'current' => $current] );
    }
}
