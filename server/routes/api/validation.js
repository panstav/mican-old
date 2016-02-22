var Joi = require('joi');
var _ = require('lodash');

var validationObj = {

	users: {

		claimGroup: {

			body: {
				groupID: Joi.string().alphanum().required()
			}

		},

		patchInitials: {

			body: {
				displayName: Joi.string().max(25).required(),
				gender: Joi.any().valid(['male','female','unknown']).required()
			}

		}

	},

	groups: {

		admin: {

			setCategory: {

				body: {
					groupId: Joi.string().alphanum().required(),
					newCategory: Joi.any().valid(['orange','purple','blue','green','aqua','yellow','bordo','sky','pink']).required()
				}

			},

			setNamespace: {

				body: {
					groupId: Joi.string().alphanum().required(),
					newNamespace: Joi.string().min(2).max(50).required()
				}

			},

			authorize: {

				body: {
					groupId: Joi.string().alphanum().required()
				}

			}

		},

		star: {
			body: { groupIdToStar: Joi.string().alphanum().required() }
		},

		whoisGroup: {
			body: { groupID: Joi.string().alphanum().required() }
		},

		addGroup: {

			body: {
				
				displayName:  Joi.string().max(50).required(),
				desc:         Joi.string().max(800).required(),
				color:        Joi.any().valid(['orange','purple','blue','green','aqua','yellow','bordo','sky','pink']).required()

			}
		},

		suggestGroup: {

			body: {

				displayName:  Joi.string().min(1).required(),
				contacts:     Joi.array().min(1).required().includes(Joi.object().keys(
					{
						type: Joi.string().valid(['link', 'mail', 'tel']).required(),
						value: Joi.string().required()
					}
				))

			}
		},

		editGroupDesc: {

			body: {
				id: Joi.string().alphanum().required(),
				newDesc: Joi.string().max(800).required()
			}

		},

		addEvent: {

			body: {
				groupID: Joi.string().alphanum().required(),

				event: {
					title: Joi.string().max(50).required(),
					date: Joi.string().min(10).max(16).required(),
					link: Joi.string().required()
				}

			}
		},

		editEvent: {

			body: {
				groupID: Joi.string().alphanum().required(),

				event: {
					_id: Joi.string().required(),
					title: Joi.string().max(50).required(),
					date: Joi.string().min(10).max(16).required(),
					link: Joi.string().required()
				}
			}

		},

		deleteEvent: {

			params: {
				groupID:    Joi.string().alphanum().required(),
				eventID:    Joi.string().alphanum().required()
			}

		},

		addContact: {

			body: {

				groupID: Joi.string().alphanum().required(),

				contact: {

					channel:        Joi.any().valid(['mail', 'tel', 'link']).required(),
					nameOfContact:  Joi.string().max(25).required(),
					value:          Joi.string().required(),
					publicity:      Joi.any().valid(['public', 'registered', 'followers']).required()

				}
			}

		},

		editContact: {

			body: {

				groupID: Joi.string().alphanum().required(),

				contact: {
					id:             Joi.string().alphanum().required(),
					channel:        Joi.any().valid(['mail', 'tel', 'link']).required(),
					nameOfContact:  Joi.string().max(25).required(),
					value:          Joi.string().required(),
					publicity:      Joi.any().valid(['public', 'registered', 'followers']).required()
				}
			}

		},

		deleteContact: {

			params: {
				groupID:    Joi.string().alphanum().required(),
				contactID:  Joi.string().alphanum().required()
			}

		},

		editLinks: {

			body: {

				groupID: Joi.string().alphanum().required(),

				homepage: Joi.string().allow(''),
				facebook: Joi.string().allow(''),
				twitter: Joi.string().allow(''),
				google: Joi.string().allow('')

			}

		}
	},

	tasks: {

		addTask: {

			body: {

				groupID:          Joi.string().alphanum().required(),

				task: {
					title:            Joi.string().max(50).required(),
					desc:             Joi.string().max(800).required(),
					importance:       Joi.string().max(400),
					color:            Joi.any().valid(['orange','purple','blue','green','aqua','yellow','bordo','sky','pink','other']).required(),

					requirements:     Joi.array().includes(Joi.string().max(150)).max(10),

					designatedPlace:  Joi.string().allow('').max(100),
					designatedTime:   Joi.string().min(10).max(16),
					duration:         Joi.string().allow('').max(100),

					links:            Joi.array().includes(Joi.object().keys(
						                                       {
							                                       title: Joi.string().max(50).required(),
							                                       value: Joi.string().required()
						                                       })
					).max(5),

					publicity:        Joi.any().valid(['public', 'registered', 'followers']).required(),
					notifyEmail: {
						value:          Joi.boolean().required(),
						target:         Joi.string().required()
					}
				}
			}

		},

		editTask: {

			params: {
				id: Joi.string().alphanum().required()
			},

			body: {

				title:            Joi.string().max(50).required(),
				desc:             Joi.string().max(800).required(),
				importance:       Joi.string().allow('').max(400),

				requirements:     Joi.array().includes(Joi.string().max(150)).max(10),

				designatedPlace:  Joi.string().allow('').max(100),
				designatedTime:   Joi.string().min(10).max(16),
				duration:         Joi.string().allow('').max(100),

				links:            Joi.array().includes(Joi.object().keys(
					                                       {
						                                       title: Joi.string().max(50).required(),
						                                       value: Joi.string().required()
					                                       })
				).max(5),

				publicity:        Joi.any().valid(['public', 'registered', 'followers']).required(),
				notifyEmailValue: Joi.boolean().required()

			}

		},

		volunteer: {

			params: {
				taskID: Joi.string().alphanum().required()
			},

			body: {
				message: Joi.string().max(800).required()
			}

		},

		anonVolunteer: {

			params: {
				taskID: Joi.string().alphanum().required()
			},

			body: {

				fullName: Joi.string().max(50).required(),
				contact: {
					channel: Joi.any().valid(['email', 'tel']).required(),
					value: Joi.string().required()
				},
				message: Joi.string().max(800).required()
			}

		},

		complete: {

			params: {
				taskID: Joi.string().alphanum().required()
			},

			body: {

				participators: Joi.array().includes(Joi.string().alphanum().required()),
				story: Joi.string().max(1500)
			}

		},

		removeTask: {

			params: {
				taskID: Joi.string().alphanum().required()
			}

		}

	}
};

_(validationObj).forIn(function(section){

	_(section).forIn(function(route){
		route.options = { flatten: !!process.env.LOCAL };
	});

});

module.exports = validationObj;