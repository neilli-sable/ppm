/*
 + ppm.shell.js
 * Shell mudule for PleasePleaseMe
 */

ppm.shell = (function() {
  'use strict';
  var
    configMap = {
      main_html :String() +
      '<header class="ppm-shell-header infobar">' +
        '<div class="pull-left">' +
          '<div class="ppm-shell-header-logo">PleasePleaseMe</div>' +
        '</div>' +
        '<div class="ppm-shell-header-button pull-right">' +
          '<button class="please_button">pls</button>' +
        '</div>' +
      '</header>' +
      '<div class="ppm-shell-main content_panel">' +
        '<nav class="ppm-shell-main-sidebar sidebar">' +
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
      $list      : $container.find('.ppm-shell-main-list')
    };
  };
  initModule = function($container) {
    // load HTML and map jQuery collenctions
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();

    // configure and initialize feature module
    ppm.inbox.configModule({
      inbox_model: ppm.model.inbox,
      task_list_model: ppm.model.task_list
    });
    ppm.inbox.initModule(jqueryMap.$container);
  };

  return {
    initModule: initModule
  };

}());