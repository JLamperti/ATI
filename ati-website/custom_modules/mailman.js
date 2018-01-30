var nodemailer = require("nodemailer");
var replaceall = require("replaceall");
var fs = require('fs');
var keys = JSON.parse(fs.readFileSync("keys.json"));
var dba = require('./db-access.js');
var mail = require('./mailman.js');

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
    // service: "GMX Freemail",
    host: "mail.gmx.net",
    secure: true,
    auth: {
        user: keys.mail.username,
        pass: keys.mail.password
    }
});
/*------------------SMTP Over-----------------------------*/

exports.sendMail = function(mailto, subject , msgtxt, res) {
  var mailOptions={
        from: "ATI Webseite <" + keys.mail.username +">",
        to : mailto,
        subject : subject,
        html : msgtxt
    }
    // console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        console.log(error);
        res.end("error");
      }else{
        console.log("Message sent: " + response.toString());
        res.end("sent");
      }
    });
};

exports.sendValidationMail = function(EMail, req, res) {

  let query = "SELECT EMail, UserName, url FROM user,bestaetigungslinks WHERE EMail = '"+ EMail +"' AND UserID = UID";
  dba.performQuery(query, function (err, result) {
    if (err || result == undefined) {
        return console.log('Err: Bad query. (mailman.js:manipulateDB)');
    } else {
      let string = JSON.stringify(result);
      let json =  JSON.parse(string);

      // let msg = "Wilkommen "+ json[0].UserName + ", bitte verifiziere deine Mailaddresse unter folgendem Link:  http://"+ request.headers.host +"/login/"+json[0].url ;

      if (req.cookies['locale'] != undefined ) {
        var msg = fs.readFileSync('./views/email/mailTemplate_compressed_' + req.cookies['locale'] + '.html').toString();
      } else {
        var msg = fs.readFileSync('./views/email/mailTemplate_compressed_de.html').toString();
      }
      // console.log(msg);
      msg = replaceall("__NAME__", json[0].UserName, msg);
      msg = replaceall("__LINK__",  "http://"+ req.headers.host +"/login/"+json[0].url, msg);
      msg = replaceall("__WEBSITE__", "http://"+ req.headers.host, msg);

      mail.sendMail(json[0].EMail, "Verifiziere deine EMailadresse", msg);
    }
  });
};

exports.sendPWResetMail = function(EMail, req, res) {
  let query = "SELECT EMail, UserName, url FROM user,pwlinks WHERE EMail = '"+ EMail +"' AND UserID = UID";
  dba.performQuery(query, function (err, result) {
    let string = JSON.stringify(result);
    var json =  JSON.parse(string);
    if (err || result == undefined) {
        return console.log('Err: Bad query. (mailman.js:66)');

    } else if(Object.keys(json).length != 0){

      // let msg = "Wilkommen "+ json[0].UserName + ", bitte verifiziere deine Mailaddresse unter folgendem Link:  http://"+ request.headers.host +"/login/"+json[0].url ;
      if (req.cookies['locale'] != undefined) {
        var msg = fs.readFileSync('./views/email/mailPW_compressed_' + req.cookies['locale'] + '.html').toString();
      } else {
        var msg = fs.readFileSync('./views/email/mailPW_compressed_de.html').toString();
      }
      // console.log( msg);
      msg = replaceall("__NAME__", json[0].UserName, msg);
      msg = replaceall("__LINK__",  "http://"+ req.headers.host +"/login/reset/"+json[0].url, msg);
      msg = replaceall("__WEBSITE__", "http://"+ req.headers.host, msg);

      mail.sendMail(json[0].EMail, "Setze dein Passwort zurück.", msg);
    }
  });
};
