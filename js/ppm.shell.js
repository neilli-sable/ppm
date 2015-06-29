/*
 + ppm.shell.js
 * Shell mudule for PleasePleaseMe
 */

ppm.shell = (function() {
  'use strict';
  var
    configMap = {
      main_html :String() +
      '<header class="ppm-shell-header">' +
        '<div class="pull-left">' +
          '<h1 class="ppm-shell-header-logo">PleasePleaseMe</h1>' +
        '</div>' +
        '<div class="ppm-shell-header-button pull-right">' +
          '<button class="please_button">pls</button>' +
        '</div>' +
      '</header>' +
      '<div class="ppm-shell-main">' +
        '<nav class="ppm-shell-main-sidebar">' +
          '<ul>' +
            '<li><a href="">Inbox</a></li>' +
            '<li>Todo</li>' +
            '<li>Wait</li>' +
            '<li>Maybe</li>' +
            '<li>Projects</li>' +
          '</ul>' +
        '</nav>' +
      '</div>' +
      '<footer></footer>',
    },
    stateMap = {
      $container: undefined,
      anchor_map: {},
      resize_idto: undefined
    },
    jqueryMap = {},
    copyAnchorMap, setJqueryMap,
    initModule;

  // Returns copy of stored anchor map; minimizes overhead
  copyAnchorMap = function () {
    return $.extend( true, {}, stateMap.anchor_map );
  };

  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap = {
      $container : $container,
      $list      : $container.find('.ppm-shell-main')
    };
  };

  initModule = function($container) {
    // load HTML and map jQuery collenctions
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();

    // configure and initialize feature module
    ppm.inbox.configModule({
      inbox_model: ppm.model.inbox
      //task_list_model: ppm.model.task_list
    });
    ppm.inbox.initModule(jqueryMap.$list);
  };

  return {
    initModule: initModule
  };

}());
