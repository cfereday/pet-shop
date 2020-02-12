# pet-shop

## Getting started 


# Auth System
To run an example using no JWT web tokens
```
$ cd pet-shop/auth-system
$ npm install
$ node server.js
```


# Node Js authentication
This app started with the following resources:

* [Build a simple sesion based auth system](https://www.codementor.io/@mayowa.a/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3)

To run another example using JWT web tokens

```
$ cd nodejs-authentication
$ npm install
$ env:myprivatekey = "myprivatekey"
$ node index.js
```


# userTable Authentication
This app was built following [this tutorial]( https://www.youtube.com/watch?v=Ud5xKCYQTjM) to build simple user authentication. 

```
$ cd user-authentication
$ npm install
$ npm run devStart
```



# JWT Tokens
This app was built following [this tutorial](https://www.youtube.com/watch?v=mbsmsi7l3r4) to use JWT to create & refresh sessions.

In order to use this app some tokens will need to be added to the secret keys in the .env file. This can be done in the terminal in the following way:
```
$ node 
$ require('crypto').randomBytes(64).toString('hex')
```
Replace the values locally in that file.

```
$ cd jwt-tokens
$ npm install
$ npm run devStart
$ npm run devStartAuth
```
There are a number of endpoints in both servers that can be used, recommend using Insomnia or Postman to try them out. 
