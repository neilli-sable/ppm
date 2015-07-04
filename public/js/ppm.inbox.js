/*
 * ppm.inbox.js
 * Inbox feature module for PleasePleaseMe
*/
ppm.inbox = (function(){

var
  configMap = {
    main_html : String() +
    '<main class="ppm-inbox">' +
    '<h2 class="ppm-inbox-title">Inbox</h2>' +
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
  setJqueryMap, configModule,
  getTaskList, initModule;

  setJqueryMap = function() {
    var
      $append_target = stateMap.$append_target,
      $content = $append_target.find('.ppm-inbox');

    jqueryMap = {
      $task: $content.find('.ppm-inbox-task'),
    };
  };

  configModule = function(input_map) {
    ppm.util.setConfigMap({
      input_map: input_map,
      settable_map: configMap.settable_map,
      config_map: configMap
    });
  };

  displayTaskList = function($append_target){
    inbox_db = ppm.model.inbox.get_db();
    inbox_db().each(function(task) {
      task_html = String() +
        '<div class="ppm-inbox-task">' +
          '<h3 class="ppm-inbox-task-title">' + task.title + '</h3>' +
          '<p class="ppm-inbox-task-content">' + task.content + '</p>' +
        '</div>';
      $append_target.append(task_html);
    });
  };

  initModule = function($append_target) {
    $append_target.append(configMap.main_html);

    displayTaskList($append_target.find('.ppm-inbox'));
    stateMap.$append_target = $append_target;
    setJqueryMap();
    return true;
  };

  return {
    initModule  : initModule,
    configModule: configModule
  };
}());
