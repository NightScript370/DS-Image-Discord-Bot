const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class SteppedInShitCommand extends Command {
    constructor() {
        super('steppedinshit', {
            aliases: ["steppedinshit", 'stepinshit'],
            category: "Image Edits",
            description: {
                content: "Step in shit aka your image"
            },
            clientPermissions: ['ATTACH_FILES'],
            args: [
                {
					id: 'images',
					type: 'image',
					match: 'rest'
				},
                {
                    id: 'overlay',
                    match: 'flag',
					flag: '--overlay'
                }
			],
        });
    }

    async exec(message, { images, overlay }) {
        if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.')

        const attachment = await this.stepInShit(images, overlay);
        if (Buffer.byteLength(attachment) > 8e+6)
            return message.util.reply('Resulting image was above 8 MB.');

        return message.util.send({ files: [{ attachment, name: 'stepinshit.png' }] });
    }

    async stepInShit(images, overlay) {
        const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'stepinshit.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#CCCCCC';
        ctx.fillRect(0, 0, base.width, base.height);

        if (overlay) {
            ctx.drawImage(base, 0, 0, base.width, base.height);
        }

		ctx.rotate(-0.6);

        let currentshit;
        for (var image of images) {
			currentshit = await loadImage(image);
			ctx.drawImage(currentshit, -350, 800, 430, 170);
        }

		ctx.rotate(0.6);

        if (!overlay) {
            ctx.drawImage(base, 0, 0, base.width, base.height);
        }

        return canvas.toBuffer();
    }
}