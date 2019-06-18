const { Command } = require('discord-akairo');

module.exports = class HexCommand extends Command {
  constructor() {
    super('hex', {
      category: 'Text Edits',
      aliases: ["hex"],
      description: {
        content: 'Converts text to hexadecimal.',
        usage: '<text to translate to Hexadecimal Values>',
        examples: ['hello world']
      },
      args: [{
        id: 'text',
        type: 'text-fun',
        match: 'content'
      }]
    });
  }

  exec(message, { text }) {
    return message.util.send(Buffer.from(text).toString('hex'));
  }
};