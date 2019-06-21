const Command = require('./Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

class CustomCommand extends Command {
  constructor(id, options = {}) {
    super(id, options);
  }

  // Todo: Get the other image commands in here (used for the mass edit command)

  async stepInShit(image, overlay) {
    const base = await loadImage(path.join(__dirname, '..', 'assets', 'images', 'stepinshit.png'));

		const data = await loadImage(image);
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, base.width, base.height);

    if (overlay) {
      ctx.drawImage(base, 0, 0, base.width, base.height);
    }

		ctx.rotate(-0.6);
		ctx.drawImage(data, -350, 800, 430, 170);
		ctx.rotate(0.6);

    if (!overlay) {
      ctx.drawImage(base, 0, 0, base.width, base.height);
    }

    return canvas.toBuffer();
  }

  largestSize(images) {
    let currentimage;

    let height = 0;
    let width = 0;

    for (var image of images) {
      currentimage = await loadImage(image);

      if (height < currentimage.height)
        height = currentimage.height;

      if (width < currentimage.width)
        width = currentimage.width;
    }

    return {width: width, height: height}
  }
}

module.exports = CustomCommand;
