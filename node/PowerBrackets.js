(function () {
    "use strict";
    var less = require("less"),
        fs = require("fs"),
        path = require("path"),
        mkpath = require('mkpath'),
        minify = require('minify'),
        coffee = require('coffee-script'),
        markdown = require( "markdown" ).markdown,
        handlebars = require("handlebars");


    function cmdCompileMarkdown(filePath, callback){
        fs.readFile(filePath, function(err, data){
            if(err) callback(err);
            var htmlPath = replaceExtension(filePath, "html"),
                html = markdown.toHTML(data.toString());
            mkpath(path.dirname(htmlPath), function(err){
                if(err) callback(err);
                fs.writeFile(htmlPath, html, function(err){
                    if(err) callback(err);
                    cmdMinify(htmlPath, callback);
                });
            });
        });
    }
    
    function cmdCompileHandlebars(filePath, callback){
        console.log(filePath);
        fs.readFile(filePath, function(err, data){
            if(err) callback(err);
            var jsPath = replaceExtension(filePath, "handlebars.js");
            console.log(jsPath);
            var js = "var " + path.basename(filePath).split('.')[0] + " = Handlebars.template(" + handlebars.precompile(data.toString()) + ");";
            console.log(js);
            mkpath(path.dirname(jsPath), function(err){
                if(err) callback(err);
                fs.writeFile(jsPath, js, function(err){
                    if(err) callback(err);
                    cmdMinify(jsPath, callback);
                });
            });
        });
    }
    
    
    function cmdCompileLess(filePath, callback) {
        fs.readFile(filePath, function(err, data){
            if(err) callback(err);
            less.render(data.toString(), function(e, output){
                var containingPath = path.dirname(filePath),
                    cssPath = path.resolve(containingPath, replaceExtension(path.basename(filePath), "css")),
                    minCssPath = path.resolve(containingPath, replaceExtension(path.basename(filePath), "min.css"));
                
                mkpath(path.dirname(cssPath), function (err) {
                  if (err) {
                    callback(err);
                  }
                  fs.writeFile(cssPath, output.css, function(err){
                    if(err) callback(err);
                      
                    cmdMinify(cssPath, callback);
                  });
                });
            });
        });
    }
    
    function cmdMinify(filePath, callback){
        var extension = path.extname(filePath),
            minifiedPath = replaceExtension(filePath, "min" + extension);
        mkpath(path.dirname(minifiedPath), function(err){
            if(err) callback(err);
            minify(filePath, function(err, data){
                if(err) callback(err);
                fs.writeFile(minifiedPath, data, callback);
            });
        });
    }
    
    function cmdCompileCoffeeScript(filePath, callback){
        fs.readFile(filePath, function(err, data){
            if(err) callback(err);
            var jsPath = replaceExtension(filePath, "js"),
                js = coffee.compile(data.toString());
            mkpath(path.dirname(jsPath), function(err){
                if(err) callback(err);
                fs.writeFile(jsPath, js, function(err){
                    if(err) callback(err);
                    cmdMinify(jsPath, callback);
                });
            });
        });
    }
    
    function replaceExtension(name, newExtension){
        return name.substr(0, name.length - path.extname(name).length) + '.' + newExtension;
    }

    function init(domainManager) {
        if (!domainManager.hasDomain("powerbrackets")) {
            domainManager.registerDomain("powerbrackets", {major: 0, minor: 1});
        }
        domainManager.registerCommand(
            "powerbrackets",       // domain name
            "compileLess",    // command name
            cmdCompileLess,   // command handler function
            true,          // this command is asynchronous in Node
            "returns css comiled from less file",
            ["filePath"]
        );
        domainManager.registerCommand(
            "powerbrackets",       // domain name
            "compileHandlebars",    // command name
            cmdCompileHandlebars,   // command handler function
            true,          // this command is asynchronous in Node
            "returns js comiled from handlebars file",
            ["filePath"]
        );
        domainManager.registerCommand(
            "powerbrackets",       // domain name
            "compileCoffee",    // command name
            cmdCompileCoffeeScript,   // command handler function
            true,          // this command is asynchronous in Node
            "returns js comiled from coffee file",
            ["filePath"]
        );
        domainManager.registerCommand(
            "powerbrackets",       // domain name
            "compileMarkdown",    // command name
            cmdCompileMarkdown,   // command handler function
            true,          // this command is asynchronous in Node
            "returns html comiled from markdown file",
            ["filePath"]
        );
        domainManager.registerCommand(
            "powerbrackets",
            "minify",
            cmdMinify,
            true,
            "compiles css and js",
            ["filePath"]
        );
    }

    exports.init = init;
}());