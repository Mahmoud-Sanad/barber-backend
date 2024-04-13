const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "yourhotmail@email.com",
            pass: "yourpassword",
        },
    });

    const mailOptions = {
        from: '"Your Name" <yourhotmail@email.com>', 
        to: options.email, 
        subject: options.subject, 
        text: options.message, 
     
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
