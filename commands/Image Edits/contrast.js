const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const { contrast } = require('../../utils/Canvas');

module.exports = class ContrastCommand extends Command {
	constructor() {
		super('contrast', {
			aliases: ["contrast"],
			category: 'Image Edits',
			description: {
        content: 'Draws an image, but with increased contrast.'
      },
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
			contrast(ctx, 0, 0, data.width, data.height);

      const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'contrast.png' }] });
		} catch (err) {
      console.error(err);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};