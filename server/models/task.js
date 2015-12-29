var moment = require('moment');

module.exports = {

	schema: {

		createdAt: { type: Number, default: moment().unix() },
		createdBy: String,
		viewed: { type: Number, default: 0},

		title: String,
		desc: [ String ],
		importance: [ String ],
		color: String,

		requirements: [ String ],

		designatedPlace: String,
		designatedTime: { type: Number, default: 0 },
		duration: String,

		links: [{
			title: String,
			value: String
		}],

		publicity: String,
		notifyEmail: {
			value: Boolean,
			target: String
		},

		volunteers: [{
			anonFullName: String,
			contact: {
				channel: String,
				value: String
			},

			volunteerID: String,
			message: String,
			createdAt: Number
		}]

	},

	statics: {},

	virtuals: []

};