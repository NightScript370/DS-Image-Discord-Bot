const { Command } = require('discord-akairo');

module.exports = class PauseAudioCommand extends Command {
	constructor() {
		super('pause', {
			aliases: ['pause'],
			category: 'Audio',
			description: {
				content: 'Pause the currently playing audio.'
			},
			channelRestriction: 'guild'
		});
	}

	exec(message) {
		var voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.channel.send(global.getString(message.author.lang, "in order to use audio commands, you will need to be in a voice channel"));

		var fetched = this.client.audio.active.get(message.guild.id);
		if(!fetched) return message.reply(global.getString(message.author.lang, "in order to use the resume command, there needs to be audio playing in the channel"));
		if(fetched.dispatcher.paused) return message.reply(global.getString(message.author.lang, "the song is already paused"));

		fetched.dispatcher.pause();
		message.reply(global.getString(message.author.lang, "I have successfully paused {0}.", fetched.queue[0].songTitle));
	}
};