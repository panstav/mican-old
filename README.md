# Mican

An Israeli social-initiatives index.

## Requirements

1. [Nodejs and npm](https://nodejs.org) on your local machine, exact version are noted in [package.json](https://github.com/panstav/mican/blob/master/package.json) under `engines`.

2. A local mongoDB, include `process.env.LOCAL_MONGO_URL` with the url to local instance and db-name as its value, for 
example: `mongodb://localhost:27017/mican`

## Installation

1. Traverse to an appropriate folder and clone this repository

		cd ~/Dev/scratch
		git clone https://github.com/panstav/mican.git