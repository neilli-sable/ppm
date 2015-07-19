/*
 * ppm.js
 * Root namespace module
*/
var ppm = (function() {
  'use strict';
  var initModule = function($container) {
    ppm.data.initModule();
    ppm.model.initModule();
    ppm.shell.initModule($container);
  };

  return {initModule: initModule};
}());
