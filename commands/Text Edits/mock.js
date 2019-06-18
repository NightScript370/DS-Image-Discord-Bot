const { Command } = require('discord-akairo');

module.exports = class MockCommand extends Command {
  constructor() {
    super('mock', {
      aliases: ['mock'],
      description: {
        content: "Mock someone's words with this"
      },
      category: 'Text Edits',
      args: [
        {
          id: "target",
          type: "text-fun",
          match: 'content'
        }
      ]
    });
  }

  async exec(message, { target }) {
    if (!target) return message.channel.send(global.getString(message.author.lang, "I couldn't get the last message."));

    let newContent = "";
    let chars = target.split("");
    for (let i = 0; i < chars.length; i++) {
      newContent += i % 2 == 0 ? chars[i].toUpperCase() : chars[i].toLowerCase();
    }
    
    message.channel.send(newContent);
  }
}