const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { drawImageWithTint } = require('../../utils/Canvas');

module.exports = class ToBeContinuedCommand extends Command {
	constructor() {
		super('to-be-continued', {
			aliases: ['to-be-continued', "tbc"],
			category: 'Image Memes',
			description: 'Draws an image with the "To Be Continued..." arrow.',
      cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'JoJo\'s Bizzare Adventure',
					url: 'http://www.araki-jojo.com/'
				}
			],
			args: [
				{
					id: 'images',
					type: 'image',
					match: 'rest'
				}
			]
		});
	}

	async exec(msg, { images }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'to-be-continued.png'));

			const data = await loadImage(images);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');

      drawImageWithTint(ctx, data, '#704214', 0, 0, data.width, data.height);
			const ratio = base.width / base.height;
			const width = canvas.width / 2;
			const height = Math.round(width / ratio);
			ctx.drawImage(base, 0, canvas.height - height, width, height);

      const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'to-be-continued.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};