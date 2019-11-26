const Command = require('../../struct/Image-Command.js');
const createCanvas = require('canvas')

module.exports = class GravatarGeneratorCommand extends Command {
	constructor() {
		super('gravatar-generator', {
			aliases: ["gravatar-generate", "gravatar-generator"],
			category: 'Image Edits',
			description: {
				content: 'Replicate the Matrix Grid avatar style used in sites like Github.'
      		},
      		cooldown: 10000,
      		ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'size',
					description: "This is the size you'd like to make the avatar. It defaults to 512",
					type: 'integer',
					match: 'option',
					flag: 'size:',
					default: 512
				}
			]
		});
	}

	exec(message, { size }) {
		const __ = (k, ...v) => global.translate(authorMessage.author.lang, k, ...v)

		let canvas = createCanvas(size, size);
		canvas = init({canvasID: canvas})

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send(__("{0}, Welcome to the Matrix!", message.guild ? message.member.displayName : message.author.username), { files: [{ attachment: attachment, name: 'gravatar-generated.png' }] });
	}
};


function putSquare(ctx, x, y, height, width, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.closePath();
}


function enlight(ctx, height, width, padding, blockStack, color, matrix = false) {
    var Height = height - 2 * padding;
    var Width = width - 2 * padding;

    var squareHeight = Height / blockStack;
    var squareWidth = Width / blockStack;

    for (var i = 0; i < blockStack; i++) {
        for (var j = 0; j < blockStack; j++) {
			if (!matrix || (matrix && (i == matrix.x) && (j == matrix.y)))
            	putSquare(ctx, padding + (j * squareWidth), padding + (i * squareHeight), squareHeight, squareWidth, color);
        }
    }

}


function getCoordinates(number, squares=3) {
	return {
		x: Math.floor(numer / squares),
		y: number % squares
	}
}



function populateMatrix(ctx, height, width, padding, blockStack, color, number) {

    var coordinate = getCoordinates(number);
    enlight(ctx, height, width, padding, blockStack, color, coordinate);
}


function splitnFill(ctx, height, width, padding, blockStack, color, number) {

    var ob = String(number).split('').map(Number);
    var i = 0;
    while (i < ob.length) {
        fillIt(ctx, height, width, padding, blockStack, color, ob[i]);
        i++;
    }
}

function draw(ctx, canvasWidth, canvasHeight, padding, blockStack, colorPrimary, colorSecondary) {
	let timestamp = Math.floor(Math.random() * (max - min + 1)) + min;
	enlight(ctx, canvasWidth, canvasHeight, padding, blockStack, colorSecondary);
	splitnFill(ctx, canvasWidth, canvasHeight, padding, blockStack, colorPrimary, timestamp);
}


//var timestamp = new Date().getUTCMilliseconds();
function init(config = {}) {
	let {
		canvasID = false,
		time = 0,
		randomColor = true,
		colorPrimary = '',
		colorSecondary = ''
	} = config;

	if (!canvasID || canvasID == '')
		return;

	if (randomColor) {
		let colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'];
		if (Array.isArray(randomColor))
			colors = randomColor;

		colorPrimary = colors[Math.floor(Math.random() * colors.length)];
		colorSecondary = colors[Math.floor(Math.random() * colors.length)];
		while (colorSecondary == colorPrimary) {
			colorSecondary = colors[Math.floor(Math.random() * colors.length)];
		}
	}

	let canvas = canvasID;
	if (canvasID instanceof "string")
		canvas = document.getElementById(canvasID);

	canvas.style.background = colorPrimary;
	let ctx = canvas.getContext('2d');
	let padding = 20;
	let blockStack = 3;
	populateMatrix(ctx, canvas.width, canvas.height, padding, blockStack, colorSecondary);

	let drawFunction = draw(ctx, canvas.width, canvas.height, padding, blockStack, colorPrimary, colorSecondary)
	if (!time)
		setInterval(() => drawFunction, time);
	else
		drawFunction;

	return canvas;
}