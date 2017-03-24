require('./gas.js');

require('./moji/api.gs');
require('./moji/jira.gs');
require('./moji/fields.gs');

const express = require('express');
const bodyParser = require("body-parser");

app = express();

app.set('port', (process.env.PORT || 8080));
app.set('view engine', 'ejs');

app.use(express.static('views'));
app.use(express.static('moji'));
app.use(bodyParser.json());

// ROOT -------------------------------

app.get('/', (request, response) => {
  const fs = require('fs');

  var url = PropertiesService.properties.getProperty('upload_url');
  
  var files = fs.readdirSync('data');
  var list = [];
  
  var path = './data/';
  
  files.forEach((filename) => {
    if (filename.match(/\.json$/) == null) return;
    
    var filepath = path + filename;
    var data = fs.readFileSync(filepath).toString('utf8');
    var json = JSON.parse(data);
    
    if (json.uploaded != true) {
      list.push({
        date: filename.replace(' - data.json',''),
        path: filepath
      });
    }
  });
  
  response.render('index', {
    files: list,
    url: url
  });
});


// EXTRACT ----------------------------

app.get('/extract', (request, response) => {
  var extract = require('./extract.js');
  var result = extract.save();
  
  if (result == 'save done') {
    response.statusCode = 302;
    response.setHeader('Location', '/');
  } else {
    response.write(result);
  }
  
  response.end();
});


// SAVE -------------------------------

app.get('/save', (request, response) => {
  var url = request.query['param'];
  PropertiesService.properties.setProperty('upload_url', url);
  
  response.statusCode = 302;
  response.setHeader('Location', '/');
  response.end();
});


// CONFIGURE --------------------------

app.get('/configure', (request, response) => {
  var upload = require('./upload.js');
  var result = upload.configure();
  
  if (result == 'configure done') {
    response.statusCode = 302;
    response.setHeader('Location', '/');
  } else {
    response.write(result);
  }
  
  response.end();
});


// UPDATE -----------------------------

app.get('/update', (request, response) => {
  var filepath = request.query['param'];
  
  var upload = require('./upload.js');
  var result = upload.update(filepath);
  
  if (result == 'update done') {
    response.statusCode = 302;
    response.setHeader('Location', '/');
  } else {
    response.write(result);
  }
  
  response.end();
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

// COMPLETE WITH ACTIONS --------------

app.complete = function(obj) {
  var keys = Object.keys(obj);
  keys.forEach((key) => {
    var fn = obj[key];
    var url = '/'+key;

    app.post(url, (request, response) => {
      console.log(key);
      var data = fn.apply(this, request.body);
      response.end(JSON.stringify(data));
    });
  });
};


/******************/


var dialog = {};

dialog.configGetAccess = function() {
  return api.readAccess();
};

dialog.configSetAccess = function(url, user, pass) {
  return api.saveAccess(url, user, pass);
};

dialog.configGetProjects = function() {
  return jira.getProjects();
};

dialog.configGetCurrentProject = function() {
  return jira.readProject();
};

dialog.configSetCurrentProject = function(project) {
  return jira.saveProject(project);
};

dialog.configGetMinFields = function() {
  var fields = jira.readExportFields();
  return JSON.stringify(fields);
};

dialog.configGetAllFields = function() {
  return jira.getFields();
};

dialog.configSetExportFields = function(fields) {
  jira.saveExportFields(fields);
  //update.sheetColumns();
};

dialog.configFinish = function() {
};

app.complete(dialog);