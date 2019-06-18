const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class ThreeThousandYearsCommand extends Command {
	constructor() {
		super('3000-years', {
			aliases: ['3ky', '3k-years', '3000-years'],
			category: 'Image Memes',
			description: {
        content: 'Draws a user\'s avatar over Pokémon\'s "It\'s been 3000 years" meme.'
      },
			cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'user',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async exec(msg, { user }) {
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 256 });
		try {
      const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', '3000-years.png'));

			const avatar = await loadImage(avatarURL);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');

      ctx.drawImage(base, 0, 0);
			ctx.drawImage(avatar, 461, 127, 200, 200);

      const attachment = canvas.toBuffer()
      if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
      return msg.channel.send({ files: [{ attachment: attachment, name: '3000-years.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};