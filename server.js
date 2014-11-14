var
http = require('http'),
qs = require('querystring');

module.exports = function(api, next){
   // api.log('Server init - Routes: '+Object.keys(api.routes));
   api._server = {};

   _doGet = function(req, resp){
      api.log('Getting '+req.url);
      
      if(api.routes[req.url] && api.routes[req.url]['get']){
         api.routes[req.url]['get'](req, resp, api);

      } else {

         resp.writeHead(200, {'Content-Type': 'text/json'});
         resp.end(JSON.stringify({code: 200, success: true, msg: "post some data to echo"}));

      }
   },
   _doPost = function(req, resp){
      api.log('Posting '+req.url);

      api.log('Available special routes: '+Object.keys(api.routes));

      if(api.routes[req.url] && api.routes[req.url]['post']){
         api.log('has special route');
         api.routes[req.url]['post'](req, resp, api);

      } else {
         api.log('no special route found');

         var requestBody = '';

         req.on('data', function(data){
            requestBody += data;
            if(requestBody.length > 1e7) {
               msg = "Request Entity Too Large";
               resp.writeHead(413, msg, {'Content-Type': 'text/json'});
               resp.end(JSON.stringify({success: false, code: 413, error_message: msg}));
            }
         });

         req.on('end', function(){
            var formData = qs.parse(requestBody);
            // api.log('');
            // api.log('Headers');
            // api.log(req.headers);
            // api.log('requestBody');
            // api.log(requestBody);
            api.log('formData');
            api.log(JSON.stringify(formData, null, 4));
            resp.writeHead(200, {'Content-Type': 'text/json'});
            resp.end(JSON.stringify({success: true, code: 200, data_echo: formData}));
         });

      }

   },
   _start = function(next){
      api._server.instance = http.createServer(function(req, resp){
         if(req.method == "GET"){
            _doGet(req, resp, next);
         } else if(req.method == "POST") {
            _doPost(req, resp, next);
         }
      });
      api._server.instance.listen(api._server.port);
      api.log("listening on "+ api._server.port);

      if(next)
         next();
   };

   api.configure = function(config){
      config = config || {};
      api.log('Configuring Webserver: '+JSON.stringify(config));
      if(config.port)
         api._server.port = config.port || 8080;
      if(config.routes)
         api.routes = config.routes || {};

   };

   api.start = function(next){
      if( api._server.instance && typeof api._server.instance.close == 'function' )
         api._server.instance.close(function(){
            _start(next);
         });
      else
         _start(next);
   };

   if(next) next();
};