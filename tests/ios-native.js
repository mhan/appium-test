require('colors');
var path = require('path'),
    wd = require('wd'),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var config = require(path.join(__dirname, '../creds/local-creds.json'));

var USER = config.USER;
var PORT = config.PORT;
var HOST = config.HOST;
var KEY = config.KEY;

module.exports = function(port, cb) {
    chaiAsPromised.transferPromiseness = wd.transferPromiseness;
    var automator = wd.promiseChainRemote({
        host: HOST,
        port: PORT,
        username: USER,
        accessKey: KEY
    });

    automator.on('status', function(info) {
        console.log(info.cyan);
    });

    automator.on('command', function(meth, path, data) {
        console.log(' > ' + meth.yellow, path.grey, data || '');
    });

    var caps = {
        name: 'appium-test/tests/sauce-ios',
        app: path.normalize(path.join(__dirname, '../apps/TabTestApp.app')),
        platformVersion: '8.1',
        platformName: 'iOS',
        deviceName: 'iPhone Simulator'
    };
    automator
        .init(caps)
        .elementByName('Second')
        .click()
        .hasElementByName('Second View')
            .should.eventually.be.true
        .fin(function() { return automator.quit(); })
        .done();
}

if (require.main === module) {
    module.exports(4723);
}
