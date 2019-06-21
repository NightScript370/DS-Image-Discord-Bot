const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class IfunnyCommand extends Command {
	constructor() {
		super('ifunny', {
			aliases: ['ifunny'],
			category: 'Image Edits',
			description: 'Draws an image with the iFunny logo.',
      cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'iFunny',
					url: 'https://ifunny.co/'
				}
			],
			args: [
				{
					id: 'image',
					type: 'image'
				}
			]
		});
	}

	async exec(msg, { image }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ifunny.png'));

			const data = await loadImage(image);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');

			ctx.drawImage(data, 0, 0);
			ctx.fillStyle = '#181619';
			ctx.fillRect(0, canvas.height - base.height, canvas.width, base.height);
			ctx.drawImage(base, canvas.width - base.width, canvas.height - base.height);

			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'ifunny.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};