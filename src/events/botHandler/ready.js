const Listener = require('discord-akairo')
import post from 'node-superfetch';

import botLists from "../../config";
const catSetup = require("../../utils/commandCategories")

const ListenerLoadModule = require("../commandHandler/load")
const WebsiteModule = require("../../website/index")

export class ReadyListener extends Listener {
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

		this.client.botlist = {};

		if (botLists['top.gg']) {
			try {
				const TopGG = require("dblapi.js");
				this.client.botlist.TopGG = new TopGG(botLists['top.gg'].token, {
					webhookPort: this.client.website.express.get('port'),
					webhookAuth: botLists['top.gg'].webhookpass,
					webhookServer: this.client.website.server,
					statsInterval: 7200000
				}, this.client)

				this.client.listenerHandler.setEmitters({
					dbl: this.client.botlist.TopGG,
					dblwebhook: this.client.botlist.TopGG.webhook
				});
			} catch (e) {
				console.error('[DiscordBots.org] Failed to load: ' + e)
			}
		}

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

		if (botLists['discord.boats']) {
			try {
				console.log('[discord.boats] Updating stats');

				await post(`https://discord.boats/api/v2/bot/${this.client.user.id}`)
					.set("Authorization", botLists['discord.boats'].token)
					.send({server_count: this.client.guilds.size});

				console.log('[discord.boats] stats updated');
			} catch(O_o) {
				console.error(O_o);
			}
		}
	}
};