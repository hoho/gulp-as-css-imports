var asCSSImports = require('../');
var should = require('should');
var path = require('path');
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;
var fs = require('fs');
require('mocha');


describe('gulp-as-css-imports', function() {
    describe('asCSSImports()', function() {
        testAsCSSImports(
            asCSSImports('imp.css'),
            [
                'test/file1.css',
                'test/file2.css'
            ],
            [
                'test/file1.css', '.file1 {}',
                'test/file2.css', '.file2 {}',
                'imp.css', '@import url(test/file1.css);\n@import url(test/file2.css);'
            ]
        );

        testAsCSSImports(
            asCSSImports('imp2.css', 'https://as-is'),
            [
                'test/file1.css',
                'test/file2.css'
            ],
            [
                'test/file1.css', '.file1 {}',
                'test/file2.css', '.file2 {}',
                'imp2.css', '@import url(https://as-is);\n@import url(test/file1.css);\n@import url(test/file2.css);'
            ]
        );

        testAsCSSImports(
            asCSSImports('imp3.css', ['https://as-is', 'https://as-is-2'], true),
            [
                'test/file1.css',
                'test/file2.css'
            ],
            [
                'test/file1.css', '.file1 {}',
                'test/file2.css', '.file2 {}',
                'imp3.css', '@import url(test/file1.css);\n@import url(test/file2.css);\n@import url(https://as-is);\n@import url(https://as-is-2);'
            ]
        );

        function testAsCSSImports(stream, files, results) {
            it('should create file with imports', function(done) {
                stream.on('data', function (file) {
                    var expectedFilename = results.shift(),
                        expectedHead = results.shift();

                    should.exist(file);
                    should.exist(file.relative);
                    should.exist(file.contents);
                    should.exist(expectedFilename);
                    should.exist(expectedHead);

                    var retFilename = path.resolve(file.path);
                    retFilename.should.equal(path.resolve(expectedFilename));
                    file.relative.should.equal(expectedFilename);

                    Buffer.isBuffer(file.contents).should.equal(true);
                    file.contents.toString().substring(0, expectedHead.length).should.equal(expectedHead);

                    if (results && !results.length) {
                        results = null;
                        done();
                    }
                });

                files.forEach(function (filename) {
                    filename = path.resolve(filename);
                    stream.write(new File({
                        path: filename,
                        contents: fs.readFileSync(filename)
                    }));
                });

                stream.end();

                if (results && !results.length) {
                    results = null;
                    done();
                }
            });
        }
    });
});
