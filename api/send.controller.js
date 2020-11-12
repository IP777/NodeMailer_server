const nodemailer = require("nodemailer");
require("dotenv").config();

const { MAIL_LOGIN, MAIL_PASS, PITER_MAIL, VADOS_MAIL } = process.env;

//Использован пакет Nodemailer
//https://nodemailer.com/about/

async function sendMail(req, res, next) {
	const { name, email, message } = req.body;
	const { user } = req.params;

	const sender_mail = () => {
		if (user === "piter") {
			return PITER_MAIL;
		}
		return VADOS_MAIL;
	};

	try {
		let transporter = nodemailer.createTransport({
			host: "smtp.meta.ua",
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: MAIL_LOGIN, // generated ethereal user
				pass: MAIL_PASS, // generated ethereal password
			},
		});

		// let transporter = nodemailer.createTransport({
		// 	service: "gmail",
		// 	auth: {
		// 		user: MAIL_LOGIN, // generated ethereal user
		// 		pass: MAIL_PASS, // generated ethereal password
		// 	},
		// });

		//send mail with defined transport object
		let info = await transporter.sendMail({
			from: `${MAIL_LOGIN}`, // sender address
			to: sender_mail(), // list of receivers
			subject: "Оповешение с сайта резюме.", // Subject line
			//text: "Hello world--?", // plain text body
			html: `<b>${name} пишет:</b><br><p>${message}</p>`, // html body
		});

		res.status(200).send(info.messageId);
	} catch (err) {
		next(err);
	}
}

async function testServer(req, res, next) {
	try {
		res.status(200).send("Server is working maybe!");
	} catch (err) {
		next(err);
	}
}

module.exports = {
	sendMail,
	testServer,
};
