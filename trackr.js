var
trackr = {},
log = require('./logging')(trackr),
includes = ['./data', './actions', './routes', './server'];
// data = require('./data'),
// webserver = require('./server');
// db = require
// mongoose = require('mongoose'),
// models = require('./data_models')(mongoose);

var chainLoad = function(arr, next){

    if(arr.length == 0){
        trackr.log('Chain loading complete');
        return next();
    }

    var r = arr.shift();
    trackr.log('Chain loading: '+r);
    require(r)(trackr, function(){
        // trackr.log('API so far: '+Object.keys(trackr));
        chainLoad(arr, next);
    });
};

chainLoad(includes, function(){
    trackr.configure({
        port: process.env.port || 8080
    });

    console.log('trackr root api: '+Object.keys(trackr));
    console.log('trackr.mongo: '+Object.keys(trackr['mongo']));
    console.log('trackr.mongo.models: '+Object.keys(trackr['mongo']['models']));
    trackr.start(ready);
});


function ready() {
    console.log('Awaiting Connections');
}

