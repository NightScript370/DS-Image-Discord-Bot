const { Command } = require('discord-akairo');
const data = require("../../assets/morse.js");

module.exports = class MorseCommand extends Command {
  constructor() {
    super('morse', {
      category: 'Text Edits',
      aliases: ["morse"],
      description: {
        content: 'Translates to Morse what you say.',
        usage: '<text to translate to Morse code>',
        examples: ['hello world', '.... . .-.. .-.. --- ....... .-- --- .-. .-.. -..']
      },
      args: [{
        id: 'morse',
        prompt: {
              start: 'What would you like to translate from and to morse?',
              retry: 'That\'s not something we can translate! Try again.'
        },
        type: 'string',
        match: 'content'
      }]
    });
    
    this.examples = ['morse hello world', 'morse .... . .-.. .-.. ---   .-- --- .-. .-.. -..'];
  }

  exec(message, { morse: toMorse }) {
    const morse   = what => data[what] || what;
    const demorse = what => this.swap(data)[what] || what;
    
    let morseArr = toMorse.match(/([.\-\x{2007}]*\s*)/gmi)
    let isMorse = morseArr.length && morseArr[0].length;
    
    console.log(isMorse)
    
    if (!isMorse) {
      message.channel.send(toMorse.toLowerCase().split("").map(morse).join(" "));
    } else {
      message.channel.send(toMorse.split(" ").map(demorse).join("").toUpperCase());
    }
  }
  
  swap(o) {
    var ret = {};
    for(var key in o){
      ret[o[key]] = key;
    }
    return ret;
  }
};