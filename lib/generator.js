"use strict";

var path = require("path"),
  handlebars = require("express-handlebars"),
  mjml2html = require("mjml");
var TemplateGenerator = function (opts) {
  var viewEngine = opts.viewEngine || {};
  if (!viewEngine.renderView) {
    viewEngine = handlebars.create(viewEngine);
  }
  this.viewEngine = viewEngine;
  this.viewPath = opts.viewPath;
  this.extName = opts.extName || ".handlebars";
};

TemplateGenerator.prototype.render = function render(mail, cb) {
  if (mail.data.html) return cb();

  var templatePath = path.join(
    this.viewPath,
    mail.data.template + this.extName
  );

  this.viewEngine.renderView(
    templatePath,
    mail.data.context,
    function (err, body) {
      if (err) return cb(err);
      const renderdHtml = mjml2html(body, {
        keepComments: false,
      });
      mail.data.html = renderdHtml.html;
      cb();
    }
  );
};

module.exports = TemplateGenerator;
