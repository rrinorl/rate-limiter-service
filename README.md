# rate-limiter-service
Rate limiting middleware service using token buckets.

---
## Requirements

For development, you will need Node.js (via nvm) installed in your environment.

### Node

## Install

    $ git clone https://github.com/rrinorl/rate-limiter-service.git
    $ cd rate-limiter-service
    $ nvm use
    $ npm i
    $ cp .env.sample .env


## Configure app

`config.json` contains the bucket configuration.

## Running the project locally for development with nodemon

    $ npm run start

## Running the project on Docker for development using nodemon

    $ npm run docker
Note: Docker must be running.

## Running the integration tests

    $ npm run test


## Simple build for production

TODO

## Notes

Most compromises are documented inline via TODO's.
The biggest compromise is that this is running in memory and stateful. This could be done better by offloading the state to redis and using either LUA scripts or other transactional mechanisms to handle concurrent reads/writes to the counter. Will discuss this more.
