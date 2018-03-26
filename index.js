var conversion = require("phantom-html-to-pdf")(),
    ejs = require('ejs'),
    fs = require('fs'),
    cors = require('cors')();

const route = function(req, res) {
  var q= req.query;
  if(
    typeof q.cpc=='undefined' ||
    typeof q.volume=='undefined' ||
    typeof q.conversionRate=='undefined' ||
    typeof q.closingRate=='undefined' ||
    typeof q.aov=='undefined' ||
    typeof q.cltv=='undefined' ||
    typeof q.spend=='undefined' ||
    typeof q.leads=='undefined' ||
    typeof q.cpl=='undefined' ||
    typeof q.sales=='undefined' ||
    typeof q.roi=='undefined' ||
    typeof q.cltv_sales=='undefined' ||
    typeof q.cltv_roi=='undefined'
  ){
    return res.status(400).send('Missing params');
  };

  fs.readFile('./template.html', 'utf8', function (err, html) {
    console.log(html);
    html= html = ejs.render(html, {q});
     conversion({ html }, function(err, pdf) {
      // pdf.stream.pipe(res);
      if(typeof q.view !== 'undefined' && q.view){       
        pdf.stream.pipe(res);
      }else{
        res.setHeader('content-type', 'application/download');
        res.setHeader('Content-Disposition', 'inline; filename="results.pdf"');
        pdf.stream.pipe(res);
      };
      
      
    });
  });

};


exports.handler = function handler(req, res) {
    return cors(req, res, ()=> route(req, res));
};
