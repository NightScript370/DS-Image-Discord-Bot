const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const { distort } = require('../../utils/Canvas');

module.exports = class GlitchCommand extends Command {
	constructor() {
		super('glitch', {
			aliases: ["glitch"],
			category: 'Image Edits',
			description: 'Draws an image with a glitch effect.',
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

	async exec(msg, { level, image }) {
		try {
			const data = await loadImage(image);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');

      ctx.drawImage(data, 0, 0);
			distort(ctx, 20, 0, 0, data.width, data.height, 5);

			const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'distort.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};