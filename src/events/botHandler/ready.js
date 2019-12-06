import discordAkairo from 'discord-akairo';
import post from 'node-superfetch';

import botLists from "../../config";
import * as catSetup from "../../utils/commandCategories";

import * as ListenerLoadModule from "../commandHandler/load"
import * as WebsiteModule from "../../website/index"

export class ReadyListener extends discordAkairo.Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'botHandler',
			type: 'once'
		});
	}

	async exec() {
		const wait = import('util').promisify(setTimeout);
		await wait(6000);

		this.client.listenerHandler.setEmitters({
			commandHandler: this.client.commandHandler,
			listenerHandler: this.client.listenerHandler
		});

		this.client.listenerHandler.load(ListenerLoadModule);
		this.client.commandHandler.loadAll();
		this.client.commandHandler.categories = catSetup(this.client.commandHandler.categories);

		this.client.user.setStatus('online');
		this.client.util.setDefaultStatus(this.client);

		try {
			this.client.website = WebsiteModule(this.client);
			this.client.listenerHandler.setEmitters({httpServer: this.client.website.server});
		} catch (e) {
			console.error('[WEBSITE] Failed to load: ' + e);
		}

		await this.client.listenerHandler.remove('ready');
		await this.client.listenerHandler.remove('commandHandlerLoad');
		await this.client.listenerHandler.loadAll();

		console.log(`My body, ${this.client.user.username} is ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers!`);

		const fs = import("fs");
		try {
			const { id: rebootMsgID, channel: rebootMsgChan } = import('../../reboot.json');
			const m = await this.client.channels.get(rebootMsgChan).messages.fetch(rebootMsgID);
			await m.edit(`Done rebooting; it took ${((Date.now() - m.createdTimestamp) / 1000).toFixed(1)}s`);
			fs.unlink('./reboot.json', ()=>{});
		} catch(O_o) {
			
		}

		if (botLists['discordbotlist.com']) {
			try {
				console.log('[discordbotlist.com] Updating stats');

				await post(`https://discordbotlist.com/api/bots/${this.client.user.id}/stats`)
					.set("Authorization", `Bot ${botLists['discordbotlist.com'].token}`)
					.send({
						shard_id: 0,
						guilds: this.client.guilds.size,
						users: this.client.users.size,
						voice_connections: this.client.voice.connections.size
					});

				console.log('[discordbotlist.com] stats updated');
			} catch(O_o) {
				console.error(O_o);
			}
		}
	}
};