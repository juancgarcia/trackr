var fs = require('fs'),
path = require('path');

module.exports = function(api, next){
    var
    filename = (new Date).toISOString()+'.log',
    folder = 'log'
    path = path.join(folder, filename);

    api.log = function(){
        var message;
        console.log.apply(this, arguments);
        try {
            message = JSON.stringify(arguments);
        } catch(e) {
            message = String(arguments);
        }
        message+="\r\n";
        if(fs.appendFile)
        fs.appendFile(path, message, null, function(){
            ; // don't really care to be notified when the log gets written
        });
        else
        fs.open(path, 'a', '0666', function(err, fd){
            if(err) {
                fs.close(fd);
                return;
            }
            fs.write(fd, message, 0, message.length, null, function(){
                ; // don't really care to be notified when the log gets written
            });
            fs.close(fd);
        });
    };

    if(next)
        next();

    return api.log;
}