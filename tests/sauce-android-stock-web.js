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
    platformName: 'Android',
    platformVersion: platformVersion,
    deviceName: deviceName,
    appiumVersion: "1.4",
    browserName: 'Browser'
  };

  var wdCaps = {
    name: deviceName + ' ' + platformVersion,
    platform: 'Linux',
    version: platformVersion,
    device: deviceName,
    browserName: 'Android'
  };

  browser.init(caps, function(err) {
    if (err) {
      console.log(deviceName.white + ' ' + platformVersion.white + ': ' + 'FAIL'.red);
      console.log(err);
      cb();
    }
    else {
      browser.get("http://michaelhan.ca", function(err) {
        browser.hasElementByLinkText('Resume', function(err, result) {
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
      });
    }
  });
}

if (require.main === module) {
  var devices = {
    'Android Emulator': ['4.4', '5.0'],
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
