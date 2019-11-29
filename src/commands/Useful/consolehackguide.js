import discordAkairo from 'discord-akairo';
import * as consoleList from '../../mod/index.js'
import dirname from 'es-dirname';
import readdirSync from 'fs';

export default class moddingGuidesCommand extends discordAkairo.Command {
	constructor() {
		super('mod', {
			aliases: ["mod", "consolemod", 'consolehackguide', 'consolehackingguide', 'consolehackinguide', 'consolemodguide', 'consolemoddingguide', 'consolemodificationguide'],
			category: 'Useful',
			description: {
				content: 'Returns a link to a Hacking Guide.',
				usage: '<console you\'d like to hack> [specific thing. If not specified or is invalid, the main file of the folder will be used]',
				example: ['!mod ds cfw']
			},
			args: [
				{
					id: 'console',
					description: "This parameter is to specify which console you would like to find a hacking guide for. Examples include the 3ds, dsi, flashcard, wii, wiiu or the switch",
					type: consoleList,
					prompt: {
						start: "What would you like to get a hacking of?",
						retry: "There is not a thing we can get a guide for. Try again."
					},
					match: 'content'
				},
				{
					id: 'field2',
					description: "This parameter is for extra ",
					type: "string",
					default: 'index',
					match: 'content'
				}
			]
		});
	}

	async exec(msg, { console, field2 }) {

		let choosen;
		let path = import('path').join(dirname(), '..', '..', 'mod', console);

		if (!field2 || field2 !== "index")
			for (let file of readdirSync(path)) {
				let imported = import(path + file);

				if (imported.alias && (imported.alias.includes(field2))) {
					choosen = imported;
					break;
				} else if (file.substr(0, file.length - 3) == field2) {
					choosen = imported;
					break;
				};
			};

		if (!choosen)
			choosen = import(path + 'index.js');

		if (!choosen.message)
			choosen.message = '';
		if (!choosen.embed)
			choosen.embed = {};

		if (choosen.message == '' && choosen.embed == {})
			throw(new Error(`Module ${console} was empty`))
		return msg.utils.send(choosen.message, choosen.embed);
	}
};