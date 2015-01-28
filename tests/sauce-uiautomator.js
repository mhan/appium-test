var wd = require('wd'),
    path = require('path'),
    assert = require('assert'),
    colors = require('colors');

var config = require(path.join(__dirname, '../creds/mike-stew-creds.json'));

var USER = config.USER;
var PORT = config.PORT;
var HOST = config.HOST;
var KEY = config.KEY;

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
    console.log(' > ' + meth.yellow, path.white, data || '');
  });

  browser.init({
    name: 'Contact Manager Native Application Test on Device',
    app: 'http://saucelabs.com/example_files/ContactManager.apk',
    platformName: "Android",
    platformVersion: "4.4",
    appiumVersion: "1.2.2",
    deviceName: "Samsung Galaxy S4 Device",
    username:USER,
    accessKey:KEY
  }, function(err) {
    if (err) console.error('init err!', err);
    else browser.elementByName('Add Contact', function(err, el) {
      if (err) console.error('get add contact', err);
      else el.click(function(err) {
        if (err) console.error('click add contact', err);
        else browser.elementsByClassName('android.widget.EditText', function(err, fields) {
          if (err) console.error('get textfields', err);
          else fields[0].type('My Name', function(err) {
            if (err) console.error('type into fields[0]', err);
            else fields[2].type('someone@somewhere.com', function(err) {
              if (err) console.error('type into fields[2]', err);
              else fields[0].text(function(err, text) {
                if (err) console.error('get text fields[0]', err);
                else {
                  assert.equal(text, 'My Name');
                  fields[2].text(function(err, text) {
                    if (err) console.error('get text fields[2]', err);
                    else {
                      assert.equal(text, 'someone@somewhere.com');
                      browser.quit();
                      if (cb) cb();
                    }
                  });
                }
              });
            });
          });
        });
      });
    });
  });
};

if (require.main === module) {
  module.exports(4723);
}
