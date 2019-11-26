const Command = require('./Command.js');
const createCanvas, loadImage  = require('canvas')
import path from 'path';
const deflateRawSync = require('zlib')

module.exports = class ImageCommand extends Command {
	constructor(...args) {
		super(args);
	}

	largestSize(images) {
		let currentimage;

		let height = 0;
		let width = 0;

		if (Array.isArray(images))
			for (var image of images) {
				currentimage = loadImage(image);

				if (height < currentimage.height)
					height = currentimage.height;

				if (width < currentimage.width)
					width = currentimage.width;
			}
		else {
			currentimage = loadImage(images);

			height = currentimage.height;
			width = currentimage.width;
		}

		return { width, height };
	}

	greyscale(ctx, unbluered=false, x=0, y=0, width=null, height=null) {
		if (width == null)
			width = ctx.width;

		if (height == null)
			height = ctx.height;

		const data = ctx.getImageData(x, y, width, height);
		let brightness;

		for (let i = 0; i < data.data.length; i += 4) {
			if (!unbluered)
				brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
			else
				brightness = (0.2126 * data.data[i]) + (0.7152 * data.data[i + 1]) + (0.0722 * data.data[i + 2]);

			data.data[i] = data.data[i + 1] = data.data[i + 2] = brightness;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	threshold(ctx, threshold, x=0, y=0, width=null, height=null) {
		if (width == null)
			width = ctx.width;

		if (height == null)
			height = ctx.height;

		const data = ctx.getImageData(x, y, width, height);
		let changedValue;

		for (let i = 0; i < data.data.length; i += 4) {
			changedValue = (((0.2126 * data.data[i]) + (0.7152 * data.data[i + 1]) + (0.0722 * data.data[i + 2])) >= threshold) ? 255 : 0;
			data.data[i] = data.data[i + 1] = data.data[i + 2] = changedValue;
		}

		ctx.putImageData(data, x, y);
		return ctx;
	}

	invert(ctx, x=0, y=0, width=null, height=null) {
		if (width == null)
			width = ctx.width;

		if (height == null)
			height = ctx.height;

		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			data.data[i] = 255 - data.data[i];
			data.data[i + 1] = 255 - data.data[i + 1];
			data.data[i + 2] = 255 - data.data[i + 2];
		}

		ctx.putImageData(data, x, y);
		return ctx;
	}

	silhouette(ctx, x=0, y=0, width=null, height=null) {
		if (width == null)
			width = ctx.width;

		if (height == null)
			height = ctx.height;

		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			data.data[i] = 0;
			data.data[i + 1] = 0;
			data.data[i + 2] = 0;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	sepia(ctx, x=0, y=0, width=null, height=null) {
		if (width == null)
			width = ctx.width;

		if (height == null)
			height = ctx.height;

		const data = ctx.getImageData(x, y, width, height);
		for (let i = 0; i < data.data.length; i += 4) {
			const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
			data.data[i] = brightness + 100;
			data.data[i + 1] = brightness + 50;
			data.data[i + 2] = brightness;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	contrast(ctx, x, y, width, height) {
		const data = ctx.getImageData(x, y, width, height);
		const factor = (259 / 100) + 1;
		const intercept = 128 * (1 - factor);
		for (let i = 0; i < data.data.length; i += 4) {
			data.data[i] = (data.data[i] * factor) + intercept;
			data.data[i + 1] = (data.data[i + 1] * factor) + intercept;
			data.data[i + 2] = (data.data[i + 2] * factor) + intercept;
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	distort(ctx, amplitude, x, y, width, height, strideLevel = 4) {
		const data = ctx.getImageData(x, y, width, height);
		const temp = ctx.getImageData(x, y, width, height);
		const stride = width * strideLevel;
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				const xs = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)));
				const ys = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)));
				const dest = (j * stride) + (i * strideLevel);
				const src = ((j + ys) * stride) + ((i + xs) * strideLevel);
				data.data[dest] = temp.data[src];
				data.data[dest + 1] = temp.data[src + 1];
				data.data[dest + 2] = temp.data[src + 2];
			}
		}
		ctx.putImageData(data, x, y);
		return ctx;
	}

	drawImageWithTint(ctx, image, color, x, y, width, height) {
		const { fillStyle, globalAlpha } = ctx;
		ctx.fillStyle = color;
		ctx.drawImage(image, x, y, width, height);
		ctx.globalAlpha = 0.5;
		ctx.fillRect(x, y, width, height);
		ctx.fillStyle = fillStyle;
		ctx.globalAlpha = globalAlpha;
	}

	shortenText(ctx, text, maxWidth) {
		let shorten = false;
		while (ctx.measureText(text).width > maxWidth) {
			if (!shorten) shorten = true;
			text = text.substr(0, text.length - 1);
		}
		return shorten ? `${text}...` : text;
	}

	wrapText(ctx, text, maxWidth) {
		return new Promise(resolve => {
			if (ctx.measureText(text).width < maxWidth) return resolve([text]);
			if (ctx.measureText('W').width > maxWidth) return resolve(null);
			const words = text.split(' ');
			const lines = [];
			let line = '';
			while (words.length > 0) {
				let split = false;
				while (ctx.measureText(words[0]).width >= maxWidth) {
					const temp = words[0];
					words[0] = temp.slice(0, -1);
					if (split) {
						words[1] = `${temp.slice(-1)}${words[1]}`;
					} else {
						split = true;
						words.splice(1, 0, temp.slice(-1));
					}
				}
				if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
					line += `${words.shift()} `;
				} else {
					lines.push(line.trim());
					line = '';
				}
				if (words.length === 0) lines.push(line.trim());
			}
			return resolve(lines);
		});
	}
}
