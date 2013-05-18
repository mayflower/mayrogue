# Mayrogue

## Install dependencies

```
npm install
npm install -g bower
bower install
```

## Run

```
node server.js
```

Visit http://localhost:3000 with your browser after the server started.

## Develop

```
npm install grunt-cli -g # install grunt
npm install --dev # install dependencies for development
grunt # run jshint
```

## Deploy to heroku

```
heroku create
heroku config:set NODE_ENV=heroku // set special NODE_ENV on heroku ceder stack to disable websockets
git push heroku master
```

## Code structure

The program is completely written in javascript and built on nodejs; code is shared between client and server. Code
running on the client side is located in 'shared/' and organized with requirejs, while code running exclusively on the
server is located in 'server/' and organized in nodejs style modules. Every file from 'shared/' which is referenced in
the server side code has a corresponding boilerplate file in 'server/shared' which maps the nodejs style 'require' to
requirejs --- this avoids the destinction between the requirejs and nodejs module systems in the actual server code.
The code is organized into a single file per class, and multiple implementations of the same ancestor are namespaced ---
ie. 'shared/change.js' just references the actual changeset classes in shared/change' and namespaces them in a
convenience object.

Client assets and the dispatch code are located in 'frontend/', together with the libraries not pulled in by bower.
The server is implemented in 'server.js' and provides both the web server for serving the frontend and the actual
game server (using socket.io for communication).
