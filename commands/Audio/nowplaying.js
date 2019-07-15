const { Command } = require('discord-akairo');
const { getInfo } = require("ytdl-core-discord");

module.exports = class NowPlayingCommand extends Command {
	constructor() {
		super('nowplaying', {
			aliases: ['np', 'nowplaying'],
			category: 'Audio',
			description: {
				content: 'Shows information on the currently playing song.'
			},
			channelRestriction: 'guild'
		});
	}

	async exec(msg) {
		let fetched = this.client.audio.active.get(msg.guild.id);
		if (!fetched)
			return msg.reply(global.getString(msg.author.lang, "there currently isn't any music playing in this server."));

		let nowPlaying = fetched.queue[0];

		let messagereply = `__**<:music:494355292948004874> ${global.getString(msg.author.lang, "Now Playing: {0}", nowPlaying.songTitle)}**__: <${nowPlaying.url}>`

		let embed;
		if (msg.guild.me.hasPermission('EMBED_LINKS')) {
			embed = this.client.util.embed()
				.setColor("#FF006E")
				.setTimestamp(nowPlaying.timerequest)
				.setThumbnail(nowPlaying.thumbnail)
				.setFooter(global.getString(msg.author.lang, "Requested by {0}", nowPlaying.requester))
				.addField(global.getString(msg.author.lang, "Progress"), `${this.progressBar(Math.round(fetched.dispatcher.time/1000), nowPlaying.secs, nowPlaying.url, 15)} (${this.getTime(fetched.dispatcher.time/1000)}/${nowPlaying.length})`, true)

			if(nowPlaying.description && nowPlaying.description.length < 1000)
				embed.setDescription(nowPlaying.description);

			let relatedvidlist = "";

      		let videoInfo;
      		for (var relatedvideo of nowPlaying.related) {
        		if(related.id) continue;
        		if(related.length > 1000) break;

				try {
					videoInfo = await getInfo(`https://www.youtube.com/watch?v=${relatedvideo.id}`);
					relatedvidlist += `**[${relatedvideo.title}](${info.video_url})** by [${relatedvideo.author}](${info.author.channel_url})\n`;
				} catch (e) {
					relatedvidlist += `**[${relatedvideo.title}](https://www.youtube.com/watch?v=${relatedvideo.id})** by ${relatedvideo.author}`
				}
			}

			relatedvidlist += "\n " + global.getString(msg.author.lang, "Type `!play related` to play a related video");
			embed.addField("Related", related);
    	} else {
      		let messagenoembed = `\n ${nowPlaying.description} \n\n ${global.getString(msg.author.lang, "Song requested by {0}", nowPlaying.requester)}`;
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