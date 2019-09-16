const { Command } = require('discord-akairo');
const { getInfo } = require('ytdl-core-discord');

module.exports = class NowPlayingCommand extends Command {
	constructor() {
		super('nowplaying', {
			aliases: ['np', 'nowplaying', '再生中'],
			category: 'Audio',
			description: {
				content: 'Shows information on the currently playing song.'
			},
			channelRestriction: 'guild'
		});
	}

	async exec(message) {
		const __ = (k, ...v) => global.getString(message.author.lang, k, ...v)

		let fetched = this.client.audio.active.get(message.guild.id);
		if (!fetched)
			return message.util.reply(__("there currently isn't any music playing in this server."));

		let nowPlaying = fetched.queue[0];

		let messagereply = `__**<:music:494355292948004874> ${__("Now Playing: {0}", nowPlaying.songTitle)}**__: <${nowPlaying.url}>`

		let embed;
		if (message.channel.embedable) {
			embed = this.client.util.embed()
				.setColor("#FF006E")
				.setTimestamp(nowPlaying.timerequest)
				.setThumbnail(nowPlaying.thumbnail)
				.setFooter(__("Requested by {0}", nowPlaying.requester))
				.addField(__("Progress"), `${this.progressBar(Math.round(fetched.dispatcher.streamTime/1000), nowPlaying.secs, nowPlaying.url, 15)} (${this.getTime(fetched.dispatcher.time/1000)}/${nowPlaying.length})`, true)

			if(nowPlaying.description && nowPlaying.description.length < 1000)
				embed.setDescription(nowPlaying.description);

			const YT = "https://youtube.com/";
			let relatedvidlist = "";

      		for (var relatedvideo of nowPlaying.related) {
        		if (!relatedvideo.id) continue;
        		if (relatedvidlist.length > 768) break;

				relatedvidlist += `**[${relatedvideo.title}](${YT}watch?v=${relatedvideo.id})** ${__("by {0}", `[${relatedvideo.author}](${YT}channel/${relatedvideo.ucid})`)}\n`;
			}

			relatedvidlist += "\n " + __("Type `{0}play related` to play a related video", await this.handler.prefix(message));
			embed.addField(__("Related Videos"), relatedvidlist);
    	} else {
      		let messagenoembed = `\n ${nowPlaying.description} \n\n ${__("Song requested by {0}", nowPlaying.requester)}`;
      		if ((messagereply + messagenoembed).length <= 2000) messagereply = messagereply + messagenoembed
    	}

		message.util.reply(messagereply, embed ? {embed} : {});
	}

	getTime(secs) {
		var mins = secs / 60;
		var oms = mins > Math.floor(mins) && mins < Math.ceil(mins) // one more second
																	// if `mins` is greater than the nearest
																	// lower int, but lower than the nearest
																	// greater int, add a second
		var sec = (secs % 60) + (oms ? 0 : 1);
		return `${this.client.util.pad(Math.floor(mins))}:${this.client.util.pad(Math.floor(sec))}`
	}

	progressBar(now, total, url, bars) {
		var bars = 7;
		var ab = Math.round((now * bars) / total)
		var a = "[[";
		var i = 0, j = 0;
		while (i <= bars) {
			a += ab > i ? "▬" : "";
			i++;
		}
		a += `](${url})`;
		while (j <= bars) {
			a += ab >= j ? "" : "▬";
			j++;
		}
		return a + "]";
	}
};