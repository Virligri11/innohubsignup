// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//     service: "Outlook365",
//     host: 'smtp.office365.com',
//     secureConnection: false, // TLS requires secureConnection to be false
//     port: 587, // port for secure SMTP
//     tls: {
//        ciphers:'SSLv3'
//     },
//     auth: {
//         user: 'signup-notification@ncpachina.org',
//         pass: 'fJG7H3,W'
//     }
// });


// var n = "gedfn cegrnfdmn cegnrufids cgerxnfsduhcm gxnerfsdhc"
// var mailOptions = {
//     from: 'signup-notification@ncpachina.org',
//     to: '2250027@ncpachina.org',
//     cc:'2240317@ncpachina.org',
//     subject: 'Innohub signup',
//     text: n,

// };													
// transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.log(error.message)
//     }
// });


const mysql = require("mysql");
const connection= mysql.createConnection({
	host:'127.0.0.1',
	user:'root',
	password:'20070704millie',
	database:'innohub'
});

for(var i =0;i<timeperiod.length;i++){
    var select = 'SELECT count(1) FROM records where date = ? and time = ? and name = ? and classname = ?';
    connection.query(select,[date,timeperiod,teachername.toLowerCase(),classname.toLowerCase()],(err,result)=>{
        if(err) {
            res.render("error.ejs",{message:"Please check the date and the name"})
        }
        var testn = (JSON.parse(JSON.stringify(result)))
        whethersignup +=  testn[0]['count(1)'];
    });
}