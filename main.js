/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

/** Simple extension that adds a "File > Hello World" menu item */
define(function (require, exports, module) {
    "use strict";

    var CommandManager      = brackets.getModule("command/CommandManager"),
        Menus               = brackets.getModule("command/Menus"),
        AppInit             = brackets.getModule("utils/AppInit"),
        
        Dialogs             = brackets.getModule("widgets/Dialogs"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        FileUtils           = brackets.getModule("file/FileUtils"),
       
        FileSystem          = brackets.getModule("filesystem/FileSystem"),
        LanguageManager     = brackets.getModule("language/LanguageManager"),
        NodeDomain          = brackets.getModule("utils/NodeDomain"),
        NodeConnection      = brackets.getModule("utils/NodeConnection"),
        DocumentManager     = brackets.getModule("document/DocumentManager"),
        ProjectManager      = brackets.getModule("project/ProjectManager"),
        PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
        prefs               = PreferencesManager.getExtensionPrefs("powerbrackets"),
        FileTreeView        = brackets.getModule("project/FileTreeView"),
	    WorkingSetView      = brackets.getModule('project/WorkingSetView');

    var nodeDomain = new NodeDomain("powerbrackets", ExtensionUtils.getModulePath(module, "node/PowerBrackets"));

    var LESS_COMPILE_CMD = "powerbrackets.compileless",
        MINIFY_CMD = "powerbrackets.minify",
        COFFEE_COMPILE_CMD = "powerbrackets.compilecoffee",
        MARKDOWN_COMPILE_CMD = "powerbrackets.compilemarkdown",
        NEW_PROJECT_CMD = "powerbrackets.newproject",
        HANDLEBARS_COMPILE_CMD = "powerbrackets.compilehandlebars",
        REACT_COMPILE_CMD = "powerbrackets.compilereact";
    
    var commands = [ 
        LESS_COMPILE_CMD, 
        MINIFY_CMD, 
        COFFEE_COMPILE_CMD, 
        MARKDOWN_COMPILE_CMD, 
        NEW_PROJECT_CMD, 
        HANDLEBARS_COMPILE_CMD,
        REACT_COMPILE_CMD
    ];
    
    function removeAllCommandsFromMenu(menu) {
        var i;
        for (i = 0; i < commands.length; i++) {
            menu.removeMenuItem(commands[i]);
        }
    }
    
    function getFileExtension(filename) {
        var parts = filename.split('.'),
            ext = parts.pop(),
            next = parts.pop();
        
        if(next.toLowerCase() == 'min')
            return "min." + ext;
        return ext;
    }
    
    // Function to run when the menu item is clicked
    function compileLess() {
        var selectedEntry = ProjectManager.getSelectedItem();
        nodeDomain.exec("compileLess", selectedEntry.fullPath)
            .done(function (callback) {
                //done!
            }).fail(function (err) {
                console.error("[Power Brackets] failed to run powerbrackets.compileLess", err);
            });
    }
    
    function compileReact(){
        var selectedEntry = ProjectManager.getSelectedItem();
        nodeDomain.exec("compileReact", selectedEntry.fullPath)
        .done(function(callback){}).fail(function(err){
            console.error("[Power Brackets] failed to run powerbrackets.compileReact");
        });
    }
    
    function compileCoffee() {
        var selectedEntry = ProjectManager.getSelectedItem();
        nodeDomain.exec("compileCoffee", selectedEntry.fullPath)
            .done(function (callback) {
                //done!
            }).fail(function (err) {
                console.error("[Power Brackets] failed to run powerbrackets.compileCoffee", err);
            });
    }
    
    function compileHandlebars(){
        var selectedEntry = ProjectManager.getSelectedItem();
        nodeDomain.exec("compileHandlebars", selectedEntry.fullPath)
            .done(function (callback) {
                //done!
            }).fail(function (err) {
                console.error("[Power Brackets] failed to run powerbrackets.compileHandlebars", err);
            });
    }
    function compileMarkdown(){
        var selectedEntry = ProjectManager.getSelectedItem();
        nodeDomain.exec("compileMarkdown", selectedEntry.fullPath)
            .done(function (callback) {
                //done!
            }).fail(function (err) {
                console.error("[Power Brackets] failed to run powerbrackets.compileMarkdown", err);
            });
    }
    function minify() {
        var selectedEntry = ProjectManager.getSelectedItem();
        nodeDomain.exec("minify", selectedEntry.fullPath)
            .done(function (callback) {
                //done!
            }).fail(function (err) {
                console.error("[Power Brackets] failed to run powerbrackets.minify", err);
            });
    }
   
    function openProjectSelector(){
        var html = require("text!html/project-type-selector.html"),
            projectTemplates = JSON.parse(require("text!projectTemplates/meta.json"));
        var templateGroups = [];
        for(var k in projectTemplates){
            if(projectTemplates.hasOwnProperty(k)){
                templateGroups.push({
                    name: k,
                    total: projectTemplates[k].length
                })
            }
        }
        
        Dialogs.showModalDialogUsingTemplate(Mustache.render(html, {
            templateGroups:templateGroups
        }), true);
    }
ExtensionUtils.loadStyleSheet(module, "css/main.css");
    ExtensionUtils.loadStyleSheet(module, "css/font-awesome/font-awesome.min.css");
    CommandManager.register("Compile to css", LESS_COMPILE_CMD, compileLess);
    CommandManager.register("Minify", MINIFY_CMD, minify);
    CommandManager.register("Compile to js", COFFEE_COMPILE_CMD, compileCoffee);
    CommandManager.register("Compile to html", MARKDOWN_COMPILE_CMD, compileMarkdown);
    CommandManager.register("New Project", NEW_PROJECT_CMD, openProjectSelector);
    CommandManager.register("Compile to js", HANDLEBARS_COMPILE_CMD, compileHandlebars);
    CommandManager.register("Compile to js", REACT_COMPILE_CMD, compileReact);
    
    var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
    
    $(contextMenu).on("beforeContextMenuOpen", function () {
        var selectedEntry = ProjectManager.getSelectedItem();
        removeAllCommandsFromMenu(contextMenu);
        contextMenu.addMenuItem(NEW_PROJECT_CMD);
        switch (getFileExtension(selectedEntry.name)) {
        case "less":
            contextMenu.addMenuItem(LESS_COMPILE_CMD);
            break;
        case "js":
            contextMenu.addMenuItem(MINIFY_CMD);
            break;
        case "css":
            contextMenu.addMenuItem(MINIFY_CMD);
            break;
        case "coffee":
            contextMenu.addMenuItem(COFFEE_COMPILE_CMD);
            break;
        case "jsx":
            contextMenu.addMenuItem(REACT_COMPILE_CMD);
            break;
        case "markdown":
        case "mdown":
        case "mkdn":
        case "md":
        case "mkd":
        case "mdwn":
        case "mdtxt":
        case "mdtext":
        case "text":
            contextMenu.addMenuItem(MARKDOWN_COMPILE_CMD);
            break;
        case "handlebars":
        case "hbs":
            contextMenu.addMenuItem(HANDLEBARS_COMPILE_CMD);
            break;
        }
    });

    var iconProvider = function(treeItem){
        if(!treeItem.isFile){
            //directory
            return $('<i class="fa fa-folder"></i>');
        }
        //not directory
        var ext = getFileExtension(treeItem.fullPath);
        ext = ext.replace("min.", "");
        switch(ext){
            case "css":
                return $('<i class="fa fa-css3"></i>');
                break;
            case "html":
            case "htm":
                return $('<i class="fa fa-file-code-o"></i>');
                break;
            case "gitignore":
                return $('<i class="fa fa-ban"></i>');
                break;
                case "js":
                return $('<i class="fa fa-code"></i>');
                break;
            default:
                return $('<i class="fa fa-file-o"></i>');
                
                break;
        }
    };
    FileTreeView.addIconProvider(iconProvider);
    WorkingSetView.addIconProvider(iconProvider);
});