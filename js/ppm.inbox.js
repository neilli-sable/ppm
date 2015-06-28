/*
 * ppm.inbox.js
 * Inbox feature module for PleasePleaseMe
*/
ppm.inbox = (function(){

var
  configMap = {
    main_html : String() +
    '<main class="ppm-inbox">' +
      '<div class="ppm-inbox-task">' +
        '<span>Title</span>' +
        '<p>aaaaaaaaaaaaaaaaaaaaaaaaaa</p>' +
      '</div>' +
    '</main>',

    inbox_model: null,
    task_list_model: null,
    settable_map: {
      inbox_model: true,
      task_list_model: true
    },
  },

  stateMap = {
    $append_target: null
  },
  jqueryMap = {},
  setJqueryMap, configModule, initModule;

  setJqueryMap = function() {
    var
      $append_target = stateMap.$append_target,
      $content = $append_target.find('.ppm-inbox');

    jqueryMap = {
      $task: $content.find('.ppm-inbox-task'),
    }
  };

  configModule = function(input_map) {
    ppm.util.setConfigMap({
      input_map: input_map,
      settable_map: configMap.settable_map,
      config_map: configMap
    });
  };

  initModule = function($append_target) {
    $append_target.append(configMap.main_html);
    stateMap.$append_target = $append_target;
    setJqueryMap();
    return true;
  };

  return {
    initModule  : initModule,
    configModule: configModule
  }
}());
