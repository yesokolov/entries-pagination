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

use craft\base\ElementInterface;
use craft\controllers\ElementIndexesController;
use craft\elements\db\ElementQuery;
use craft\elements\db\ElementQueryInterface;
use yesokolov\entriespagination\assetbundles\entriespagination\EntriesPaginationCPSectionAsset;
use yesokolov\entriespagination\EntriesPagination;

use Craft;
use craft\web\Controller;
use yii\base\ActionEvent;
use yii\base\Event;
use yii\web\AssetBundle;
use yii\web\Response;

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
class ElementController extends ElementIndexesController
{
    public function beforeAction($action)
    {
        if (!parent::beforeAction($action)) {
            return false;
        }
        $action -> controller -> module -> module -> requestedAction -> controller = Null;
        if (!in_array($action->id, ['export', 'perform-action'], true)) {
            $this->requireAcceptsJson();
        }

        $this->elementType = $this->elementType();
        $this->context = $this->context();
        $this->sourceKey = $this->request->getParam('source') ?: null;
        $this->source = $this->source();
        $this->viewState = $this->viewState();

        $this->paginated = (bool)$this->request->getParam('paginated');
        $this->elementQuery = $this->elementQuery();

        if ($this->includeActions() && $this->sourceKey !== null) {
            $this->actions = $this->availableActions();
            $this->exporters = $this->availableExporters();
        }

        return false;
    }

//    protected $allowAnonymous = ['get-elements'];
    protected function elementResponseData(bool $includeContainer, bool $includeActions): array
    {
        $responseData = parent::elementResponseData( $includeContainer,  $includeActions);
        $responseData['request'] = $this -> request ->getBodyParams();
        return $responseData;
    }
    /**
     * Renders and returns an element index container, plus its first batch of elements.
     *
     * @return Response
     */
    public function actionGetElements(): Response
    {
        $more = $this -> request -> getParam('more');
        $includeContainer = $more == true ? false : true;
        $responseData = $this->elementResponseData($includeContainer, $this->includeActions());
        $responseData['count'] = $count;
        return $this->asJson($responseData);
    }

}