const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = class IDCommand extends Command {
  constructor() {
    super('id', {
      aliases: ['id'],
      category: 'Useful',
      clientPermissions: ['ATTACH_FILES'],
      description: {
				content: 'Returns your user ID.',
        usage: '',
        example: ''
			},
			args: [
        {
					id: 'user',
					type: 'user',
          default: msg => msg.author,
          match: 'content'
        }
      ]
    });
  }

  async exec(msg, { user }) {
    const __ = (k, ...a) => global.getString(msg.author.lang, k, ...a);
    let embed = this.client.util.embed()
      .setAuthor(user.id, user.displayAvatarURL())
/*      .setDescription(__(`Above is ${user == msg.author ? "your" : "{0}'s"} Discord User ID. You can use it to:

- Allow users to reference ${user == msg.author ? "you" : "{0}"} regarding bot commands in Direct Messages
- Connect a MakerBoard account to Discord`, user.username)) */
      .setDescription(`Above is ${user == msg.author ? 'your' : `${user.username}'s`} Discord User ID.`)
      .setThumbnail(this.client.user.displayAvatarURL({format: 'png'}))
      .setColor("#7289da");
    
    msg.channel.send(embed);
  }
};