const fs = require('fs');
const dateFormat = require('dateformat');

require('./gas.js');

require('./moji/api.gs');
require('./moji/jira.gs');
require('./moji/utils.gs');
require('./moji/fields.gs');


module.exports = {
  save: () => {
    var ret = 'save done';
    
    try {
      var backlog = jira.getBacklog();
      var issue = backlog.issues[0];

      var fields = jira.readExportFields();

      var data = [];
      backlog.issues.forEach((issue) => {
        var line = [];

        for (var key in fields)
          if (fields[key].fn != null) {
            var value = fields[key].fn(issue, fields[key].tech);
            line.push(value);
          }

        data.push(line);
      });

      var day = dateFormat(new Date(), 'yyyy.mm.dd');

      var extract = {
        date: day,
        contents: data
      };

      fs.writeFileSync(`./data/${day} - data.json`, JSON.stringify(extract));
    } catch (e) { ret = e; }
    
    return (typeof ret == 'object') ? JSON.stringify(ret) : ret;
  }
};