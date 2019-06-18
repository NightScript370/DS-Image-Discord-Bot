const { Command } = require('discord-akairo');

module.exports = class SkipAudioCommand extends Command {
	constructor() {
		super('skip', {
			aliases: ['skip'],
			category: 'Audio',
			description: {content: 'Adds a vote to skip the currently playing music. Moderators can add `--modskip` to skip without a vote'},
			channelRestriction: 'guild',
      args: [
        {
          id: 'video',
          type: 'string',
          default: null
        },
				{
					id: 'modskipidentifier',
          match: 'flag',
					flag: '--modskip'
				}
			]
		});
	}

	exec(message, { modskipidentifier }) {
		var voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.reply("I think it may work better if you are in a voice channel!");

		var fetched = this.client.audio.active.get(message.guild.id);
		if(!fetched) return message.reply("there isn't any music playing in the server");
    
    let modskip = false;
    if (modskipidentifier && message.member.hasPermission('MUTE_MEMBERS')) { modskip = true; }

		let uservcCount = message.member.voice.channel.members.size;
		let requiredToSkip = Math.ceil(uservcCount / 2);

		if(!fetched.queue[0].voteSkips) {
      fetched.queue[0].voteSkips = [];
    }

		if (fetched.queue[0].voteSkips.includes(message.member.id) && !this.checkSkip(fetched, requiredToSkip, message, modskip))
			message.reply(`you already voted to skip! ${fetched.queue[0].voteSkips.length}/${requiredToSkip} required.`);
    else if (!fetched.queue[0].voteSkips.includes(message.member.id) && !this.checkSkip(fetched, requiredToSkip, message, modskip)) {
      fetched.queue[0].voteSkips.push(message.member.id);
      this.client.audio.active.set(message.guild.id, fetched);
      
      if(!this.checkSkip(fetched, requiredToSkip, message, modskip))
        message.reply(`your vote has been added. ${fetched.queue[0].voteSkips.length}/${requiredToSkip} required`);
    }

		if(this.checkSkip(fetched, requiredToSkip, message, modskip)) {
			if(fetched.queue.length > 1) {} else {
			  message.reply('the song has been successfully skipped, but there is no music left.')
		  }

			fetched.dispatcher.emit('end');
			return;
		}
	}

  checkSkip(fetched, requiredToSkip, message, modskip) {
    return fetched.queue[0].voteSkips.length >= requiredToSkip || message.author.tag == fetched.queue[0].requester || modskip
  }
};