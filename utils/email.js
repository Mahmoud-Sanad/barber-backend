const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
   const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // Outlook SMTP server
    port: 587, // Outlook SMTP port
    tls:{
      ciphers:"SSLv3",
      rejectUnauthorized:false  
    },
    auth: {
        user: "salon.barber@outlook.com",
        pass: "123Barber",
    },
   
});

    const mailOptions = {
        from: 'Salon <salon.barber@outlook.com>', 
        to: options.email, 
        subject: options.subject, 
        text: options.message, 
     
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
