const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const { invert } = require('../../utils/Canvas');

module.exports = class InvertCommand extends Command {
	constructor() {
		super('invert', {
			aliases: ["invert"],
			category: 'Image Edits',
			description: 'Draws the negative of an image.',
      cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
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
			const data = await loadImage(image);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');

			ctx.drawImage(data, 0, 0);
			invert(ctx, 0, 0, data.width, data.height);

			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'invert.png' }] });
		} catch (err) {
			console.error(err);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};