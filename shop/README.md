# Shop

## Dependencies

### Database
* This app uses postgres, you'll need to have that installed in order to run the app. Here are instructions for doing this 
for [Windows](https://www.postgresqltutorial.com/install-postgresql/) and for [Mac](https://flaviocopes.com/postgres-how-to-install/).

* In a new terminal window, get the db running locally:
`postgres -D /usr/local/var/postgres`

* In another window:
`psql`

`CREATE DATABASE shop;`
`\c shop`
