import { readdirSync, lstatSync } from 'fs';
import dirname from 'es-dirname';

let mods  = [];
let array = readdirSync(dirname()).filter(item =>
	lstatSync(dirname() + '/' + item).isDirectory()
);

for (let i = 0; i < array.length; i++) {
	let path = dirname() + '/' + array[i];
	mods[i]  = [ array[i] ];

	if (readdirSync(path).includes('alias.json'))
		if (Array.isArray(temprequire))
			for (let item of import(`${path}/alias.json`))
				mods[i].push(item)
		else
			mods[i].push(import(`${path}/alias.json`));
};

export default mods;