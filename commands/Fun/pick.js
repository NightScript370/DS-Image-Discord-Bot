const { Command } = require('discord-akairo');

module.exports = class PickCommand extends Command {
  constructor() {
    super('pick', {
      aliases: ['pick'],
      description: {
        content: "Use this to decide what to do with your life!"
      },
      category: 'Fun',
      args: [
        {
          id: 'items',
          match: 'none',
          prompt: {
            start: [
              'What items would you like to pick from?',
              'Type them in separate messages.',
              'Type `stop` when you are done.'
            ],
            infinite: true
          }
        }
      ]
    });
  }

  exec(message, { items }) {
    const picked = items[Math.floor(Math.random() * items.length)];

    if (message.channel.sendable)
      message.util.reply(`I picked ${picked.trim()}!`);
    else
      message.author.send('I pick ${picked.trim()}!').catch();
  }
}