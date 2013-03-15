# Mayrogue

## Run

```
node server.js
```

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