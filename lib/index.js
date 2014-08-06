var spawn = require('child_process').spawn,
    fs = require('fs'),
    __ = require('underscore');

module.exports.du = function (path, callback) {
    fs.exists(path, function (exists) {
        if (! exists) {
            callback(null, {});
            return
        }
        var proc = spawn('du', ['--bytes', '--max-depth', '1', path]);
        var result = new Buffer(0),
            error = new Buffer(0);

        proc.stdout.on('data', function (d) {
            result = Buffer.concat([d, result]);
        });
        proc.stderr.on('data', function (d) {
            error = Buffer.concat([error, d]);
        });
        proc.on('close', function (code) {
            var obj = {};
            result = result.toString('utf-8').split('\n');

            for (var i= 0, l=result.length; i<l; i++) {
                var segments = result[i].split('\t');
                if (! segments[0] || ! segments[1]) {
                    continue;
                }
                var key = segments[1].substr(path.length).replace('/', '') || '.';
                obj[key] = segments[0];
            }

            callback(error, obj);
        });
    });
};

module.exports.df = function (path, callback) {
    var proc = spawn('df', [path]);
    var result = new Buffer(0),
        error = new Buffer(0);

    proc.stdout.on('data', function (d) {
        result = Buffer.concat([d, result]);
    });
    proc.stderr.on('data', function (d) {
        error = Buffer.concat([error, d]);
    });
    proc.on('close', function (code) {
        result = result.toString('utf-8').split('\n');
        var values = (result[1] || '').split(/\s+/),
            keys = ['filesystem', 'blocks', 'used', 'available', 'percent_used', 'mounted_on'],
            obj = __.object(keys, values);

        obj.percent_used = parseFloat(obj.percent_used);
        callback(error.toString('utf-8'), obj);
    });
};