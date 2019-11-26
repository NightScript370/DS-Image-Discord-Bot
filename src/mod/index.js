const readdirSync, lstatSync  = require('fs')

let mods  = [];
let array = readdirSync(__dirname).filter(item =>
	lstatSync(__dirname + '/' + item).isDirectory()
);

for (let i = 0; i < array.length; i++) {
	let path = __dirname + '/' + array[i];
	mods[i]  = [ array[i] ];

	if (readdirSync(path).includes('alias.json'))
		if (Array.isArray(temprequire))
			for (let item of require(`${path}/alias.json`))
				mods[i].push(item)
		else
			mods[i].push(require(`${path}/alias.json`));
};

module.exports = mods;