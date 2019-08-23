const Youtube = require('ytdl-core-discord');

module.exports = {
	active: new Map(),
	play: async (msg, client, data) => {
		let playing;

		if (!data.connection) {
			if (!msg.member || !msg.member.voice) return client.audio.finish(msg, client, data.dispatcher);

			if (!msg.guild.voice || (msg.guild.voice && !msg.guild.voice.connection))
				data.connection = await msg.member.voice.channel.join();
			else
				data.connection = msg.guild.voice.connection;
		}

		data.dispatcher = data.connection.play(await Youtube(data.queue[0].url), { type: 'opus', volume: false });
		const start = Date.now();

		data.dispatcher
			.on('start', async () => {
				console.log(`Starting song with length of ${data.queue[0].secs} seconds.`);
				setTimeout(() => {
					console.log('Song should only now be over');
				}, data.queue[0].secs * 1000 + 10000);

				let relinfo = await Youtube.getInfo(`https://www.youtube.com/watch?v=${data.queue[0].related[0].id}`);
				let embed = client.util.embed()
					.setTitle(`<:music:494355292948004874> Now Playing: ${data.queue[0].songTitle}`, data.queue[0].url)
					.setColor("#FF006E")
					.addField("Requester", data.queue[0].requester, true)
					.addField("Duration", data.queue[0].length, true)
					.addField("Related", `**[${data.queue[0].related[0].title}](${relinfo.video_url})** by ${data.queue[0].related[0].author}`)
					.setTimestamp(data.queue[0].timerequest)
					.setThumbnail(data.queue[0].thumbnail)
					.setServerFooter(msg, true);

				try {
					let lastChannelMessage = await msg.channel.lastMessage;
					if (lastChannelMessage.author.id == client.user.id) {
						playing = await lastChannelMessage.edit({embed: embed});
					} else {
						playing = await msg.channel.send({embed: embed});
					}
				} catch (e) {
					playing = await msg.channel.send({embed: embed});
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
			.once('finish', reason => {
				let seconds = Math.round((Date.now() - start) / 1000);
				console.log(`\tSong was ${data.queue[0].secs} seconds long, ended after ${seconds} seconds; ${(seconds / data.queue[0].secs * 100).toFixed(1)}% played.\n\tEnd reason: ${reason}`);

				data.dispatcher.guildID = data.guildID;
				client.audio.finish(msg, client, data.dispatcher);
			})
	},
	finish: async (msg, client, dispatcher) => {
		let fetched = await client.audio.active.get(dispatcher.guildID);
		let voicechat = client.guilds.get(dispatcher.guildID).me.voice.channel;

		try {
			const vcsize = await voicechat.members.filter(val => val.id !== client.user.id).size;
			if (!vcsize) {
				client.audio.active.delete(dispatcher.guildID);

				if (voicechat)
					return voicechat.leave();
				dispatcher.destroy()
			}

			await fetched.queue.shift();
			if (fetched.queue.length > 0) {
				await client.audio.active.set(dispatcher.guildID, fetched);
				client.audio.play(msg, client, fetched);
			} else {
				client.audio.active.delete(dispatcher.guildID);

				if (voicechat) return voicechat.leave();
				dispatcher.destroy()
			}
		} catch(error) {
			console.error(error);

			if (voicechat) return voicechat.leave();
			dispatcher.destroy()
		}
	}
}