# Table of Contents
- [Table of Contents](#table-of-contents)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
	- [DockerHub Installation](#dockerhub-installation)
	- [Docker Installation](#docker-installation)
	- [Manual Installation](#manual-installation)
- [Linting](#linting)
- [Scripts](#scripts)
- [Github Actions](#github-actions)
- [API Documentation](#api-documentation)
- [Utility Methods](#utility-methods)
	- [Load Configuration](#load-configuration)
	- [Logger](#logger)
	- [API Types - ResponseData<T>](#api-types---responsedatat)
		- [API Type - data](#api-type---data)
		- [API Type - errors](#api-type---errors)
- [Middleware](#middleware)
	- [Logger Middleware](#logger-middleware)
	- [Speed Limiter](#speed-limiter)
		- [Settings](#settings)
	- [handleErrors](#handleerrors)
	- [Error Route Middeware](#error-route-middeware)
	- [Status](#status)
	- [HEAD /status](#head-status)
	- [GET /status](#get-status)
	- [404 Middleware](#404-middleware)
- [User Routes - /user](#user-routes---user)
	- [Create User - POST /user/new](#create-user---post-usernew)
	- [Get All Users - GET /user/all](#get-all-users---get-userall)
	- [Get User - Get /user/:userId](#get-user---get-useruserid)
	- [Create new Payment - POST /payment/new](#create-new-payment---post-paymentnew)
	- [Get all of a User's Payments - GET /payment/:userId/all](#get-all-of-a-users-payments---get-paymentuseridall)
	- [Pay a User's Payment - /payment/pay](#pay-a-users-payment---paymentpay)
- [Payment](#payment)
	- [Delete a payment - /payment/delete](#delete-a-payment---paymentdelete)
- [Transactions](#transactions)
	- [Get all Transactions - /transaction/:userId/all](#get-all-transactions---transactionuseridall)
- [Reminders](#reminders)
	- [Get All Reminders - /reminder/:userId](#get-all-reminders---reminderuserid)

# Environment Variables

Copy the `.env.example` file, and rename it to `.env`. 

```shell
PORT="6000"
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=tamara
```

This configuration works as-is. However, it can be customized to fit your needs.

# Installation
**Before installation, make sure you have setup the [environment variables](#environment-variables) correctly.**

## DockerHub Installation
On [DockerHub](https://hub.docker.com/r/ryansamman/tamara), a production-ready container is available.

## Docker Installation
To build the container needed, use `yarn docker:build`.

Afterwards, you have two options:
- `yarn docker:dev` to run in Development Mode
- `yarn docker:start` to run in Production Mode 

## Manual Installation

Alternatively, you can manually start the server with the following scripts:
- `yarn`       install all dependencies.
- `yarn dev`   start the server in development mode.
- `yarn build` compile the Typescript files.
- `yarn start` start the server in production mode.
- `yarn test`  run Unit & Integration tests.

However, **these do not create a database instance**.

[More scripts here](#scripts).

# Linting
The entire project is linted with [eslint](https://eslint.org/). The [settings.json](./.vscode/settings.json) file contains the settings needed to automatically lint on save.

To configure the linter, open the [eslintrc.json](./.eslintrc.json) file.

Upon running Github Actions, the project is linted to ensure the code is up to standard.

# Scripts
A script can be run by `yarn <script>`

- `build` Builds the Typescript files into the `/dist` folder.
- `build:clean` Cleans the `\dist` folder.
- `build:watch` Re-Builds upon any change to the files.
- `dev` Runs the server and watches for any changes.
- `start` runs the compiled server in `production` mode. **Compile first with `build`!**
- `lint` Lints the project.
- `lint:fix` Lints the project and fixes any errors.
- `test` Tests the application **Run `docker:test` first!**
- `migration:create` Create a new Database Migration file.
- `migration:generate` Automatically Generate a new Database Migration.
- `docker:build` Build the server's docker container.
- `docker:dev` Runs the server's docker container in development mode, watching for any changes.
- `docker:test` Creates the database for the tests.
- `docker:prod` Runs the server's docker container in production mode.
- `docker:down` Turns off all active containers.

# Github Actions
Upon pushing to GitHub code is linted, tested, and checked if it compiles. Afterwards, a [Docker image](https://hub.docker.com/r/ryansamman/tamara) is built and pushed to DockerHub.

# API Documentation

# Utility Methods

## Load Configuration
All Neccessary .env variables are checked and sanitized by this method. 

Below are the available variables which are loaded:

```ts
interface Config {
	PORT: number
	DOCKER: boolean
	POSTGRES_DB: string
	POSTGRES_USER: string
	NODE_ENV: 'production' | 'test' | 'development'
	POSTGRES_PASSWORD: string
	DUE_AFTER: TimeValues
}
```

To access these variables import it like the following:

```ts
import { config } from './util'
```

## Logger
A logger is available by importing it like the following:

```ts
import { logger } from './util'
```

The logger can be customized from the [utility file](./src/util/index.ts). By default, the logger is customized as the following:

```ts
// Function that does nothing (No Operation)
const noop = (..._data: unknown[]) => { }

const logger = new Logger({
	onLog: config.NODE_ENV !== 'development' ? noop : console.log,
	onInfo: config.NODE_ENV === 'test' ? noop : (...data) => console.log(...data),
	onError: (...data) => console.error(...data),
})
```

- `onError` will always be defined.
- `onInfo` will not log in a `test` environment.
- `onLog` will only log in a `development` environment.

This allows the flexibility to quickly change what is being logged for the entire server, and may be integrated with logging services in the future.

## API Types - ResponseData<T>
All routes in the API which contain a `JSON` response sends a variant of `ResponseData`. Either a `data` field is defined, or an `errors` field is defined.

### API Type - data
If the `data` field is defined, it will be of type `T`, which is the generic type of ResponseData. By default, it is a string.
```json
{
	"data": T
}
```

### API Type - errors
If the `errors` field is defined, it will be an array of one three types:
- `Result<ValidationError>`
- `ResponseError`
- `ServerError`

All elements in the `errors` array have these values defined:

```json
{
	param: ...
	msg: ...
	location: ...
}
```

- `param` Is the parameter which caused the error.
- `msg` Is a description of the error. 
- `location` is where the error has occurred.

The `errors` array may return multiple error elements, such as the following for example:
```json
{
  "errors": [
    {
      "msg": "Duplicate Name",
      "param": "name",
      "location": "body"
    },
	{
	  "msg": "Invalid ID",
	  "param": "userId",
	  "location": "params"
	}
  ]
}
```

For the `ServerError`, it is the only type which has a `location` of `error`. The other two are interchangable.

```js
interface ResponseError {
	param: string
	msg: string | Error
	location: 'body' | 'cookies' | 'headers' | 'params' | 'query'
}

interface ServerError {
	param: string
	msg: string | Error
	location: 'error'
}

interface ResponseData<T = string> {
	data?: T
	errors?: Result<ValidationError>[] | ResponseError[] | ServerError[]
}
```

# Middleware
All utility middleware used is contained [here.](./src/util/middleware.ts)

## Logger Middleware
All routes are logged with a custom logger middleware. Afterwards, it is passed onto the next middleware.

- Uses the [logger](#logger)'s `log` method.

## Speed Limiter 
Routes are speed-limited with [express-slow-down](https://github.com/nfriedly/express-slow-down) to prevent DDoS attacks.

### Settings
```js
{
	// How long a request is is stored in milliseconds. 
	// Here, it is set to 15 minutes.
	windowMs: 15 * 60 * 1000, 
	// The number of requests made before any slowdown occurs.
	// Here, it is set to 100 requests.
	delayAfter: 100,
	// The amount of time in 'ms' added after each request exceeding 'delayAfter'
	delayMs: 500,
}
```

## handleErrors
This middleware responds with any **expected** errors found by [express-validator](https://express-validator.github.io/docs/)'s middleware.

## Error Route Middeware
This middleware handles and logs any uncaught errors which occur within the API. [express-async-errors](https://github.com/davidbanham/express-async-errors) directs any unhandled errors to this route.

In a `production` `NODE_ENV`, this is the JSON sent:
```json
{ errors: [{ 'error': 'Server Error.' }]}
```

However, in `test` and `development` environments, the error itself is returned instead of `Server Error.`

```json
{ errors: [{ 'error': err }] }
```

- Returns a `500` response code.
- Uses the [logger](#logger)'s `error` method.

## Status
This route is used to check if the API has been setup properly, and for health checks.

## HEAD /status
- Returns a `200` response code.

## GET /status
- Returns a `200` response code.
- Returns a `JSON` response: `ResponseData<string>`
```
{
	"data": "OK"
}
```

## 404 Middleware
If no route for the request has been found, the server will run this middleware.
- Returns a `404` response code.
- Returns a `JSON` response: `ResponseData`
{
	errors: [
		{
			"location": "error",
		
		}
	]
}

# User Routes - /user

## Create User - POST /user/new
Requires a body:
```json
{
	"name": string
}
```

Where `name` is a unique string between 3 and 20 characters long.

**On a Valid Request:**
- Returns a `201` response code.
- Returns a `JSON` response: `ResponseData<User>`

```json
{
  "data": {
    "name": "Joe",
    "userId": 1,
    "createdAt": "2021-05-02T06:48:01.905Z",
    "updatedAt": "2021-05-02T06:48:01.905Z"
  }
}
```

**Errors:**
[Read here for Error body description.](#api-types---responsedatat)

- `400` Bad Request
  - Invalid `name`, must be a `string` between 3 and 20 characters long.
  - Duplicate `name`.

## Get All Users - GET /user/all

- Always returns a `200` response code.
- Returns a `JSON` response: `ResponseData<User[]>`

```json
{
  "data": [
    {
      "userId": 2,
      "name": "Ryan",
      "createdAt": "2021-05-02T06:49:16.818Z",
      "updatedAt": "2021-05-02T06:49:16.818Z",
      "payments": [],
      "paymentHistory": []
    },
    {
      "userId": 1,
      "name": "Joe",
      "createdAt": "2021-05-02T06:48:01.905Z",
      "updatedAt": "2021-05-02T06:48:01.905Z",
      "payments": [],
      "paymentHistory": []
    }
  ]
}
```

## Get User - Get /user/:userId
Requires the `userId` param.

**On a Valid Request:**
- Returns a `200` response code.
- Returns a `JSON` response: `ResponseData<User>`

```json
{
  "data": {
    "name": "Joe",
    "userId": 1,
    "createdAt": "2021-05-02T06:48:01.905Z",
    "updatedAt": "2021-05-02T06:48:01.905Z"
  }
}
```

**Errors:**
[Read here for Error body description.](#api-types---responsedatat)

- `400` Bad Request
  - Invalid `userId`, it must be a `number`.
- `404` Not Found
  - The `userId` was not found.

## Create new Payment - POST /payment/new
Requires a body:
```json
{
 "userId": number,
 "amount": number,
 "currency": Currency,
}
```
[List of currencies supported here](./src/util/currencies.ts)

**On a Valid Request:**
- Returns a `201` response code.
- Returns a `JSON` response: `ResponseData<string>`

```json
{
  "data": "Successfully created a new Payment"
}
```

**Errors:**
**Errors:**
[Read here for Error body description.](#api-types---responsedatat)

- `400` Bad Request
  - Invalid `userId`, it must be a `number`.
  - Invalid `amount`, it must be a `number`.
  - Invalid `currency`, it must be a in the list of supported currencies.
- `404` Not Found
  - The `userId` was not found.


## Get all of a User's Payments - GET /payment/:userId/all
Requires the parameter `:userId`
Retrieves a list of all a user's current payments.

**On a Valid Request:**
- Returns a `201` response code.
- Returns a `JSON` response: `ResponseData<Payment>`

```json
{
  "data": [
    {
      "paymentId": 1,
      "currency": "AUD",
      "amount": "200.0000000000",
      "paymentStatus": "underway",
      "createdAt": "2021-05-02T07:57:50.185Z",
      "updatedAt": "2021-05-02T07:57:50.185Z",
      "dueAt": "2021-05-09T07:57:50.181Z",
      "paidAt": null,
      "deleted": false,
      "sentDueReminder": false,
      "paymentHistory": [
        {
          "paymentRecordId": 1,
          "recordKind": "creation",
          "amount": "200.0000000000",
          "currency": "AUD",
          "createdAt": "2021-05-02T07:57:50.205Z"
        }
      ]
    }
  ]
}
```

**Errors:**
[Read here for Error body description.](#api-types---responsedatat)

- `400` Bad Request
  - Invalid `userId`, it must be a `number`.
- `404` Not Found
  - The `userId` was not found.


## Pay a User's Payment - /payment/pay
Requires a body
```json
{
    "userId": 1,
    "paymentId": 4,
    "amount": 250,
    "currency": "AUD"
}
```

- Returns a `201` response code.
- Returns a `JSON` response


```json
{
  "data": {
    "message": "Paid off Payment #4.",
    "balance": 0,
    "overcharge": 50,
    "paymentStatus": "paid"
  }
}
```

`message` will be a message denoting:
  - how much has been paid if there is a remaining balance
  - If the payment is complete, it will say it has been paid off.

`balance` is the amount remaining from the payment

`overcharge` is the amount given back to the user if they have paid too much

`paymentStatus` is the status of the payment, 
- `underway` if it is still not completely paid
- `paid` if it has been paid off
- `due` if payment is due

# Payment
## Delete a payment - /payment/delete
Request body:
```
{
    "userId": 1,
    "paymentId": 1
}
```

- Returns a `200` status
- Returns a `JSON` response:

```
{
  "data": "This payment has been deleted."
}
```

Errors:
- Returns a `404` response if payment is not found.

# Transactions
## Get all Transactions - /transaction/:userId/all
Requires `userId` parameter

- Returns a `200` response
- Returns `JSON`: `ResponseData<PaymentRecord[]>`

# Reminders
## Get All Reminders - /reminder/:userId
Requires a `:userId` parameter

- returns a `200` response
- Returns `JSON`: ResponseData<Payment[]>

