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
    if (!toClap.includes(" "))
      return message.util.send(chunk(toClap, 1))
    message.util.send(toClap.replace(/\s+/gmi, " :clap: "));
  }

  chunk(str, n) {
    var ret = [];
    var i;
    var len;

    for(i = 0, len = str.length; i < len; i += n) {
       ret.push(str.substr(i, n))
    }

    return ret
  };
};