/**
 * Created by nguyen.duc.quyet on 30/07/2019.
 */
var model = require('../model');
const puppeteerException = model.PuppeteerException;

function savePuppeteerException(data){
    var exception_data = new puppeteerException(data);
    exception_data.save(function(err) {});
}

exports.savePuppeteerException = savePuppeteerException;