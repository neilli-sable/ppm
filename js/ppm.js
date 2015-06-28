/*
 * ppm.js
 * Root namespace module
*/
var ppm = (function() {
  'use strict';
  var initModule = function($container) {
    ppm.model.initModule();
    ppm.shell.initModule($container);
  };

  return {initModule: initModule};
}());
