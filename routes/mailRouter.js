
var nodemailer = require('nodemailer');


exports.sendEmail = function(req, res){
    var transporter = nodemailer.createTransport({

         service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'is.almaraz.a@gmail.com',
            pass: 'Azulvioleta20'
        }  
  
 /*        host: "mail.smartfundlimited.info",
        port: 26,
        auth: {
            user: 'mail@smartfundlimited.info',
            pass: 'QuGAjZl10EmA'
        }  */
    });


    transporter.sendMail(req.body, function(error, info){
       if (error){
          console.log(error);
          res.send(500, error.message);
       } else {
          console.log("Email sent");
          res.status(200).jsonp(req.body);
       }
    });
};
