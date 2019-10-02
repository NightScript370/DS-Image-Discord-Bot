const Command = require('../../struct/Command');
const YTDL = require('ytdl-core-discord');

const youtubeSearch = require('yt-search');
const YouTubePlayList = require("ytpl");

const { promisify } = require("util");
const findVideosAsync = promisify(youtubeSearch);
const ytpl = promisify(YouTubePlayList);

const playlistRegex = /(http(s)?:\/\/((www\.)?(youtube\.com|youtu.be))\/playlist\?list\=)?([^=\s*][a-zA-Z0-9\-\_]{33,34})/g

module.exports = class PlayAudioCommand extends Command {
	constructor() {
		super('play', {
			aliases: ['play', '再生'],
			category: 'Audio',
			description: {
				content: 'Plays audio. Can either be a Youtube video or one of the streams from listen.moe',
				usage: '<video link or name>'
			},
			channelRestriction: 'guild',
			args: [{
				id: 'link',
				description: "You can specify either a specific Youtube video URL or the title of the video. You can also add playlists (put the playlist URL) or songs related to the song that is playing right now (type 'related')",
				prompt: {
					start: (msg) => global.getString(msg.author.lang, "Please state a video from Youtube you'd like to listen to."),
					retry: (msg) => global.getString(msg.author.lang, "That's not a valid song! Try again.")
				},
				type: 'string',
				match: 'content'
			}]
		});
	}

	async exec(msg, { link }) {
		const __ = (k, ...v) => global.getString(msg.author.lang, k, ...v);
		let canSend = msg.channel.sendable;

		// Step 1: Check if the user is in a Voice Channel
		let voiceChannel = await msg.member.voice.channel;
		if (!voiceChannel) return (canSend ? msg.util.reply(__("you need to be in a voice channel in order for me to play music")) : null);

		// Step 2: Check the user's perms for that specific voice channel
		let userperm = await voiceChannel.permissionsFor(msg.member);
		if (!userperm.has('CONNECT')) return (canSend ? msg.util.reply(__("You lost perms to connect to the Voice Channel.")) : null);

		// Step 3: Check the bot perms for that specific voice channel
		let botperms = await voiceChannel.permissionsFor(msg.client.user);
		if (!botperms.has('CONNECT')) return msg.util.reply(__("I can't join. Make sure I have the proper permissions.")).catch(console.error);
		if (!botperms.has('SPEAK')) return (canSend ? msg.util.reply(__("I can't speak. Make sure I have the proper permissions.")) : null);

		let musicblock = this.client.emojis.get("494355292948004874")

		let embed = this.client.util.embed()
			.setColor("#FF006E")
			.setThumbnail(musicblock.url);

		// Step 4: Check if they try to search for a related video
		let fetched = this.client.audio.active.get(msg.guild.id);
		if (link == "related" && fetched) {
			embed.setTitle(__("Related Music Search"), "http://clipart-library.com/images/ziXedkoBT.png", "https://youtube.com/");
			let relatedLink = await this.responceSelector(msg, fetched.queue[0].nowPlaying.related.splice(0, 6), embed, 'related');

			if (relatedLink) this.play(msg, relatedLink.id.trim(), true)
		}

		// Step 5: Check if it's a playlist (playlists have their own unique features and code)
		if (link.match(playlistRegex)) {
			var pl = await playlistRegex.exec(link)[6];
			const res = await ytpl(pl, { limit: 20 });

			try {
				for (var item of res.items) {
					await this.play(msg, item.url_simple, false)
				}

				return msg.util.send(__("Added {0} song(s) to Queue: {1} | Requested by: {2}", res.total_items, res.title, msg.author.tag));
			} catch (e) {
				console.error(e);
				return msg.util.reply(__("Error: Unfortunately, there has been an error with adding that playlist. Please report the issue to the Yamamura developers found on the main support server."));
			}
		}

		// Step 6: Check if it's a valid link. If not, give us an error
		let URLvalid = false;

		let validate = await YTDL.validateURL(link);
		if (validate) validate = true;

		if (validate)
			return this.play(msg, link, true);

		try {
			let results = await findVideosAsync(link);

			embed.setTitle(__("Music Search"), "http://clipart-library.com/images/ziXedkoBT.png", "https://youtube.com/");
			let videoLink = await this.responceSelector(msg, results.videos.splice(0, 6), embed);

			if (videoLink) this.play(msg, videoLink.videoId.trim(), true)
		} catch (error) {
			console.error(error);
			return msg.reply(__("an error has occured while searching on Youtube. Please report this to the Yamamura developers."));
		}

	}

	async play(message, video, reply) {
		const __ = (k, ...v) => global.getString(message.author.lang, k, ...v);
		var info = await YTDL.getInfo(video);

		let data = this.client.audio.active.get(message.guild.id) || {};

		if (!data.connection) {
			if (!message.guild.voice || (message.guild.voice && !message.guild.voice.connection)) data.connection = await message.member.voice.channel.join();
			else data.connection = message.guild.voice.connection;
		}

		if (!data.queue) data.queue = [];
		data.guildID = message.guild.id;

		data.queue.push({
			language: message.author.lang,
			songTitle: info.title,
			requester: message.author.tag,
			url: info.video_url,
			announceChannel: message.channel.id,
			length: this.getTime(info.length_seconds),
			secs: info.length_seconds,
			description: info.description,
			thumbnail: info.thumbnail_url,
			timerequest: new Date(),
			related: info.related_videos
		});

		if (!data.dispatcher) this.client.audio.play(message, this.client, data);
		else if (reply) message.util.send(__("Added to Queue: {0} | Requested by: {1}", info.title, message.author.tag));

		this.client.audio.active.set(message.guild.id, data);
	}

	async handleSelector(videos, index, embed = null, language = null) {
		const __ = (k, ...v) => global.getString(language, k, ...v);
		let video = videos[index];

		if (!this.isGood(video.author.channelUrl)) {
			try {
				let videoInfo = YTDL.getInfo(`https://www.youtube.com${videos[index].url}`)
				video.author.channelUrl = videoinfo.author.channel_url
			} catch {}
		}

		if (embed) {
			embed.addField(
				`**${parseInt(index)+1}.** ${video.title} [${video.timestamp}]`,
				`[${__("Link")}](https://youtube.com${video.url}) | ${__("by {0}", (this.isGood(video.author.channelUrl) ? `[${video.author.name}](${video.author.channelUrl})` : video.author.name))}`
			);
		} else {
			return `**${parseInt(index)+1}.** [${videos[index].title}](https://youtube.com${videos[index].url}) ${__("by {0}", (this.isGood(video.author.channelUrl) ? `[${video.author.name}](${video.author.channelUrl})` : video.author.name))} \`[${videos[index].timestamp}]\`\n`;
		}

		return embed
	}

	getTime(secs) {
		if (typeof secs != "number") secs = parseInt(secs);
		var mins = secs / 60;
		var oms = mins > Math.floor(mins) && mins < Math.ceil(mins) // one more second
			// if `mins` is greater than the nearest lower int, but lower than the nearest greater int, add a second
		var sec = oms ? (secs % 60) + 1 : secs % 60;
		return `${this.client.util.pad(Math.floor(mins))}:${this.client.util.pad(Math.floor(sec))}`
	}
};