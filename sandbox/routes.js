/**
Copyright (C) 2013 Moko365 Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

var express = require('express');
var expressHttps = require('express-https');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.set('X-Auth-Required', 'true');
  res.redirect('/login/?returnUrl='+ encodeURIComponent(req.originalUrl));
}

function ensureAdmin(req, res, next) {
  if (req.user.canPlayRoleOf('admin')) {
    return next();
  }
  res.redirect('/');
}

function ensureAccount(req, res, next) {
  if (req.user.canPlayRoleOf('account')) {
    if (req.app.get('require-account-verification')) {
      if (req.user.roles.account.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
        return res.redirect('/account/verification/');
      }
    }
    return next();
  }
  res.redirect('/');
}

function ensureMentor(req, res, next) {
  if (req.user.canPlayRoleOf('mentor')) {
    return next();
  }
  res.redirect('/');
}

function ensureLocale(req, res, next) {
    // force to use 'zh-tw' at the moment
    res.setLocale('zh-tw');

    // for debug
    // console.log(req.acceptedLanguages);
    // console.log(res.getLocale());
    next();
}

function ensureProtocol(req, res, next) {
    if (req.app.locals.development === true)
        return next();

    if (req.protocol === 'https')
        req.app.locals.cdnServer = '';
    else
        req.app.locals.cdnServer = req.app.get('cdn-server');

    return next();
}

function countPage(req, res, next) {
    req.headers.referer = req.headers.referer ? req.headers.referer : '';

    var fieldsToSet = {
        path: req.url,
        referer: req.headers.referer,
        useragent: req.headers['user-agent'],
        ip: req.connection.remoteAddress
    };

    if (typeof req.user !== 'undefined') {
        fieldsToSet.userCreated = {
            id: req.user._id,
            name: req.user.username
        };
    }
    req.app.db.models.ViewHistory.create(fieldsToSet, function(err, vs) {});
    return next();
}

function dummy(req, res, next) {
    next();
}

exports = module.exports = function(app, passport) {
    app.get('/', require('./views/index').init);
    app.get('/about', require('./views/about/index').init);
    app.get('/contact', require('./views/contact/index').init);
    app.get('/training/:course', require('./views/training').init);
    app.get('/test', require('./views').calendar);
    app.post('/email', require('./views/email/index').create);
    //route not found
    app.all('*', require('./views/http/index').http404);
};

