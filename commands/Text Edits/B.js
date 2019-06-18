const { Command } = require('discord-akairo');

module.exports = class OwoCommand extends Command {
  constructor() {
    super('b', {
      category: 'Text Edits',
      aliases: ["b", '🅱'],
      description: {
        content: 'replace every b/B with a 🅱.',
        usage: '<text you\'d like to transform to a 🅱>'
      },
      args: [{
        id: 'toB',
        type: 'text-fun',
        match: 'content'
      }]
    });
  }

  exec(message, { toB }) {
    if (!toB.includes('b' || 'B')) return message.util.send('There was no Bs found in the text');
    message.channel.send(toB.replace(/b/gi, "🅱"));
  }
};