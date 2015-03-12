var wd = require('wd')
  , assert = require('assert')
  , colors = require('colors');

module.exports = function(port, cb) {
  var browser = wd.remote('localhost', port);

  browser.on('status', function(info) {
    console.log(info.cyan);
  });

  browser.on('command', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });

  browser.init({
    deviceName:'iPhone Simulator',
    platformVersion: '8.1',
    browserName: 'Safari',
    name:'ios webview',
    platformName:'iOS',
  }, function(err) {
    if (err) error('error initing', err);
    else browser.get("http://michaelhan.ca", function(err) {
      if (err) error('error getting url', err);
      else browser.title(function(err, title) {
        if (err) error('error getting title', err);
        else browser.quit();
      });
    });
  });
}

if (require.main === module) {
  module.exports(4723);
}
