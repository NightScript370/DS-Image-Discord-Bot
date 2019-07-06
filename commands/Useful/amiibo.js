const { Command } = require('discord-akairo');
const request = require("request");

module.exports = class AmiiboCommand extends Command {
  constructor() {
    super('amiibo', {
      aliases: ['amiibo'],
      category: 'Useful',
      clientPermissions: ['EMBED_LINKS'],
      description: {
				content: 'Replies with information on an amiibo. We currently use amiiboapi.com but will soon be using our very own.',
				usage: '<amiibo name>',
				examples: ['Mario', 'Mario - Gold Edition', 'Sonic the hedgehog']
			},
			args: [
        {
					id: 'name',
					prompt: 'Which Amiibo would you like to get information on',
					type: 'string',
          match: 'content'
        }
      ]
    });
  }

  async exec(msg, { name }) {
    const client = await this.client;
    // TODO: Link to our own API, where we control stuff.
		request({ url: 'http://www.amiiboapi.com/api/amiibo/?name='+encodeURIComponent(name),	json: true }, function (error, response, body) {
			if (!error && response.statusCode === 200) {
        let amiibos = body.amiibo.slice(0, 3);

        for (var amiibo of amiibos) {
          var embed = client.util.embed()
            .setAuthor(`Amiibo - ${amiibo.name}`, `https://vignette.wikia.nocookie.net/videogames-fanon/images/1/1c/Amiibo_icon.png/revision/latest?cb=20160507010201`)
            .setImage(amiibo.image)
            .addInline("Series", `**Amiibo:** ${amiibo.amiiboSeries} \n **Franchise** ${amiibo.gameSeries}`)
            .addInline("Releases", buildReleases(amiibo.release))
            .setFooter(`Type: ${amiibo.type}`);

          if (amiibo.amiiboSeries == "Super Smash Bros.") {
            embed.setThumbnail("https://hey-hey-listen.com/wp-content/uploads/2018/03/Smash_Ball_White-1.png")
          } else if (amiibo.amiiboSeries == "Yoshi's Wooly World") {
            embed.setThumbnail("https://cdn.glitch.com/6959811c-1d7b-489f-b1f0-281ae0d8936c%2FSimple%20Yoshi.png?1556214310071")
          }
          msg.channel.send(embed);
        }
			} else {
        if (body.code == 404) {
          var embed = client.util.embed()
            .setTimestamp(new Date())
				    .setColor("#FF0000")
					  .setTitle("404 - Amiibo not found")
				    .setThumbnail("https://vignette.wikia.nocookie.net/videogames-fanon/images/1/1c/Amiibo_icon.png/revision/latest?cb=20160507010201")
				    .setFooter("Please check your spelling and try again")
				    .setDescription("The requested amiibo was not found");

          msg.channel.send(embed);
        } else {
			    var embed = client.util.embed()
				    .setTimestamp(new Date())
				    .setColor("#FF0000")
				    .setTitle("Unknown Error")
					  .setThumbnail("https://vignette.wikia.nocookie.net/videogames-fanon/images/1/1c/Amiibo_icon.png/revision/latest?cb=20160507010201")
				    .setFooter("Yamamura - by NightYoshi370 & Samplasion")
				    .setDescription("Please contact the Yamamura developers on the [support server](https://discord.gg/vbYZCRZ)");

          msg.channel.send(embed);
        }

        if (msg.guild && !msg.guild.me.hasPermission('EMBED_LINKS'))
          msg.channel.send('An error has occured. Please report this error to the Yamamura developers on the support server: https://discord.gg/vbYZCRZ')
        else
          msg.channel.send({embed: embed});
			}
		});
  }
};

function buildReleases(releases) {
  let flags = '';

  if (!empty(releases)) {
    if (!empty(releases.na)) flags += `:flag_us: ${releases.na} \n`;
    if (!empty(releases.eu)) flags += `:flag_eu: ${releases.eu} \n`;
    if (!empty(releases.jp)) flags += `:flag_jp: ${releases.jp} \n`;
    if (!empty(releases.au)) flags += `:flag_au: ${releases.au} \n`;
  }

  return flags
}

function empty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}