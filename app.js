const Alexa = require('ask-sdk');
let skill;

if (ENVIRONMENT === 'production') {

  exports.handler = async function (event, context) {
    if (!skill) {
      skill = Alexa.SkillBuilders.custom()
        .addRequestHandlers(
          HelloWorldHandler
        )
        .create();
    }
    return skill.invoke(event,context);
  }

} else {
  
  console.log("else");

  // Development environment - we are on our local node server
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();

  app.use(bodyParser.json());
  app.post('/', function(req, res) {

    if (!skill) {

      skill = Alexa.SkillBuilders.custom()
        .addRequestHandlers(
          HelloWorldHandler
        )
        .create();

    }

    skill.invoke(req.body)
      .then(function(responseBody) {
        res.json(responseBody);
      })
      .catch(function(error) {
        console.log(error);
        res.status(500).send('Error during the request');
      });

  });

  app.listen(3000, function () {
    console.log('Development endpoint listening on port 3000!');
  });

}