var auth =       require('../../../middleware/auth');
var validate =   require('express-validation');
var validation = require('./../validation.js').groups;

module.exports = function(router){

	/*
	 * Get api/groups             - returns all group names
	 * Get api/groups/:id         - returns group profile
	 */

	router.get(
		'/',
		require('./get-groups-list')
	);

	router.get(
		'/pending',
		auth({ admin: true }),
		require('./get-pending-groups')
	);

	router.get(
		'/:id',
		require('./get-group-by-id')
	);

	router.get(
		'/:id/admin-email',
		auth({ groupAdmin: 'params:id' }),
		require('./get-admin-email')
	);

	/*
	 * Post api/groups/         - creates new group
	 * Post api/groups/suggest  - suggests new group
	 * Post api/groups/star     - sets user to follow group
	 * Post api/groups/contacts - creates a new contact
	 * Post api/groups/events   - creates a new event
	 */

	router.post(
		'/',
		auth(),
		validate(validation.addGroup),
		require('./add-group')
	);

	router.post(
		'/suggest',
		validate(validation.suggestGroup),
		require('./suggest-group')
	);

	router.post(
		'/star',
		auth({ possibleMishap: true }),
		validate(validation.star),
		require('./toggle-star')
	);

	router.post(
		'/contacts',
		auth({ groupAdmin: 'body:groupID' }),
		validate(validation.addContact),
		require('./add-contact')
	);

	router.post(
		'/events',
		auth({ groupAdmin: 'body:groupID' }),
		validate(validation.addEvent),
		require('./add-event')
	);

	/*
	 * Put api/groups/desc      - updates group description
	 * Put api/groups/contacts  - updates contact
	 */

	router.put(
		'/desc',
		auth({ groupAdmin: 'body:groupID' }),
		require('./edit-description')
	);

	router.put(
		'/contacts',
		auth({ groupAdmin: 'body:groupID' }),
		validate(validation.editContact),
		require('./edit-contact')
	);

	router.put(
		'/links',
		auth({ groupAdmin: 'body:groupID' }),
		validate(validation.editLinks),
		require('./edit-links')
	);

	router.put(
		'/events',
		auth({ groupAdmin: 'body:groupID' }),
		validate(validation.editEvent),
		require('./edit-event')
	);

	/*
	 * Delete api/groups/:groupID/events/:eventID - deletes event
	 * Delete api/groups/:groupID/contacts/:contactID - deletes contact
	 */

	router.delete(
		'/:groupID/events/:eventID',
		auth({ groupAdmin: 'params:groupID' }),
		validate(validation.deleteEvent),
		require('./delete-event')
	);

	router.delete(
		'/:groupID/contacts/:contactID',
		auth({ groupAdmin: 'params:groupID' }),
		validate(validation.deleteContact),
		require('./delete-contact')
	);

};















