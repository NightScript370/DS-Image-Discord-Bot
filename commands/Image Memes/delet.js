const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class DeleteCommand extends Command {
    constructor() {
        super('delet', {
            aliases: ["delet"],
            category: "Image Memes",
            description: "Shows an image of the Delete File prompt on Windows.",
            clientPermissions: ['ATTACH_FILES'],
            args: [
                {
                    id: 'images',
                    type: 'image',
                    match: 'rest'
                }
            ],
        });
    }

    async exec(message, { images }) {
        let currentimage, widthpad, heightpad;

		if (!this.isGood(images))
			return msg.reply('No images were found. Please try again.')

        try {
            let deleteimage = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'delete.png'));

		    const canvas = createCanvas(deleteimage.width, deleteimage.height);
		    const ctx = canvas.getContext('2d');

            const imagessize = await this.largestSize(images);
		    const tempcanvas = await createCanvas(imagessize.width, imagessize.height);
		    const tempctx = tempcanvas.getContext('2d');

            for (var image of images) {
			    currentimage = await loadImage(image);

			    widthpad = (imagessize.width - currentimage.width) / 2;
			    heightpad = (imagessize.height - currentimage.height) / 2;

			    tempctx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
	        }

            ctx.drawImage(deleteimage, 0, 0, deleteimage.width, deleteimage.height)
            ctx.drawImage(tempcanvas, 120, 135, 195, 195)

            const attachment = canvas.toBuffer();
            if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
			    return message.util.send({ files: [{ attachment, name: 'delet.png' }] });
        } catch (e) {
            return msg.reply(global.getString(msg.author.lang, "The images that were specified could not be deleted, due to an error: `{0}`. Please report this to the Yamamura Developers.", e.message));
        }
    }
}
