const { Command } = require('discord-akairo');

module.exports = class QueueCommand extends Command {
	constructor() {
		super("queue", {
			aliases: ['queue'],
			category: 'Audio',
			description: { content: 'Shows the music queue for the current server.' },
			channelRestriction: 'guild'
		});
	}

	async exec(msg) {
		const __ = (k, ...v) => global.getString(msg.author.lang, k, ...v);

		let fetched = this.client.audio.active.get(msg.guild.id);
		if (!fetched)
			return msg.util.reply(__("there currently isn't any music playing in this server"));

		if (fetched.queue.length < 1)
			return msg.util.reply(__("there currently isn't any music playing in this server"));

		let nowPlaying = fetched.queue[0];
		let next = fetched.queue[1];

		if (msg.guild.me.hasPermission('EMBED_LINKS')) {
			let embed = this.client.util.embed()
				.setColor("#b30000")
				.setTimestamp(new Date())
				.setDescription(__("**NOW PLAYING**: [{0}]({1}) | Requested by {2}", nowPlaying.songTitle, nowPlaying.url, nowPlaying.requester) + "\n" +
								__("**NEXT**: [{0}]({1}) | Requested by {2}", next.songTitle, next.url, next.requester))
				.setThumbnail(msg.guild.iconURL({ format: 'png' }))
				.setFooter(__('Add your own song to this list using the play command'))

			for (var song of fetched.queue) {
				if (song == nowPlaying || song == next) continue;
				embed.addField(`${song.songTitle}`, __("[Link]({0}) | Requested by {1}", song.url, song.requester));
			}

			return msg.util.send("<:music:494355292948004874>" + __("Queue"), { embed });
		}

		let musiclist = "<:music:494355292948004874>" + __("Queue") + "\n";

		for (var song of fetched.queue) {
			if (song == nowPlaying) {
				musiclist += `**NOW PLAYING**: ${song.songTitle} | Requested by ${song.requester} \n`;
				continue;
			}

			if (song == next) {
				musiclist += `**NEXT**: ${song.songTitle} | Requested by ${song.requester} \n\n`;
				continue;
			}

			musiclist += `${song.songTitle} | Requested by ${song.requester} \n`;
		}

		return msg.util.send(musiclist);
	}
};