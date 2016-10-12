require('babel-register')();

var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('<div id="global"></div>');

global.window = document.defaultView;
jsdom.jQueryify(global.window, "http://code.jquery.com/jquery-2.1.1.js", function () {
    // window.$("body").append('<div class="testing">Hello World, It works</div>');
    // console.log(window.$(".testing").text());
});
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});


global.navigator = {
  userAgent: 'node.js'
};

documentRef = document;
