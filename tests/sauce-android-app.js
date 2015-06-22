require('colors');
var async = require('async'),
    path = require('path'),
    assert = require('assert'),
    wd = require('wd');

var config = require(path.join(__dirname, '../creds/mike-stew-creds.json'));

var USER = config.USER;
var PORT = config.PORT;
var HOST = config.HOST;
var KEY = config.KEY;

function runTest(deviceName, platformVersion, cb) {
  var browser = wd.remote({
      host: HOST,
      port: PORT,
      username: USER,
      accessKey: KEY
  });

  var caps = {
    name: deviceName + ' ' + platformVersion,
    app :'https://mikehan.dev.saucelabs.net/example_files/psta.apk',
    platformName: 'Android',
    platformVersion: platformVersion,
    deviceName: deviceName,
    appiumVersion: "1.4",
    //automationName: 'Selendroid',
    'prevent-requeue': true
  };

  var wdCaps = {
    name: deviceName + ' ' + platformVersion,
    app :'https://mikehan.dev.saucelabs.net/example_files/psta.apk',
    platform: 'Linux',
    version: platformVersion,
    device: deviceName,
    appiumVersion: '1.4',
    'prevent-requeue': true
  };

  browser.init(wdCaps, function(err) {
    if (err) {
      console.log(deviceName.white + ' ' + platformVersion.white + ': ' + 'FAIL'.red);
      cb();
    }
    else {
      setTimeout(function() {
        browser.hasElementByClassName('android.widget.Button', function(err, result) {
          if (result) {
            console.log(deviceName.white + ' ' + platformVersion.white + ': ' + 'SUCCESS'.green);
          }
          else {
            console.log(deviceName.white + ' ' + platformVersion.white + ': ' + 'FAIL'.red);
          }
          browser.quit();
          if (cb) {
            cb();
          }
        });
      }, 5000);
    }
  });
}

if (require.main === module) {
  var devices = {
    'Android Emulator': ['2.3', '4.0', '4.1', '4.2', '4.3', '4.4', '5.0'],
    //'Samsung Galaxy S4 Emulator': ['2.3', '4.0', '4.1', '4.2', '4.3', '4.4', '5.0'],
    //'Samsung Galaxy S4 Device': ['4.4']
  };

  var makeTest = function(d, v) {
    return function(cb) {
      try {
        runTest(d, v, cb);
      }
      catch(e) {
        console.log("test errored");
        console.log(e);
        cb();
      }
    };
  };
  var tests = [];
  for (var device in devices) {
    var versions = devices[device];
    for (var i = 0; i < versions.length; i++) {
      var v = versions[i];
      var t = makeTest(device, v);
      tests.push(t);
    }
  }
  async.parallelLimit(tests, 5, function(err, results) {
  });
}
