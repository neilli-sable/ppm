/*
 * routes.js
*/

/*jslint         node    : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global */
'use strict';
var
  loadSchema, checkSchema,
  fsHandle = require('fs'),
  makeMongoId,
  configRoutes,
  mongodb     = require('mongodb'),
  MongoClient = require('mongodb').MongoClient,
  assert      = require('assert'),
  JSV         = require('JSV').JSV,
  url = "mongodb://localhost:27017/ppm",
  database,
  obj_type,
  objTypeMap = {'user': {}},
  validator = JSV.createEnvironment();

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
// ユーティリティメソッド終了

configRoutes = function(app, server) {
  app.get('/', function(request, response) {
    response.redirect('/index.html');
  });

  app.all('/:obj_type/*?', function(request, response, next) {
    response.contentType('json');
    if (objTypeMap[request.params.obj_type]) {
      obj_type = database.collection(request.params.obj_type);
      next();
    }
    else {
      response.send({error_msg: request.params.obj_type +
      'is not a valid object type'});
    }
  });

  app.get('/:obj_type/list', function(request, response) {
    obj_type.find().toArray(function(error, items) {
      response.send(items);
    });
  });

  app.post('/:obj_type/create', function(request, response) {
    var obj_map    = request.body;

    checkSchema(
      request.params.obj_type, obj_map,
      function(error_list) {
        if (error_list.length === 0) {
          var options_map = {safe: true};
          obj_type.insert(
            obj_map,
            options_map,
            function(error, result_map) {
              response.send(result_map);
            }
          );
        }
        else {
          response.send({
            error_msg: 'Input document not valid',
            error_list: error_list
          });
        }
      }
    );
  });

  app.get('/:obj_type/read/:id', function(request, response) {
    var find_map = {_id: makeMongoId(request.params.id)};

    obj_type.findOne(
      find_map,
      function(error, result_map) {
        response.send(result_map);
      }
    );
  });

  app.post('/:obj_type/update/:id', function(request, response) {
    var
      find_map = {_id: makeMongoId(request.params.id)},
      obj_map = request.body;

    checkSchema(
      request.params.obj_type, obj_map,
      function(error_list) {
        if (error_list.length === 0) {
          var
            sort_order = [],
            options_map = {
              'new': true, upsert: false, safe: true
            };
          obj_type.findAndModify(
            find_map,
            sort_order,
            obj_map,
            options_map,
            function(error, updated_map) {
              response.send(updated_map);
            }
          );
        }
        else {
          response.send({
            error_msg: 'Input document not valid',
            error_list: error_list
          });
        }
      }
    );
  });

  app.get('/:obj_type/delete:id', function(request, response) {
    var
      find_map = {_id: makeMongoId(request.params.id)},
      options_map = {safe: true, single: true};

    obj_type.remove(
      find_map,
      options_map,
      function(error, delete_count) {
        response.send({delete_count: delete_count});
      }
    );
  });
};

module.exports = {
  configRoutes: configRoutes
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
