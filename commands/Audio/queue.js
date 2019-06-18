const { Command } = require('discord-akairo');

module.exports = class QueueCommand extends Command {
	constructor() {
		super("queue", {
			aliases: ['queue'],
			category: 'Audio',
			description: {content: 'Shows the music queue for the current server.'},
			channelRestriction: 'guild'
		});
	}

	async exec(msg) {
		var fetched = this.client.audio.active.get(msg.guild.id);
		if(!fetched) return msg.reply("there currently isn't any music playing in this server");

    if (fetched.queue.length < 1) return msg.reply("there currently isn't any music playing in this server");
		let nowPlaying = fetched.queue[0];
    let next = fetched.queue[1];

    if (msg.guild.me.hasPermission('EMBED_LINKS')) {
		  var embed = this.client.util.embed()
			  .setTitle("<:music:494355292948004874> Music List")
			  .setColor("#b30000")
			  .setTimestamp(new Date())
			  .setDescription(`**NOW PLAYING**: [${nowPlaying.songTitle}](${nowPlaying.url}) | Requested by ${nowPlaying.requester} \n`
                      + `**NEXT**: [${next.songTitle}](${next.url}) | Requested by ${next.requester}`)
        .setThumbnail(msg.guild.iconURL({format: 'png'}))
        .setFooter('Add your own song to this list using the play command')

		  for (var song of fetched.queue) {
        if (song == nowPlaying || song == next) continue;
			  embed.addField(`${song.songTitle}`, `[Link](${song.url}) | Requested by ${song.requester}`); 
		  }
		  return msg.util.send({embed});
    } else {
      let musiclist = `**__<:music:494355292948004874> Music List__** \n`;

      for (var song of fetched.queue) {
        if (song == nowPlaying)
          return musiclist += `**NOW PLAYING**: ${song.songTitle} | Requested by ${song.requester} \n`;
        else if (song == next)
          return musiclist += `**NEXT**: ${song.songTitle} | Requested by ${song.requester} \n\n`;

        return musiclist += `${song.songTitle} | Requested by ${song.requester} \n`; 
		  }
    }
	}
};