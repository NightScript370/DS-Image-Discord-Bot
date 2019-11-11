import { readdirSync, lstatSync } from 'fs';

let mods  = [];
let array = readdirSync(__dirname).filter(item =>
	lstatSync(__dirname + '/' + item).isDirectory()
);

// So, once you get the general idea of how to do it, please take a look at the old dshomebrew command.
// Those last three are ones I don't have time to do
// I'll do them. Thank you
// so you need me to do nds-bootstrap, rocketvideoplayer and twilightmenu++?
// yes. Why did you change ds to dsi? DS is the main thing.

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

export default mods;