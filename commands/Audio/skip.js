const { Command } = require('discord-akairo');

module.exports = class SkipAudioCommand extends Command {
	constructor() {
		super('skip', {
			aliases: ['skip'],
			category: 'Audio',
			description: {
				content: 'Adds a vote to skip the currently playing music.'
			},
			channelRestriction: 'guild',
			args: [
				{
					id: 'modskip',
					description: 'If you want to overwrite the skip voting and you have the MUTE_MEMBERS permission for the voice channel, add the --modskip parameter.',
					match: 'flag',
					flag: '--modskip'
				}
			]
		});
	}

	exec(message, { modskip }) {
		const __ = (k, ...v) => global.getString(message.author.lang, k, ...v);

		let voiceChannel = message.member.voice.channel;
		if (!voiceChannel)
			return message.util.reply(__("I think it may work better if you are in a voice channel!"));

		let fetched = this.client.audio.active.get(message.guild.id);
		if(!fetched)
			return message.util.reply(__("there isn't any music playing in the server"));

		if (!message.member.hasPermission('MUTE_MEMBERS'))
			modskip = false;

		let uservcCount = message.member.voice.channel.members.size;
		let requiredToSkip = Math.ceil(uservcCount / 2);

		let currentSong = fetched.queue[0];
		if (!currentSong.voteSkips)
			currentSong.voteSkips = [];

		let isSkipped = this.handleSkip(fetched, requiredToSkip, message, modskip)
		if (isSkipped) return;

		if (currentSong.voteSkips.includes(message.member.id))
			return message.util.reply(__('you already voted to skip! {0}/{1} required.', currentSong.voteSkips.length, requiredToSkip));

		currentSong.voteSkips.push(message.member.id);
		this.client.audio.active.set(message.guild.id, fetched);

		isSkipped = this.handleSkip(fetched, requiredToSkip, message, modskip)
		if (!isSkipped)
			return message.util.reply(__('your vote has been added. {0}/{1} required', currentSong.voteSkips.length, requiredToSkip));
	}

	handleSkip(fetched, requiredToSkip, message, modskip) {
		const __ = (k, ...v) => global.getString(message.author.lang, k, ...v);

		let canSkip = fetched.queue[0].voteSkips.length >= requiredToSkip || message.author.tag == fetched.queue[0].requester || modskip;
		if (!canSkip)
			return false;

		if (fetched.queue[1])
			message.util.reply(__('the song has been successfully skipped, but there is no music left.'));

		fetched.dispatcher.emit('finish');
		return true;
	}
};