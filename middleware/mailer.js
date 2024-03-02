const nodemailer = require('nodemailer');



let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "findpg245@gmail.com",
      pass: "vlxtzpjtcwglxawt"
    }
  })

  let details = {
    from:"findpg245@gmail.com",
    to:"dewangantrilok245@gmail.com",
    subject:"verification mail for your email from findpg",
    text:"teting the nodemailer"
  }

  async function sendEmail(to, subject, text) {
    const mailOptions = {
      from: 'findpg245@gmail.com',
      to : to,
      subject: subject,
      text:text,
    };
  
    const result =await mailTransporter.sendMail(mailOptions);
    if(result){
        return true;
    }else{
        return false;
    }
    
    }
  
  
  module.exports = { sendEmail };