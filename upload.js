require('./gas.js');

const fs = require('fs');
const request = require('sync-request');

//var url = 'https://script.google.com/macros/s/AKfycbyRybS6ZQ5gJNY81gZxnNuNxc1cDcf_eeWQqsEppPeOnHFR0wQ/exec';

function sendAction(url, action, arguments) {
  var key = '3ea6c275f20b7ad06dc077d18d250a8b';

  var body = {
    'key': key,
    'action': action,
    'arguments': arguments
  };

  var result = request('POST', url, { 'body': JSON.stringify(body) });
  return result.body.toString('utf8');
}

module.exports = {
  configure: () => {
    var ret = 'configure...';
    
    try {
      var url = PropertiesService.properties.getProperty('upload_url');
      var data = PropertiesService.getFileContent();

      ret = sendAction(url, 'configure', JSON.parse(data));
    } catch (e) { ret = e.message; }
    
    console.log(ret);
    return ret;
  },

  update: (filepath) => {
    var ret = 'update...';

    try {
      var url = PropertiesService.properties.getProperty('upload_url');
      var data = fs.readFileSync(filepath).toString('utf8');
      
      ret = sendAction(url, 'update', JSON.parse(data));
      
      if (ret == 'update done') {
        var json = JSON.parse(data);
        json.uploaded = true;
        fs.writeFileSync(filepath, JSON.stringify(json));
      }
    } catch (e) { ret = e.message; }
    
    console.log(ret);
    return ret;
  }
 
}