/*global casper,phantomcss*/
var path = "http://localhost:8080/index.html";

casper.start(path).then(function () {
    "use strict";
    phantomcss.screenshot('#lq-page-body', 'baseline');
});
casper.run();
