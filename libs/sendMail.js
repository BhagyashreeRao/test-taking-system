exports.sendMail = function(from,to,subject,text,html){
	var nodemailer = require('nodemailer');
	var smtpTransport = require('nodemailer-smtp-transport');
	
	var transporter = nodemailer.createTransport(smtpTransport({
	   //First enter Service of your email
	   service: 'Gmail',
	   auth: {
		   //Enter email here
	       user: '!!!YOUR EMAIL!!!',

		   //Enter your password here
	       pass: '!!!YOUR GMAIL PASSWORD!!!'
	   }
	}));
    //Send mail
	transporter.sendMail({
           from: from,
           to: to,
           subject: subject,
           text: text,
           html: html
    });
	//Free up the resources
    transporter.close();     
};