## 一、青果系统成绩批量录入插件

### 1、简介

基于wokoo脚手架和Tampermonkey开发的青果系统成绩批量录入插件，免去未开通“成绩粘贴”高级服务院校的老师“手动”录入成绩的烦恼。效果如下：

![img](http://photogzmaz.photo.store.qq.com/psc?/V53BXybs318Myc1t3o314I365E3JgO1m/TmEUgtj9EK6.7V8ajmQrEBX7j2RvLxZYqPWu7VlNmdyQbjA40Hh3.2TyWfrAAI7wZTS*dLoTe0QYac58jvbjGM0oI72jpMlq5IS5CjwrmY4!/b&bo=swSOArMEjgIBByA!&rf=viewer_4)

### 2、技术栈

vue 2.7.16   +   less 4.5.1  +   webpack 5.104.1  +  node 16.1.0

### 3、目录结构

```
.
├── README.md 说明
├── package-lock.json
├── package.json
├── public 静态文件
│   ├── favicon.ico
│   ├── icon.jpg
│   └── index.html html 文件
├── src
│   ├── app.less
│   ├── app.vue
│   └── index.js 项目入口
├── tampermonkey.txt 油猴脚本入口文件
├── webpack.config.base.js
└── webpack.config.js webpack 配置
```

## 二、开发、调试、构建与发布

### 1、启动

进入项目目录后，在命令行中输入：

```shell
npm start
```

### 2、调试

● 打开浏览器，输入`localhost:8080`，查看页面展示是否正常。

● 安装油猴插件

● 打开油猴插件编辑界面，将tampermonkey.js里的内容复制到编辑框中，保存。

```js
// ==UserScript==
// @name         qx_input_grade
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author		 eda
// @match        http://jwgl.lypt.edu.cn/jwweb/XSCJ/KCCJ_ADD_rpt_T.aspx
// @match        http://jwgl.lypt.edu.cn/jwweb/XSCJ/Tea_HJCJLR_addtemp_rpt.aspx

// ==/UserScript==

;(function () {
  'use strict'
  if (location.href === 'http://localhost:8080/') return
  var script = document.createElement('script')
  script.src = 'http://localhost:8080/app.bundle.js'
  document.body.appendChild(script)
})()
```

● 打开青果系统成绩录入界面，网页的右上角会出现插件界面。

### 3、构建

```shell
npm run build
```

### 4、发布

油猴市场的优点是不用审核，即发即用，非常方便。

● 将/dist/app.bundle.js 文件部署到cdn上，获取到对应url。（可放github上，如果托管到git上最好做cdn加速）

> 我的CDN部署路径：https://cdn.jsdelivr.net/gh/58city/qx_input_grade@main/dist/app.bundle.js

● 登录[油猴市场](https://greasyfork.org/)，谷歌账号或 github 账号都可使用。

● 点击账号名称，再点击**发布你编写的脚本**

● 进入编辑页将tampermonkey.js里的内容复制到编辑框中，将里面的`localhost:8080`网址替换成静态资源url

● 点击 「发布脚本」即可