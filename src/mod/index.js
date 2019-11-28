import { readdirSync, lstatSync } from 'fs';

let mods  = [];
let array = readdirSync(resolve()).filter(item =>
	lstatSync(resolve() + '/' + item).isDirectory()
);

for (let i = 0; i < array.length; i++) {
	let path = resolve() + '/' + array[i];
	mods[i]  = [ array[i] ];

	if (readdirSync(path).includes('alias.json'))
		if (Array.isArray(temprequire))
			for (let item of require(`${path}/alias.json`))
				mods[i].push(item)
		else
			mods[i].push(require(`${path}/alias.json`));
};

export default mods;