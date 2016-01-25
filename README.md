<h1 align="center">
	<img width="500" src="https://s3.eu-central-1.amazonaws.com/mican/logo/logo-transparent.png" alt="mican">
</h1>

An Israeli social-initiatives index.

## Requirements

* [Nodejs and npm](https://nodejs.org) on your local machine, exact version are noted in [package.json](https://github.com/panstav/mican/blob/master/package.json) under `engines`.

* [MongoDB](https://www.mongodb.org/), create a `env.json` with `DATABASE_NAME` set to - you guessed it - your db name, and `LOCAL_MONGO_URL` set to the full uri to local instance, for example: if `mongodb://localhost:27017/mican` is your mongo uri, create a `env.json` file with:

	```JSON
	{
		"LOCAL_MONGO_URL": "mongodb://localhost:27017/mican",
		"DATABASE_NAME": "mican"
	}
	```

* You may also want to add a line for port number that this node application would serve from - add `"PORT": 3000` to the `env.json` file. 

## Installation

* Traverse to an appropriate folder and clone this repository

		$ cd ~/Dev/scratch
		$ git clone https://github.com/panstav/mican.git
		$ cd mican
		
* Install dependencies with `$ npm i`. Though you probably want to `$ npm i --dev` for tests and such. **Notice:** Installing dependencies would start the `postinstall` script which is intended for the production build on Heroku servers, if you don't want that, for whatever reason - remove it from `package.json` file before you `$ npm i`. 

* Next, run a build with either `$ npm run local` or `$ gulp local`.
	Alternatively you may want to run a production-oriented build - `$ npm run `
		
## Initiating Server

* Run `$ node run local`

* Access it by going to `localhost:3000` (or whatever port you've set) on your favorite browser.

* Additionally you can `$ node run debug` and `$ node run trace` if you need to get highly verbose.