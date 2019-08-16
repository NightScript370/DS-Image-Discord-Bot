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
		const __ = (k, ...v) => global.getString(message.author.lang, k, ...v);

		let voiceChannel = message.member.voice.channel;
		if (!voiceChannel)
			return message.util.reply(__("in order to use audio commands, you will need to be in a voice channel"));

		let fetched = this.client.audio.active.get(message.guild.id);
		if (!fetched)
			return message.util.reply(__("in order to {0} audio, there needs to be audio playing in the channel", "pause"));

		if (fetched.dispatcher.paused)
			return message.uitl.reply(__("the audio that you are currently supposed to be listening to is already paused"));

		fetched.dispatcher.pause();
		message.reply(__("I have successfully paused {0}.", fetched.queue[0].songTitle));
	}
};