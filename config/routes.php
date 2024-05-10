<?php
/**
 * Site URL Rules
 *
 * You can define custom site URL rules here, which Craft will check in addition
 * to any routes you’ve defined in Settings → Routes.
 *
 * See http://www.yiiframework.com/doc-2.0/guide-runtime-routing.html for more
 * info about URL rules.
 *
 * In addition to Yii’s supported syntaxes, Craft supports a shortcut syntax for
 * defining template routes:
 *
 *     'blog/archive/<year:\d{4}>' => ['template' => 'blog/_archive'],
 *
 * That example would match URIs such as `/blog/archive/2012`, and pass the
 * request along to the `blog/_archive` template, providing it a `year` variable
 * set to the value `2012`.
 */

$requestSegments = !Craft::$app->request->isCpRequest ? Craft::$app->request->segments : [];

$staticRouteName = '';
if (count($requestSegments) > 1) {
    $fullUri = Craft::$app->request->getFullUri();
    $slug = end($requestSegments);
    $staticRouteName = $requestSegments[count($requestSegments) - 2];

    $isEntryExisting = Craft::$app->getElements()->getElementByUri($staticRouteName . '/' . $slug);

    if (!$isEntryExisting) {
        $staticRouteName = '';
    }
}

$listOfDynamicSections = [
    $staticRouteName,
];

return [
    '<parentUrl:(.*?)+><isDynamicRoute:(.*?)+>/<section:(' . join(
        '|',
        $listOfDynamicSections
    ) . ')>/<slug:[^\/]+>' => ['template' => '_sections/section'],
];
