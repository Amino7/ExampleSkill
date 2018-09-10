  const Alexa = require('ask-sdk');
  const express = require('express');
  const bodyParser = require('body-parser');
  const http = require('http');
  const verifier = require('alexa-verifier-middleware')
  const axios = require('axios');
  const app = express();

  let skill;
  app.use(verifier)
  app.use(bodyParser.json());
  app.post('/', function(req, res) {

    if (!skill) {
        console.log("!skill");
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
            async handle(handlerInput) {
              const speechText = await axios.get('https://securetestapi.herokuapp.com/alexa');
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

  // tell the server what port to listen on
http.createServer(app).listen(process.env.PORT || 8080,"0.0.0.0");
console.log('Listening on localhost:8080')
