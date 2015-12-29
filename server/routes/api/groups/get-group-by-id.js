var log = require('../../../services/log');

var async =           require('async');
var moment =          require('moment');

var mongoose =        require('mongoose');
var groupModel =      mongoose.model('group');
var taskModel =       mongoose.model('task');

var publicity =       require('../../../helpers/publicity');
var validMongoID =    require('../../../helpers/valid-mongo-id');
var normalizeID =     require('../../../helpers/normalize-id');
var generalizeTasks = require('../../../helpers/generalize-tasks');

module.exports = function(req, res){

	async.waterfall(
		[

			find_group_possibly_by_namespace,

			add_flag_if_user_is_admin,

			check_if_group_is_pending_or_blocked,

			remove_contacts_by_priviledge,

			get_tasks_by_privilege,

			increment_view_counter,

			prep_events,

			attach_related_groups

		],

		function(err, result){
			if (err){
				log.error(err);

				return res.status(err.noSuchGroup ? 404 : 423).json(err);
			}

			// no error - send group profile
			res.json(result.groupObj);

			// delete events a week after their date
			groupModel.findById(result.groupObj._id, 'profile', function(err, groupDoc){
				if (err) return log.error(err);
				
				result.eventIDsToBeDeleted.forEach(function(eventIDToDelete){
					groupDoc.profile.events.pull(eventIDToDelete);
				});

				groupDoc.save();
			});
		}

	);

	function find_group_possibly_by_namespace(step){

		// check if given id is valid
		if (validMongoID(req.params.id)) findGroupNormally(); else findGroupNyNamespace();

		function findGroupNormally(){

			groupModel.findById(req.params.id, '-admins', function(err, groupDoc){
				if (err) return log.error(err);

				// weird case: namespace could be a valid Mongoose.ObjectID
				if (!groupDoc) return findGroupNyNamespace(req.params.id);

				// advise redirecting (client side will redirect to the same page with namespace instead of bare-id)
				var namespace = groupDoc.toObject().namespace;
				if (namespace) return res.status(301).json({ groupHasNamespace: namespace });

				// got to group by id - proceed
				step(null, groupDoc);
			});
		}

		function findGroupNyNamespace(){

			groupModel.findOne({ namespace: req.params.id }, '-admins', function(err, groupDoc){
				if (err) return log.error(err);

				// no group found - redirect
				if (!groupDoc) return step({ noSuchGroup: true });

				// got to group by namespace - proceed
				step(null, groupDoc);
			});
		}
	}

	function add_flag_if_user_is_admin(groupDoc, step){

		var groupObj = groupDoc.toObject();

		// virtual properties apparently need a personal invitation
		groupObj.numFollowers = groupDoc.numFollowers;

		// flag adminity accordingly
		if (req.user && req.user.isAdmin(normalizeID(groupObj._id))) groupObj.userIsAdmin = true;

		step(null, groupObj);
	}

	function check_if_group_is_pending_or_blocked(groupObj, step){

		// user is admin - let him in
		if (groupObj.userIsAdmin) return cleanAndStep(null, groupObj);

		// user is not an admin, check for pending & blocked statuses
		if (groupObj.pending === true) return cleanAndStep({ pending: true });

		if (groupObj.blocked.value === true) return cleanAndStep({ blocked: true });

		// group is public - go on
		return cleanAndStep(null, groupObj);

		function cleanAndStep(err, groupObj){
			if (!err) delete groupObj.blocked;

			step(err, groupObj);
		}
	}

	function remove_contacts_by_priviledge(groupObj, step){

		groupObj.profile.contacts = groupObj.profile.contacts.filter(function(contact){
			return publicity.predicate(contact.publicity, req.user, groupObj._id);
		});

		delete groupObj.starredBy;

		step(null, groupObj);
	}

	function get_tasks_by_privilege(groupObj, step){

		var aggregation = {
			$match: groupObj.userIsAdmin
				? { createdBy: groupObj._id.toString() }
				: publicity.aggMatcher(req.user, 'createdBy', groupObj._id)
		};
		var projection = { $project: { createdAt: 1, title: 1, volunteers: 1, publicity: 1, color: 1 } };

		taskModel.aggregate(aggregation, projection, function(err, tasks){
			if (err) return log.error(err);

			groupObj.profile.tasks = generalizeTasks(tasks);

			step(null, groupObj);
		});
	}

	function increment_view_counter(groupObj, step){

		if (!req.user || !groupObj.userIsAdmin) return count();

		step(null, groupObj);

		function count(){

			groupModel.findByIdAndUpdate(groupObj._id, { $inc: { 'profile.viewed': 1 } }, function(err){
				if (err) return log.error(err);

				// continue even if mongoose returned with error, it's just a page view counter
				step(null, groupObj);
			});
		}

	}

	function prep_events(groupObj, step){

		var eventIDsToBeDeleted = [];

		groupObj.profile.events = groupObj.profile.events
			.filter(onlyLastWeek)
			.sort(byDate)
			.map(humanDates);

		step(null, groupObj, eventIDsToBeDeleted);

		function onlyLastWeek(event){

			if (moment(event.date, 'X').add(7, 'days').isBefore(moment())){

				// keep it for later deletion
				eventIDsToBeDeleted.push(event._id);

				// remove it from served doc
				return false;
			}

			return true;
		}

		function byDate(a, b){
			return a.date - b.date;
		}

		function humanDates(event){
			event.humanDate = moment(event.date, 'X').format('D/M');
			event.date = moment(event.date, 'X').format('DD/MM/YYYY');

			return event;
		}

	}

	// this is a non-crucial step, so any errors will just continue to next step without attaching related groups
	function attach_related_groups(groupObj, eventIDsToBeDeleted, step){

		// we want to get 3 documents
		// from a list that contains only valid groups
		// from the same category
		// without the current group
		var conditions = {
			_id: { $ne: groupObj._id },
			color: groupObj.color,
			pending: false,
			'blocked.value': false
		};

		var projection = 'displayName namespace desc logo';

		groupModel.findRandom(conditions, projection, { limit: 3 }, function(err, randomRelated){
			if (err){
				log.error(err);

				return resume();
			}

			groupObj.relatedGroups = randomRelated.map(function(randomDoc){

				var cleanRandomObj = randomDoc.toObject();

				cleanRandomObj.link = cleanRandomObj.namespace || normalizeID(cleanRandomObj._id);
				delete cleanRandomObj.namespace;
				delete cleanRandomObj._id;

				// summarize
				cleanRandomObj.desc = cleanRandomObj.desc[0];

				return cleanRandomObj;
			});

			resume();

		});

		function resume(){
			step(null, { eventIDsToBeDeleted: eventIDsToBeDeleted, groupObj: groupObj });
		}

	}

};