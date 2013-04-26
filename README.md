# Mayrogue

## Install dependencies

```
npm install
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