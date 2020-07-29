const Command = require('./Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class ImageCommand extends Command {
	constructor(id, options = {}) {
		super(id, options);
	}

	async largestSize(images) {
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

		return {width: width, height: height};
	}
}
