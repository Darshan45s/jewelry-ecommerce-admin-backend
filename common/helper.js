const crypto = require('crypto');
const nodemailer = require('nodemailer');

async function sendMail(htmlContent, subject, email) {
	try {
		var transporter = nodemailer.createTransport({
			transport: `${process.env.MAIL_TRANSPORT}`,
			host: `${process.env.MAIL_HOST}`,
			port: `${process.env.EMAIL_HOST}`,
			debug: true,
			auth: {
				user: `${process.env.MAIL_AUTH_USER}`,
				pass: `${process.env.MAIL_AUTH_PASSWORD}`,
			},
			secure: false,
			tls: { rejectUnauthorized: false },
			debug: true,
		});
		var mailOptions = {
			from: `'${process.env.PROJECT_NAME}' <${process.env.MAIL_AUTH_USER}>`,
			to: email,
			subject: subject,
			html: htmlContent,
		};

		var mail = await transporter.sendMail(mailOptions);

		if (mail) {
			return mail;
		} else {
			return false;
		}
	} catch (error) {
		return error;
	}
}


async function generateRandomNumber(length) {
    let result = '';
    const characters = '123456789';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
      const randomValue = crypto.randomBytes(1)[0];
      result += characters.charAt(randomValue % charactersLength);
    }
    
    return result;
  }

  module.exports = {
    sendMail,
    generateRandomNumber
  }
