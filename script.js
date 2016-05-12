'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Hhhmm...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say(`Ceci est un Livre dont vous êtes le Héros, ou CYOP - Choose Your Own Path. Il suffit de taper le n° du paragraphe pour le voir apparaître. Le système pour compter vos points de vies doit être fait à la main avec du papier et deux dés ;) Tapez : "REGLES" pour lire les règles, et "0" pour commencer.`)
                .then(() => 'speak');
        }
    },
     
      speak: {
        prompt: (bot) => bot.say(`Il faut interagir avec les n° de paragraphe.`),
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    return bot.say(` Désolé, il faut interagir qu'avec des chiffres.`).then(() => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
