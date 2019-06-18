const { Command } = require('discord-akairo');

module.exports = class ClapCommand extends Command {
  constructor() {
    super('clap', {
      category: 'Text Edits',
      aliases: ["clap"],
      description: {
				content: 'Add a clap emoji between every word.',
				usage: '<stentence to clapify>',
				examples: ['hello there friend', 'here we go again']
			},
      args: [{
        id: 'toClap',
        type: 'text-fun',
        match: 'content'
      }]
    });
  }

  exec(message, { toClap }) {
    message.util.send(toClap.replace(/\s+/gmi, " :clap: "));
  }
};