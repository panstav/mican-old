### v0.6.6 - puzzle-cheating

ES2015 transpiler for client-side
Restructured gulpfile into a folder of file per task
Better npm log scripts
Scoping issues @ add-task.js & edit-event.js
Typos

### v0.6.5 - pocket-screeners

Adjusted stuff to really tiny screens
Finished /about page design

### v0.6.4 - partial-entrance

Significantly reduce page-load time by calling bundle.js asyncly

### v0.6.3 - stance-bance

Added intro at homepage and /about page

### v0.6.2 - casual-collision

Added compatability stuff and was surprised to see autoprefixer removing so much stuff
Directivized social-sharing buttons
Adjusted groupCategories on homepage to not have any empty space
Fixed top-bar positioning due to 892d7db
Added a hatch for user-agents

### v0.6.1 - anita-armada

Fixes for /map seo, /groups empty logo, tiny topBar
Also added analytics events to hero and logo upload

## v0.6.0 - angle-prep

Reordered client/src structure, directivized states and set webpack to pre-load templates as part of versioned bundle.js
Refactored modal into an ngService to stop writing $rootScope events all over
Added webpack stats on local machines

***

### v0.5.6 - watch-cogs

Upgraded packages because Snyk.io
Upgraded / Removed packages because deprecated or unnecessary

### v0.5.5 - bumby-quirks

Added groupAdmin email at pendingGroup notice
Moved feedback to end of menu
Sorted editHero button position

And various fixes

### v0.5.4 - hidden-nihulit

Added an admin dashboard on homepage, all such dashboards would reside in directives/admin/{pagename}

### v0.5.3 - archive-bearer

Restored old map and set all links inbound
Added events for data-entry
Temporary store /groups at localStorage
Upgraded FontAwesome to use new icons (map-o)

### v0.5.2 - beep-boop

a\[href\] =\> \[ui-sref\] and other fixes

### v0.5.1 - actual-lock

Don't know much about this..

## v0.5.0 - face-flush

Beautified SingleGroup and TopBar
Sorted semantic headers
Justified detail text

### v0.4.4 - persistent-walk

Beautified Homepage and GroupsOverview

### v0.4.3 - free-hubots

Added social links for singleGroups

### v0.4.2 - territorial-mascot

Added sitemap generation route

Various fixes for: extra slash after /groups, indexing dev instances, package ind. etc.

### v0.4.1 - beacon-strider 

Semver-based titles for this file

Required forms are bolder, colored red only on validation

## v0.4.0 tiny-fingers

Split groupDoc.link into groupDoc.links

Switched places of signIn button with sendFeedback

And many other tiny fixes

***

### v0.3.2 - friendly-omnibot

* Better seo-bindings
* Recognizes facebook-bots
* Fixed a few fatal errors
* Upgraded express-session, removed cookie-parser

### v0.3.1 - google-bend

* Refreshed Google Search Console verification code and eased on robots.txt
* headCtrl handles seo with state changes and a custom event
* Added dev instance to heroku for remote staging

## v0.3.0 - diamond-tentacle

* Website back on air - https://www.darkenu.net
* package.json now uses exact version numbers, why? because this is the only way (that I can think of) with which one 
can know for sure what version was used before any breakage.
* Removed bower, installing all frontend through npm
* A log service now enables different levels of output
* Breaking non-https middleware simply redirects every non-secure request back to secure-homepage
* Restructured logic to use return instead of nesting conditions
* Restructured and expanded tests
* Auth middleware can now take groupAdmin as an option key, value is a string by the syntax of 'body:@{ key in req
.body }' or params:@{ key in req.params }
* Single group pages now redirect to a url with their namespace if such is available (bit of a round-about but would 
be valuable with seo and people sharing addresses)
* Removed about-us page

***

### v0.2.2 - ass-covering

Claiming group is now for registered users only

### v0.2.1 - maggot-removing

Weird bug is weird, I probably just left it there in the middle of doing something else

## v0.2.0 - carpet-swiping

ClaimGroup, Caching, Ban settings, better Login

Tests for isAdmin middleware

***

### v0.1.2 - rough-negotiations

Redirection loops, on-the-fly seo-snapshots

App.js poniness

### v0.1.1 - excited-microbots

Pretty JSON, robots.txt, automatic version bumping

Admin/Anon tests

## v0.1 - Initial Release

Lots of work - going live @ www.darkenu.net