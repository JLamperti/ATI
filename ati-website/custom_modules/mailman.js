var nodemailer = require("nodemailer");
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
        text : msgtxt
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        console.log(error);
        res.end("error");
      }else{
        console.log("Message sent: " + response.message);
        res.end("sent");
      }
    });
};

exports.sendValidationMail = function(EMail, res) {

  let query = "SELECT EMail, UserName, url FROM user,bestaetigungslinks WHERE EMail = '"+ EMail +"' AND UserID = UID";
  dba.performQuery(query, function (err, result) {
    if (err || result == undefined) {
        return console.log('Err: Bad query. (db-acces.js:manipulateDB)');
    } else {
      let string = JSON.stringify(result);
      let json =  JSON.parse(string);

      let msg = "Wilkommen "+ json[0].UserName + ", bitte verifiziere deine Mailaddresse unter folgendem Link:  http://localhost:3000/login/"+json[0].url ;

      mail.sendMail(json[0].EMail, "Verifiziere deine EMailadresse", msg);
    }
  });
};
