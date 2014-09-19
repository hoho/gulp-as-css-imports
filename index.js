/*!
 * gulp-as-css-imports, https://github.com/hoho/gulp-as-css-imports
 * (c) 2014 Marat Abdullin, MIT license
 */

'use strict';

var through = require('through');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var Buffer = require('buffer').Buffer;
var fs = require('fs');
var path = require('path');


module.exports = function(filename, asIs, after) {
    var cssImports = [],
        asIsFiles = [];

    if (typeof filename !== 'string') {
        throw new PluginError('gulp-as-css-imports', '`filename` should be string');
    }

    if (asIs) {
        if (typeof asIs === 'string') {
            asIsFiles = [asIs];
        } else if (asIs instanceof Array) {
            asIsFiles = asIs;
        } else {
            throw new PluginError('gulp-as-css-imports', '`asIs` should be string or array');
        }
    }

    function bufferContents(file) {
        if (file.isNull()) { return; }
        if (file.isStream()) { return this.emit('error', new PluginError('gulp-as-css-imports', 'Streaming not supported')); }

        this.emit('data', file);
        cssImports.push(path.relative('.', file.path));
    }

    function endStream() {
        var imports = after ? [].concat(cssImports, asIsFiles) : [].concat(asIsFiles, cssImports);

        this.emit('data', new File({
            path: filename,
            contents: new Buffer(imports.map(function(file) { return '@import url(' + file + ');'; }).join('\n'))
        }));

        this.emit('end');
    }

    return through(bufferContents, endStream);
};
