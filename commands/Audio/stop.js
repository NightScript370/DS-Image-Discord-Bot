const { Command } = require('discord-akairo');

module.exports = class StopAudioCommand extends Command {
	constructor() {
		super('stop', {
			aliases: ['stop', 'stopplaying', 'stopplayingmusic', 'stopplayingaudio'],
			category: 'Audio',
			description: {
        content: 'Stops the music.'
      },
			channelRestriction: 'guild'
		});

    this.examples = ["stop"];
	}

	exec(message) {
		if(!message.member.voice.channel) return message.reply("I think it may work better if you are in a voice channel!");

		this.client.audio.active.delete(message.guild.id);
		if(message.guild.voice.connection) {
			message.guild.voice.connection.disconnect();
			return message.reply("I have stopped playing music");
		}
	}
};