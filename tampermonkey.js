// ==UserScript==
// @name         qx_input_grade
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       eda
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