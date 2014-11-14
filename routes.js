var qs = require('querystring');

function json_end(resp, code, payload){
    resp.writeHead(code, /*msg,*/ {'Content-Type': 'text/json'});
    resp.end(JSON.stringify({success: code < 400, code: code, response: payload}));
}

module.exports = function(api, next){
    api.routes = {};

    api.routes['/api/temperature/list'] = {
        get: function(req, resp, api){
            api.temps.getList(function(err, nodes){
                
                if(err)
                    return json_end(err, 400, "Bad Juju");

                return json_end(resp, 200, nodes);
            });
        }
    }

    api.routes['/api/temperature'] = {
        get: function(req, resp, api){
            api.temps.getLatest(function(err, nodes){

                if(err)
                    return json_end(resp, 400, "Bad Juju");

                return json_end(resp, 200, nodes);
            });
        },

        post: function(req, resp, api){
            api.log('Executing specialized route');

            var requestBody = '';

            req.on('data', function(data){
                requestBody += data;
                if(requestBody.length > 1e7) {
                    json_end(resp, 413, "Request Entity Too Large");
                }
            });

            req.on('end', function(){
                var formData = qs.parse(requestBody);
                api.log('formData');
                api.log(JSON.stringify(formData, null, 4));
                var node_details = formData;

                api.temps.postTemp(node_details, function(err, status){
                    if(err){
                        return json_end(resp, 400, {original_data: node_details});
                        // resp.end(JSON.stringify({success: false, code: 200, data_echo: formData}));
                    }
                    return json_end(resp, 200, {status: status, data_echo: node_details});
                });

                // resp.writeHead(200, {'Content-Type': 'text/json'});
                // resp.end(JSON.stringify({success: true, code: 200, data_echo: formData}));
            });
        }
    };

    if(next) next();
};