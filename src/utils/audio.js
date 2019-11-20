import Youtube from 'ytdl-core-discord';

const isGood = (variable) => {
	if (variable && variable !== null && (variable.size || variable.length)) return true;
		return false;
}

export const active = new Map();
export async function play(msg, client, data) {
	const __ = (k, ...v) => global.translate(data.language, k, ...v);
	let playing;
	if (!data.connection) {
		if (!msg.member || (msg.member && !msg.member.voice))
			return client.audio.finish(msg, client, data.dispatcher);

		if (!msg.guild.voice || (msg.guild.voice && !msg.guild.voice.connection))
			data.connection = await msg.member.voice.channel.join();
		else
			data.connection = msg.guild.voice.connection;
	}
	data.dispatcher = data.connection.play(await Youtube(data.queue[0].url), { type: 'opus', volume: false })
		.on('start', async () => {
			let embed = client.util.embed()
				.setTitle(`<:music:494355292948004874> Now Playing: ${data.queue[0].songTitle}`, data.queue[0].url)
				.setColor("#FF006E")
				.addInline("Requester", data.queue[0].requester)
				.addInline("Duration", data.queue[0].length)
				.setTimestamp(data.queue[0].timerequest)
				.setThumbnail(data.queue[0].thumbnail)
				.setServerFooter(msg, true);

			if (isGood(data.queue[0].related) && isGood(data.queue[0].related[0])) {
				let related = data.queue[0].related[0];
				embed.addField("Related", `**[${related.title}](https://www.youtube.com/watch?v=${related.id})** ` + __("by {0}", `[${related.author}](https://youtube.com/channel/${related.ucid})`));
			}

			try {
				let lastChannelMessage = await msg.channel.lastMessage;
				if (lastChannelMessage.author.id == client.user.id) {
					playing = await lastChannelMessage.edit({ embed: embed });
				}
				else {
					playing = await msg.channel.send({ embed: embed });
				}
			}
			catch (e) {
				playing = await msg.channel.send({ embed: embed });
			}
		})
		.on('debug', (packet) => console.log(`[DISPATCHER DEBUG] ${packet}`))
		.on('error', async (err) => {
			console.error('Error occurred in stream dispatcher:', err);
			if (playing)
				playing.edit(`An error occurred while playing the song: ${err.toString()}`);
			else
				playing = await msg.channel.send(`An error occurred while playing the song: ${err.toString()}`);
			data.dispatcher.guildID = data.guildID;
			client.audio.finish(msg, client, data.dispatcher);
		})
		.once('finish', () => {
			data.dispatcher.guildID = data.guildID;
			client.audio.finish(msg, client, data.dispatcher);
		});
}
export async function finish(msg, client, dispatcher) {
	let fetched = await client.audio.active.get(dispatcher.guildID);
	let voicechat = client.guilds.get(dispatcher.guildID).me.voice.channel;
	try {
		const vcsize = await voicechat.members.filter(val => val.id !== client.user.id).size;
		if (!vcsize) {
			client.audio.active.delete(dispatcher.guildID);
			if (voicechat)
				return voicechat.leave();
			dispatcher.destroy();
		}
		await fetched.queue.shift();
		if (fetched.queue.length > 0) {
			await client.audio.active.set(dispatcher.guildID, fetched);
			client.audio.play(msg, client, fetched);
		}
		else {
			client.audio.active.delete(dispatcher.guildID);
			if (voicechat)
				return voicechat.leave();
			dispatcher.destroy();
		}
	}
	catch (error) {
		console.error(error);
		if (voicechat)
			return voicechat.leave();
		dispatcher.destroy();
	}
}