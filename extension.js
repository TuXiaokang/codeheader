// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const fs = require('fs')
const path = require('path')
const ini = require('ini')
const dot = require('dot');
const vscode = require('vscode');

dot.templateSettings = {
    evaluate:    /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g,
    encode:      /\{\{!([\s\S]+?)\}\}/g,
    use:         /\{\{#([\s\S]+?)\}\}/g,
    define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
    conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
    iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
    varname: 'it',
    strip: false,
    append: true,
    selfcontained: false
};

  // this method is used to format datatime string.
Date.prototype.format = function (fmt) {
    let t = {
        M: this.getMonth() + 1,
        d: this.getDate(),
        h: this.getHours(),
        m: this.getMinutes(),
        s: this.getSeconds()
    };
    fmt = fmt.replace(/(M+|d+|h+|m+|s+)/g, v => {
        return ((v.length > 1 ? "0" : "") + eval('t.' + v.slice(-1))).slice(-2)
    });

    fmt = fmt.replace(/(y+)/g, v => {
        return this.getFullYear().toString().slice(-v.length)
    });
    return fmt
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line will read configuration of user setting.
    let config = refreshConfiguration()
    let templates = dot.process({ path: path.join(__dirname, './templates') })

    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "codeheader" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('codeheader.insertHeader', function () {
        // The code you place here will be executed every time your command is executed
        const editor = vscode.editor || vscode.window.activeTextEditor
        const scriptName = editor.document.fileName.split('/').pop()
        const languageId = editor.document.languageId
        const line = editor.selection.active.line;

        editor.edit(function (edit) {
            const time = new Date().format(config.timeFormat);
            const data = {
                scriptName: scriptName,
                author: config.author,
                email: config.email,
                modifiedBy: config.modifiedBy,
                description: config.description,
                createAt: time,
                modifiedAt: time,
                year: new Date().getFullYear(),
                copyright: config.copyright,
                copyrightOwner: config.copyrightOwner,
                scriptLabel: config.scriptLabel,
                authorLabel: config.authorLabel,
                emailLabel: config.emailLabel,
                createAtLabel: config.createAtLabel,
                modifiedByLabel: config.modifiedByLabel,
                modifiedAtLabel: config.modifiedAtLabel,
                descriptionLabel: config.descriptionLabel,
            }
            try {
                let template = templates[languageId] || templates['javascript']
                edit.insert(new vscode.Position(line, 0), template(data));
            } catch (error) {
                console.error(error);
            }
        })

    });

    context.subscriptions.push(disposable);

    vscode.workspace.onDidChangeConfiguration(function (event) {
        config = refreshConfiguration()
    })

    // TODO: this method will be implemented in next release.
    // vscode.workspace.onDidOpenTextDocument(textDocument => {
    //     if (config.autoInsert === true) {
            
    //         vscode.commands.executeCommand('extension.codeheader')
    //     }
    // })

    vscode.workspace.onDidSaveTextDocument(document => {
        setTimeout(() => {
            try{
                const editor = vscode.editor || vscode.window.activeTextEditor;
                const lineCount = document.lineCount < 40 ? document.lineCount : 40;
                const fileName = document.fileName;
                let changeInfo = {};
                let interval = -1;
                let lineIndex = 0;
                let findCount = 0;

                while (lineIndex < lineCount) {
                    let lineRange = document.lineAt(lineIndex).range;
                    let lineText = document.lineAt(lineIndex).text;
                    if(lineText.includes(`@${config.scriptLabel}:`)) {
                        const index = lineText.indexOf(`@${config.scriptLabel}`)
                        let scriptName = fileName.split('/').pop()
                        changeInfo.scriptRange = lineRange
                        changeInfo.scriptText = lineText.slice(0, index) + `@${config.scriptLabel}: ${scriptName}`
                        findCount = findCount + 1;
                    } else if(lineText.includes(`@${config.modifiedAtLabel}:`)) {
                        const index = lineText.indexOf(`@${config.modifiedAtLabel}`)
                        const mtime = lineText.slice(index).replace(`@${config.modifiedAtLabel}: `, '').trim();
                        const oldTime = new Date(mtime)
                        const curTime = new Date();
                        const curFmtTime = curTime.format(config.timeFormat)
                        interval = (curTime - oldTime) / 1000;
                        changeInfo.modifiedAtRange = lineRange
                        changeInfo.modifiedAtText = lineText.slice(0, index) + `@${config.modifiedAtLabel}: ${curFmtTime}`
                        findCount = findCount + 1;
                    } else if(lineText.includes(`@${config.modifiedByLabel}:`)) {
                        let index = lineText.indexOf(`@${config.modifiedByLabel}`)
                        changeInfo.modifiedByRange = lineRange
                        changeInfo.modifiedByText = lineText.slice(0, index) + `@${config.modifiedByLabel}: ${config.author}`
                        findCount = findCount + 1;
                    }
                    if (findCount >= 3) {
                        break;
                    }
                    lineIndex = lineIndex + 1;
                }
      
                if (interval > 20 && (changeInfo.scriptRange || changeInfo.modifiedAtRange || changeInfo.modifiedByRange)) {
                    setTimeout(() => {
                        editor.edit((edit) => {
                            edit.replace(changeInfo.scriptRange, changeInfo.scriptText)
                            edit.replace(changeInfo.modifiedByRange, changeInfo.modifiedByText);
                            edit.replace(changeInfo.modifiedAtRange, changeInfo.modifiedAtText);
                        });
                        // this method it will recall onDidSaveTextDocument
                        document.save();
                    }, 200);
                }
            } catch (error) {
                console.log(error);
            }
        }, 500);
    })
}

exports.activate = activate;

// this method is used for refresh config when config file was changed.
function refreshConfiguration () {
    const vsc = vscode.workspace.getConfiguration('codeheader')
    const git = getGitConfiguration()
    let config = {
        timeFormat: vsc.timeFormat || 'yyyy-MM-dd hh:mm:ss',
        author: vsc.author || git.user.name || 'Your Name',
        email: vsc.email || git.user.email || 'someone@gmail.com',
        modifiedBy: vsc.author || git.user.name || 'Your Name',
        description: vsc.description || "This is description.",
        autoInsert: vsc.autoInsert || false,
        copyright: vsc.copyright || false,
        copyrightOwner: vsc.copyrightOwner || vsc.author || git.user.name || 'Your Name',
        scriptLabel: vsc.scriptLabel || 'Script',
        authorLabel: vsc.authorLabel || 'Author',
        emailLabel: vsc.emailLabel || 'Email',
        createAtLabel: vsc.createAtLabel || 'Create At',
        modifiedByLabel: vsc.modifiedByLabel || 'Last Modified By',
        modifiedAtLabel: vsc.modifiedAtLabel || 'Last Modified At',
        descriptionLabel: vsc.descriptionLabel || 'Description'
    }
    return config
}

// this method is used for read and parse .gitconfig file
function getGitConfiguration() {
    let config = null;
    let filePath = path.join(process.env.HOME, '.gitconfig');
    if (fs.existsSync(filePath) === true) {
        config = ini.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return config;
}

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;