const fs = require('fs');
const request = require('sync-request');

global.Logger = console;

global.UrlFetchApp = {
  fetch: function(url, options) {
    var result = request(options.method, url, options);

    return result.body.toString('utf8');
  }
};

global.Utilities = {
  base64Encode: function(value) {
    return new Buffer(value).toString('base64');
  }
};

global.PropertiesService = {
  file: './config.json',
  memory: null,
  
  read: function() {
    if (PropertiesService.memory == null) {
      var str = fs.readFileSync(PropertiesService.file).toString();
      PropertiesService.memory = JSON.parse(str);
    }
    
    return PropertiesService.memory;
  },
  
  save: function() {
    fs.writeFileSync(PropertiesService.file, JSON.stringify(PropertiesService.memory));
  },
  
  properties: {
    getProperty: function(key) {
      var memory = PropertiesService.read();

      return (memory[key] == undefined) ? null : memory[key];
    },
    
    setProperty: function(key, value) {
      var memory = PropertiesService.read();

      memory[key] = value;
      PropertiesService.save();
    }
  },
  
  getUserProperties: function() {
    return PropertiesService.properties;
  },
  
  getScriptProperties: function() {
    return PropertiesService.properties;
  }
};