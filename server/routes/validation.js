var Joi =     require('joi');

module.exports = {

	confirmEmail: {
		options: { flatten: !!process.env.LOCAL },

		params: {
			code: Joi.string().alphanum().required(),
			redirect: Joi.string().alphanum()
		}
	}

};