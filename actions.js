function hasValidKeys(hash, keys){
    var valid = true,
    existing_keys = Object.keys(hash);

    keys.every(function(key, index, arr){
        valid = valid && existing_keys.indexOf(key) > -1;
        valid = valid && hash[key];
        return valid;
    });
    return valid;
}

module.exports = function(api, next){
    api.temps = {};
    var
    models = api.mongo.models;

    api.temps.postTemp = function(details, next){
        details = details || {};
        var save_status = 'NO_UPDATE',
        required_keys = ['deviceId', 'value'];

        if(hasValidKeys( details, required_keys )){
            if(!details['timestamp'])
                details.timestamp = new Date().getTime();
            var temp = new models.temperature.model(details);

            temp.save(function(err, entry, numberAffected){
                api.log('Save Attempted');
                if(err){
                    api.log('Save failed');
                    return next(err, save_status);
                }
                api.log('Saved successfully: ', entry);
                next(err, "OK");
            });

            // models.temperature.model.update(
            //         {'deviceId': details.deviceId}, details,
            //         {upsert: true}, function(err, numberAffected, raw){
            //     if(err)
            //         next(err, 'FAIL');
            //     else {
            //         if(numberAffected > 0) save_status = 'OK';
            //         next(err, save_status);
            //     }
            // });
        }
        else {
            api.log("Invalid Keys: ", required_keys, " For ", details);
            next(null, save_status);
        }
    };

    api.temps.getLatest = function(next){
        var
        err = null,
        pattern = 'node:',
        dummy_nodes = [
            {name: 'foo', temp: 22},
            {name: 'bar', temp: 19}
        ];
        // models.temperature.model.distinct('name', { timestamp: {'$max': true}}, function(err, values){
        // models.temperature.model.distinct('name', {}, function(err, values){
        // models.temperature.model.find({}, function(err, values){
        // models.temperature.model.aggregate({'$group':{_id:'$name', timestamp:{$max:"$timestamp"}, 'temp':{'$first':'$temp'}, 'unit':{'$first': '$unit'}}}, function(err, values){
        models.temperature.model.aggregate({'$group':{_id:'$deviceId', timestamp:{$max:"$timestamp"}, 'value':{'$first':'$value'}, 'unit':{'$first': '$unit'}}}, function(err, values){
            // api.log('latest temperature values');
            // api.log(JSON.stringify(arguments, null, 4));
            next(err, values);
        });
        // db.temperature.aggregate({$group:{_id:'$name', timestamp:{$max:"$timestamp"}, 'temp':{'$first':'$temp'}, 'unit':{'$first': '$unit'}}}).result
        
        // next(err, dummy_nodes);
    };

    if(next) next();
};