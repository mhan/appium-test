var wd = require('wd'),
    path = require('path'),
    assert = require('assert'),
    colors = require('colors');

var config = require(path.join(__dirname, '../creds/mike-stew-creds.json'));

var KEY = config.KEY;
var USER = config.USER;
var HOST = config.HOST;
var PORT = config.PORT;

module.exports = function(port, cb) {
  var browser = wd.remote({
      host: HOST,
      port: PORT,
      username: USER,
      accessKey: KEY
  });

  browser.on('status', function(info) {
    console.log(info.cyan);
  });

  browser.on('command', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });

  var error = function(msg, err) {
      console.error(msg, err);
      browser.quit();
  }

  browser.init({
      name:'Android 5.0 Appium Test',
      browserName:'Browser',
      platformName: 'Android',
      platformVersion: '5.0',
      deviceName: 'Android Emulator',
      appiumVersion: '1.2.2',
      username:USER,
      accessKey:KEY,
    }, function(err, session, caps) {
      if (err) error('init error!', err);
      else browser.get('http://www.filmaj.ca', function(err) {
        if (err) error('get error!', err);
        else browser.title(function(err, title) {
          if(err) error('error getting title', err);
          else browser.elementByLinkText('CV', function(err, el) {
            if (err) error('error clicking CV link', err);
            else browser.clickElement(el, function(err) {
              if (err) error('error clicking CV link', err);
              else browser.eval("window.location.href", function(err, href) {
                if (err) error('error getting location.href', err);
                else {
                  browser.quit();
                  if (cb) cb();
                }
              });
            });
          });
        });
      });
    }
  );
}

if (require.main === module) {
  module.exports(4723);
}
