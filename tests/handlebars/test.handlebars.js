var test = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<h1>\n    "
    + escapeExpression(((helper = (helper = helpers.helloworld || (depth0 != null ? depth0.helloworld : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"helloworld","hash":{},"data":data}) : helper)))
    + "\n</h1>";
},"useData":true});