const { Listener } = require('discord-akairo');
const request = require('node-superfetch');

const config = require("../../config.js");

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
		await wait(8000);

		this.client.db.serverconfig.get = require("../../Configuration").getKey; // Short-hand declare a variable to be an existing function

		this.client.listenerHandler.setEmitters({
			commandHandler: this.client.commandHandler,
			listenerHandler: this.client.listenerHandler
		});

		this.client.listenerHandler.load(process.cwd() +'/events/commandHandler/load.js');
		this.client.commandHandler.loadAll();

		this.client.user.setStatus('online');
		this.client.util.setDefaultStatus(this.client);

		try {
			this.client.website = await require("../../website/index.js")(this.client);
			this.client.listenerHandler.setEmitters({httpServer: this.client.website.server});
		} catch (e) {
			console.error('[WEBSITE] Failed to load: ' + e);
		}

		if (config.dbl) {
			try {
				const DBL = require("dblapi.js");
				this.client.dbl = await new DBL(config.DBLtoken, { webhookPort: this.client.website.express.get('port'), webhookAuth: config.DBLPass, webhookServer: this.client.website.server, statsInterval: 7200000 }, this.client);

				if (this.client.dbl) {
					if (isEventEmitter(this.client.dbl))
						this.client.listenerHandler.setEmitters({dbl: this.client.dbl});

					if (this.client.dbl.webhook && isEventEmitter(this.client.dbl.webhook))
						this.client.listenerHandler.setEmitters({dblwebhook: this.client.dbl.webhook});
				}
			} catch (e) {
				console.error('[DiscordBots.org] Failed to load: ' + e)
			}
		}

		this.client.listenerHandler.remove('ready');
		this.client.listenerHandler.remove('load');
		this.client.listenerHandler.loadAll();

		console.log(`My body, ${this.client.user.username} is ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers!`);

		const fs = require("fs");
		try {
			const { id: rebootMsgID, channel: rebootMsgChan, cmd, lang } = require('../../reboot.json');
			const m = await this.client.channels.get(rebootMsgChan).messages.fetch(rebootMsgID);
			await m.edit(`Done rebooting; it took ${((Date.now() - m.createdTimestamp) / 1000).toFixed(1)}s`);
			fs.unlink('./reboot.json', ()=>{});
		} catch(O_o) {
			
		}

		if (process.env.DBLORGTOKEN) {
			try {
				console.log('[discordbotlist.com] Updating stats');

				await request
					.post(`https://discordbotlist.com/api/bots/${this.client.user.id}/stats`)
					.set("Authorization", `Bot ${process.env.DBLORGTOKEN}`)
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

		if (process.env.DBOATPASS) {
			try {
				console.log('[discord.boats] Updating stats');

				await request
					.post(`https://discord.boats/api/v2/bot/${this.client.user.id}`)
					.set("Authorization", process.env.DBOATPASS)
					.send({server_count: this.client.guilds.size});

				console.log('[discord.boats] stats updated');
			} catch(O_o) {
				console.error(O_o);
			}
		}
	}
};

function isEventEmitter(value) {
	return value
	&& typeof value.on === 'function'
	&& typeof value.emit === 'function';
}