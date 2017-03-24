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

global.Crypto = {
  algorithm: 'aes-256-ctr',
  password: 'FHI4EVER',
  
  encrypt: function(text) {
    var crypto = require('crypto');
    var cipher = crypto.createCipher(Crypto.algorithm,Crypto.password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  },
 
  decrypt: function(text) {
    var crypto = require('crypto');
    var decipher = crypto.createDecipher(Crypto.algorithm,Crypto.password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  } 
};

global.PropertiesService = {
  file: './config.json',
  memory: null,
  
  getFileContent: function() {
    var data = fs.readFileSync(PropertiesService.file);
    var content = Crypto.decrypt(data.toString());

    return content;
  },
  
  setFileContent: function(content) {
    var data = Crypto.encrypt(content);
    fs.writeFileSync(PropertiesService.file, data);
  },
  
  read: function() {
    if (PropertiesService.memory == null) {
      var content = PropertiesService.getFileContent();
      PropertiesService.memory = JSON.parse(content);
    }
    
    return PropertiesService.memory;
  },
  
  save: function() {
    var content = JSON.stringify(PropertiesService.memory)
    PropertiesService.setFileContent(content);
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