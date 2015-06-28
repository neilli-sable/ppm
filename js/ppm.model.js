/*
 * ppm.model.js
 * PleasePleaseMeのモデルモジュール
*/

ppm.model = (function() {
  'use strict';
  var
    stateMap = {
      inbox_db: TAFFY()
    },
    isFakeData = true,
    taskProto,
    makeTask,
    inbox,
    initModule;

  taskProto = {
  };

  makeTask = function(task_map) {
    var
      task,
      id = task_map.id,
      title = task_map.title,
      content = task_map.content;

    task = Object.create(taskProto);
    task.title = title;
    task.content = content;

    if (id) {
      task.id = id;
    }

    stateMap.inbox_db.insert(task);
    stateMap.inbox_db({id:'0000000001'}).first();
    return task;
  };

  inbox = (function() {
    var get_db;
    get_db = function(){
      return stateMap.inbox_db;
    };
    return {
      get_db: get_db
    };
  }());

  initModule = function() {
    var task_list, task_map;
    if (isFakeData) {
      task_list = ppm.fake.getTaskList();
      for (var i =0; i < task_list.length; i++) {
        task_map = task_list[i];
        makeTask({
          id:      task_map.id,
          title:   task_map.title,
          content: task_map.content
        });
      }
    }
  };

  return {
    initModule: initModule,
    inbox: inbox
  };
}());
