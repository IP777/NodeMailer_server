const nodemailer = require("nodemailer");
require("dotenv").config();

const { MAIL_LOGIN, MAIL_PASS, PITER_MAIL, VADOS_MAIL } = process.env;

//Использован пакет Nodemailer
//https://nodemailer.com/about/

async function sendMail(req, res, next) {
	try {
		const { name, email, message } = req.body;

		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: MAIL_LOGIN, // generated ethereal user
				pass: MAIL_PASS, // generated ethereal password
			},
		});

		// const transporter = nodemailer.createTransport({
		// 	host: "smtp.ethereal.email",
		// 	port: 587,
		// 	auth: {
		// 		user: "agustina.mante@ethereal.email",
		// 		pass: "amcCNp1zCjkt9Y2RaE",
		// 	},
		// });

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: `${email}<foo@example.com>`, // sender address
			to: PITER_MAIL, // list of receivers
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
