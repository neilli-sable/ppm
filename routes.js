/*
 * routes.js
*/
'use strict';
var
  makeMongoId,
  configRoutes,
  mongodb     = require('mongodb'),
  MongoClient = require('mongodb').MongoClient,
  assert      = require('assert'),
  url = "mongodb://localhost:27017/ppm",
  database,
  obj_type
  ;

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log('** Connected to MongoDB **');
  database = db;
  //db.close(); // Is this need? Idon't understand.
});

makeMongoId = mongodb.ObjectID;

configRoutes = function(app, server) {
  app.get('/', function(request, response) {
    response.redirect('/index.html');
  });

  app.all('/:obj_type/*?', function(request, response, next) {
    response.contentType('json');
    obj_type = database.collection(request.params.obj_type);
    next();
  });

  app.get('/:obj_type/list', function(request, response) {
    obj_type.find().toArray(function(error, items) {
      response.send(items);
    });
  });

  app.post('/:obj_type/create', function(request, response) {
    var
      options_map = {safe: true},
      obj_map    = request.body;

    obj_type.insert(
      obj_map,
      options_map,
      function(error, result_map) {
        response.send(result_map);
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

  app.post('/:obj_type/update:id', function(request, response) {
    var
      find_map = {_id: makeMongoId(request.params.id)},
      obj_map = request.body,
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
