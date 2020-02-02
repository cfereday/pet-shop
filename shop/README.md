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

You can now start the app:
`npm run devStart`


## Feedback
All constructive & respectful feedback most welcome, feel free to open any issues / PRs. 
