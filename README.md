# codeheader README

An header comment extension for vscode.

## Features

An header comment extension for vscode, and supports automatic update file modification time.

For example:

*javascript*

```js
/*--------------------------------------------------------------------------------
 * Copyright (c) 2018 TuXiaokang
 *
 * @Script: README.md
 * @Author: TuXiaokang
 * @Email: 931085856@qq.com
 * @Create At: 2018-02-02 14:11:18
 * @Last Modified By: TuXiaokang
 * @Last Modified At: 2018-02-02 15:21:41
 * @Description: This is description.
 *--------------------------------------------------------------------------------*/

```

*python*

```python
# Copyright (c) 2018 TuXiaokang
#
# -*- coding:utf-8 -*-
# @Script: py.py
# @Author: TuXiaokang
# @Create At: 2018-02-02 15:00:52
# @Last Modified By: TuXiaokang
# @Last Modified At: 2018-02-02 15:00:52
# @Description: This is description.

```

others language: *lua*, *ruby*, *latex*, *lisp* ...

### Quick Insert Header Comment.
![feature 1](https://github.com/TuXiaokang/codeheader/raw/master/images/feature-1.gif)



### Auto Update Header Comment.

<!-- ![feature 2](images/feature-2.gif) -->

> Tip: ctrl+alt+i You can insert comments in the head, ctrl+s After you save the file, and automatically update the time and author.

## Installation

Press `F1`, and type `ext install codeheader`


## Configuration


This extension contributes the following settings:

* `codeheader.author`: Your name, it will be set to `git user.name` if not provided.
* `codeheader.email`: Your email address, it will be set to `git user.email` if not provided.
* `codeheader.copyright`: true/false to insert  extension
* `codeheader.copyrightOwner`: Your copyright owner, it will be set to `codeheader.author` if not provided.
* ...


## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

- Fisrt release.
- Insert header comment.
- Auto update header comment.
- Add copyright comment options.
