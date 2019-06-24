const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class ReverseCommand extends Command {
  constructor() {
    super('reverse', {
      aliases: ["reverse", 'backup'],
      category: "Image Memes",
      description: {
        content: "Shows an man reversing once he sees an image"
      },
      clientPermissions: ['ATTACH_FILES'],
      args: [
        {
          id: "images",
          type: "image"
        },
        {
          id: 'layerstretch',
          match: 'flag',
          flag: '--layerstretch'
        }
      ],
    });
  }

  async exec(message, { images, layerstretch }) {
    let currentimage, widthpad, heightpad;

    try {
      if (!layerstretch) {
        const imagessize = await this.largestSize(images);
			  const layeredCanvas = await createCanvas(imagessize.width, imagessize.height);
			  const layeredCtx = canvas.getContext('2d');
      }

      const baseImage = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'reverse.png'));
      const baseCanvas = createCanvas(baseImage.width, baseImage.height);
      const baseCtx = canvas.getContext('2d');

      for (var image of images) {
        currentimage = await loadImage(image);

        if (!layerstretch) {
          widthpad = (imagessize.width - currentimage.width) / 2;
				  heightpad = (imagessize.height - currentimage.height) / 2;

				  layeredCtx.drawImage(currentimage, widthpad, heightpad, currentimage.width, currentimage.height);
        } else {
          baseCtx.drawImage(currentimage, 480, 0, baseImage.width-480, 472)
        }
      }

      if (!layerstretch) {
        baseCtx.drawImage(layeredCtx, 480, 0, baseImage.width-480, 472)
      }

      baseCtx.drawImage(baseImage, 0, 0);

      const attachment = baseCanvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
      return message.util.send({ files: [{ attachment: attachment, name: 'reverse.png' }] });
    } catch (e) {
      return message.reply(`Oh no, an error occurred: \`${e.message}\`. Try again later!`);
    }
  }
}