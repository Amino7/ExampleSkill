  const Alexa = require('ask-sdk');
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();

  let skill;

  app.use(bodyParser.json());
  app.post('/', function(req, res) {

    if (!skill) {

        const LaunchRequestHandler = {
            canHandle(handlerInput) {
              return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
            },
            handle(handlerInput) {
              const speechText = 'Welcome to the Alexa Skills Kit, you can say hello!';
          
              return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .withSimpleCard('Hello World', speechText)
                .getResponse();
            }
          };

        const HelloIntentHandler = {
            canHandle(handlerInput) {
              return handlerInput.requestEnvelope.request.type === 'IntentRequest'
                && handlerInput.requestEnvelope.request.intent.name === 'hello';
            },
            handle(handlerInput) {
              const speechText = 'Hello World!';
          
              return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard('Hello World', speechText)
                .getResponse();
            }
          };

      skill = Alexa.SkillBuilders.custom()
        .addRequestHandlers(
            LaunchRequestHandler,
            HelloIntentHandler
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