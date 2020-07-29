const { Listener } = require('discord-akairo');
const request = require('node-superfetch');

const config = require("../../config.js");
const catSetup = require("../../utils/commandCategories.js");

module.exports = class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'botHandler',
			type: 'once'
		});
	}

	async exec() {
		const wait = require('util').promisify(setTimeout);
		await wait(6000);

		this.client.listenerHandler.setEmitters({
			commandHandler: this.client.commandHandler,
			listenerHandler: this.client.listenerHandler
		});

		this.client.listenerHandler.load(process.cwd() +'/events/commandHandler/load.js');
		this.client.commandHandler.loadAll();
		this.client.commandHandler.categories = catSetup(this.client.commandHandler.categories);

		this.client.user.setStatus('online');
		this.client.util.setDefaultStatus(this.client);

		await this.client.listenerHandler.remove('ready');
		await this.client.listenerHandler.remove('commandHandlerLoad');
		await this.client.listenerHandler.loadAll();

		console.log(`My body, ${this.client.user.username} is ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers!`);

		const fs = require("fs");
		try {
			const { id: rebootMsgID, channel: rebootMsgChan, cmd, lang } = require('../../reboot.json');
			const m = await this.client.channels.get(rebootMsgChan).messages.fetch(rebootMsgID);
			await m.edit(`Done rebooting; it took ${((Date.now() - m.createdTimestamp) / 1000).toFixed(1)}s`);
			fs.unlink('./reboot.json', ()=>{});
		} catch(O_o) {
			
		}
	}
};