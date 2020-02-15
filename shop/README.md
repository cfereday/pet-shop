# Shop
This is a basic app to explore how authentication and authorisation work and are different from one another. 

## Getting started

### Set up dependencies 
`cd shop`
`npm install`

### Get the right version of Node
You'll need to be using node 12 to run this app. Using [nvm](https://github.com/nvm-sh/nvm):
`nvm install v12.13.1`
`nvm use`

### Get the local database running
* This app uses postgres, you'll need to have that installed in order to run the app. Here are instructions for doing this 
for [Windows](https://www.postgresqltutorial.com/install-postgresql/) and for [Mac](https://flaviocopes.com/postgres-how-to-install/).

* In a new terminal window, get the db running locally:
`postgres -D /usr/local/var/postgres` or if using brew `brew services start postgresql`

* Add your postgres credentials to the `.env` file. You can use the default values of:
```
DB_USER='postgres'
DB_PASS='postgres'
```
* For the JWT authentication to work, some additional tokens will need to be added to the secret keys in the .env file. This can be done in the terminal in the following way:
```
$ node 
$ require('crypto').randomBytes(64).toString('hex')
```
Replace the below values locally in the `.env` file.

```
ACCESS_TOKEN_SECRET='add yours here'
REFRESH_TOKEN_SECRET='add yours here'
```
You can now start the app:
`npm run devStart`

## Feedback
All constructive & respectful feedback most welcome, feel free to open any issues / PRs. 
