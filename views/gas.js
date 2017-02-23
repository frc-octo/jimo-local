var google = {
  script: {}
};

google.script.run = {
  callback: null,
  
  fn: [
    'configGetAccess',
    'configSetAccess',
    'configGetProjects',
    'configGetCurrentProject',
    'configSetCurrentProject',
    'configGetMinFields',
    'configGetAllFields',
    'configSetExportFields',
    'configFinish'
  ],
  
  init: function() {
    var self = google.script.run;
    
    self.fn.forEach(function(fn) {
      self[fn] = function() {
        var args = Array.from(arguments);
        args.unshift(fn);
        
        return self.call.apply(self, args);
      };
    });
  },
  
  withSuccessHandler: function(callback) {
    var self = google.script.run;
    self.callback = callback;
    
    return self;
  },
  
  call: function(fn) {
    var self = google.script.run;
    var cbk = self.callback;

    self.callback = null;
    
    var args = Array.from(arguments);
    args.shift();
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/'+fn, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      if (this.status == 200) {
        if (cbk) cbk(this.response);
      }
    };
    
    xhr.onerror = function() {
      console.log('ERROR');
    };

    xhr.send(JSON.stringify(args));
  }
};

google.script.run.init();


google.script.host.close = function() {};