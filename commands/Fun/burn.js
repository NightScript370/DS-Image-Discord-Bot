const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { drawImageWithTint } = require('../../utils/Canvas');

module.exports = class BurnCommand extends Command {
	constructor() {
		super('burn', {
			aliases: ["fire", "hell", "burn"],
			category: 'Fun',
			description: 'Draws an image with a destructive fire effect.',
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
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'fire.png'));

			const data = await loadImage(image);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');

      drawImageWithTint(ctx, data, '#fc671e', 0, 0, data.width, data.height);
			ctx.drawImage(base, 0, 0, data.width, data.height);
			
      const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
      return msg.channel.send({ files: [{ attachment: attachment, name: 'fire.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}