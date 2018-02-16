# codeheader README

An header comment extension for vscode.

## Features

An header comment extension for vscode, and supports automatic update file modification time.

For example:

*javascript*

![feature 3](https://github.com/TuXiaokang/codeheader/raw/master/features/feature-3.png)

*python*

![feature 3](https://github.com/TuXiaokang/codeheader/raw/master/features/feature-4.png)


others languages: *lua*, *ruby*, *latex*, *lisp* ...

### Quick Insert Header Comment.
![feature 1](https://github.com/TuXiaokang/codeheader/raw/master/features/feature-1.gif)



### Auto Update Header Comment.

<!-- ![feature 2](features/feature-2.gif) -->

> Tip: `shift`+`alt`+`i` You can insert comments in the head, ctrl+s After you save the file, and automatically update the time and author.


## Configuration


This extension contributes the following settings:

* `codeheader.author`: Your name, it will be set to `git user.name` if not provided.
* `codeheader.email`: Your email address, it will be set to `git user.email` if not provided.
* `codeheader.copyright`: true/false to insert  extension
* `codeheader.copyrightOwner`: Your copyright owner, it will be set to `codeheader.author` if not provided.
* ...

You can DIY the header comment by setting:

![](https://github.com/TuXiaokang/codeheader/raw/master/features/feature-5-1.png)

![](https://github.com/TuXiaokang/codeheader/raw/master/features/feature-5-2.png)


## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

- Fisrt release.
- Insert header comment.
- Auto update header comment.
- Add copyright comment options.

### 0.1.2

- enable copyright default.
- remove unused image files.

## 0.1.3

- fix error format when not use copyright.

## 0.1.5

- fix readme.
- fix windows support.