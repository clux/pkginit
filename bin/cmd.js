#!/usr/bin/env node
var pkginit = require('../');
var fs = require('fs');

var argv = require('optimist').argv;
var cmd = argv._[0];
if (cmd === 'help' || argv.h || argv.help) {
    fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
    return;
}

pkginit({ context : argv }, function (err, pkg) {
    if (err) return console.error(err);
    
    if (cmd === 'add' && argv._.length == 3) {
        var name = argv._[1];
        var file = argv._[2];
        fs.readFile(file, function (err, src) {
            if (err) return console.error(err);
            pkg.add(name, src, function (err) {
                if (err) return console.error(err)
                else console.log('added file for ' + JSON.stringify(name))
            });
        });
    }
    else if (cmd === 'rm') {
        var name = argv._[1];
        pkg.rm(name, function (err) {
            if (err) console.error(err)
        });
    }
    else if (cmd === 'list' || cmd === 'ls' || cmd === 'l') {
        pkg.list(function (err, files) {
            if (err) console.error(err);
            if (files && files.length) {
                console.log(files.join('\r\n'));
            }
        });
    }
    else if (cmd === 'edit') {
        var opts = {
            editor : argv.editor || process.env.EDITOR || 'vim'
        };
        pkg.edit(argv._[1] || 'default', opts, function (err) {
            if (err) console.error(err);
        });
    }
    else {
        var name = (cmd === 'build' ? argv._[1] : argv._[0]) || 'default';
        
        var outfile = argv.outfile || argv.o || 'package.json';
        pkg.build(name, function (err, output) {
            if (err) console.error(err)
            else if (outfile === '-') {
                console.log(output);
            }
            else fs.writeFile(outfile, output, function (err) {
                if (err) return console.error(err)
                if (argv.verbose || argv.v) {
                    console.error('\r\nwrote file: ' + outfile);
                }
            });
        });
    }
});
