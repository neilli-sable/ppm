/*
 * crud.js
*/
/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

'use strict';
var
  checkType, constructObj, readObj,
  updateObj, destroyObj, makeMongoId,
  loadSchema, checkSchema,
  createObjCollection,
  mongodb     = require('mongodb'),
  assert      = require('assert'),
  MongoClient = require('mongodb').MongoClient,
  JSV         = require('JSV').JSV,
  fsHandle    = require('fs'),
  url = "mongodb://localhost:27017/ppm",
  database,
  validator = JSV.createEnvironment(),
  objTypeMap = {'user': {}};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log('** Connected to MongoDB **');
  database = db;
  //db.close(); // Is this need? Idon't understand.
});

makeMongoId = mongodb.ObjectID;

// ユーティリティメソッド開始
loadSchema = function ( schema_name, schema_path ) {
  fsHandle.readFile( schema_path, 'utf8', function ( err, data ) {
    objTypeMap[ schema_name ] = JSON.parse( data );
  });
};

checkSchema = function(obj_type, obj_map, callback) {
  var
    schema_map = objTypeMap[obj_type],
    report_map = validator.validate(obj_map, schema_map);

    callback(report_map.errors);
};

createObjCollection = function(obj_type) {
  if (objTypeMap[obj_type]) {
    return database.collection(obj_type);
  }
};
// ユーティリティメソッド終了

checkType    = function(obj_type) {
  if (! objTypeMap[obj_type]) {
    return({error_msg: 'Object type "' + obj_type +
          '" is not supported.'
    });
  }
  return null;
};

constructObj = function(obj_type, obj_map, callback) {
  var type_check_map = checkType(obj_type);
  if (type_check_map) {
    callback(type_check_map);
    return;
  }

  checkSchema(
    obj_type, obj_map,
    function(error_list) {
      if (error_list) {
        if (error_list.length === 0) {
          var options_map = {safe: true};

          var obj_collection = createObjCollection(obj_type);
          obj_collection.insert(
            obj_map,
            options_map,
            function(error, result_map) {
              callback(result_map);
            }
          );
        }
      }
      else {
        callback({
          error_msg : 'Input document not valid',
          error_list: error_list
        });
      }
    }
  );
};

readObj      = function(obj_type, find_map, fields_map, callback) {
  var type_check_map = checkType(obj_type);
  if (type_check_map) {
    callback(type_check_map);
    return;
  }

  var obj_collection = createObjCollection(obj_type);
  obj_collection.find(find_map, fields_map).toArray(
    function(error, map_list) {
      callback(map_list);
    }
  );
};

updateObj    = function(obj_type, find_map, set_map, callback) {
  var type_check_map = checkType(obj_type);
  if (type_check_map) {
    callback(type_check_map);
    return;
  }

  checkSchema(
    obj_type, set_map,
    function(error_list) {
      if (error_list.length === 0) {
        var obj_collection = createObjCollection(obj_type);
        obj_collection.update(
          find_map,
          {$set: set_map},
          {safe: true, multi: true, upsert: false},
          function(error, update_count) {
            callback({update_count: update_count});
          }
        );
      }
    }
  );
};

destroyObj   = function(obj_type, find_map, callback) {
  var type_check_map = checkType(obj_type);
  if (type_check_map) {
    callback(type_check_map);
    return;
  }

  var options_map = {safe: true, single: true};

  var obj_collection = createObjCollection(obj_type);
  obj_collection.remove(find_map, options_map,
    function(error, delete_count) {
      callback({delete_count: delete_count});
    }
  );
};

module.exports = {
  makeMongoId: mongodb.ObjectID,
  checkType  : checkType,
  construct  : constructObj,
  read       : readObj,
  update     : updateObj,
  destroy    : destroyObj
};

(function () {
  var schema_name, schema_path;
  for ( schema_name in objTypeMap ) {
    if ( objTypeMap.hasOwnProperty( schema_name ) ) {
      schema_path = __dirname + '/' + schema_name + '.json';
      loadSchema( schema_name, schema_path );
    }
  }
}());
