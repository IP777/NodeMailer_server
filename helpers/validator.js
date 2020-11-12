const Joi = require("@hapi/joi");

function sendingMessage(req, res, next) {
	const schema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string().required(),
		message: Joi.string().required(),
	});
	const result = schema.validate(req.body);
	if (result.error) {
		const validReq = result.error.details[0].message;
		let validMessage = "Oops something happened";
		let params = "";

		if (validReq.includes("name")) {
			validMessage = "Invalid name parametr!";
			params = "name";
		} else if (validReq.includes("email")) {
			validMessage = "Invalid email parametr!";
			params = "email";
		} else if (validReq.includes("message")) {
			validMessage = "Invalid message parametr!";
			params = "message";
		}

		res.status(400).send({
			message: validMessage,
			params,
		});

		throw new Error(validReq);
	}
	next();
}

module.exports = {
	sendingMessage,
};

// {
//     "name": "Bill",
//     "email": "loh@loh.ru",
//     "message": "Hi pit its me )"
//     }
