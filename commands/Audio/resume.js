const { Command } = require('discord-akairo');

module.exports = class ResumeCommand extends Command {
	constructor() {
		super('resume', {
			aliases: ['resume'],
			category: 'Audio',
			description: {
        content: 'Resume the currently paused audio.'
      },
			channelRestriction: 'guild',
		});
	}

	exec(message) {
		let voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.channel.send(global.getString(message.author.lang, "in order to use audio commands, you will need to be in a voice channel"));

		let fetched = this.client.audio.active.get(message.guild.id);
		if(!fetched) return message.reply(global.getString(message.author.lang, "in order to use the resume command, there needs to be audio playing in the channel"));
		if(!fetched.dispatcher.paused) return message.reply("the audio is not paused.");

		fetched.dispatcher.resume();
    return message.reply(`I have successfully resumed ${fetched.queue[0].songTitle}.`);
  }
}