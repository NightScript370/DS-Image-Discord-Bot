const { Listener } = require('discord-akairo');
const request = require('node-superfetch');

const config = require("../../config.js");
const DBL = require("dblapi.js");

module.exports = class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
            category: 'botHandler'
        });
    }

    async exec() {
        const wait = require('util').promisify(setTimeout);
        await wait(5000);

		console.log(`My body, ${this.client.user.username} is ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers at ${this.client.URL}!`);
		this.client.user.setStatus('online');
        this.client.util.setDefaultStatus(this.client);

        this.client.website = require("../../views/website.js")(this.client);
        this.client.dbl = new DBL(config.DBLtoken, { webhookPort: this.client.website.express.get('port'), webhookAuth: config.DBLPass, webhookServer: this.client.website.server, statsInterval: 7200000 }, this.client);

        this.client.listenerHandler.register(this.client.dbl, '../dbl')
        this.client.listenerHandler.register(this.client.dbl.vote, '../dbl')
        this.client.listenerHandler.loadAll();

        const fs = require("fs");
        try {
            const { id: rebootMsgID, channel: rebootMsgChan, cmd, lang } = require('../../reboot.json');
            const m = await this.client.channels.get(rebootMsgChan).messages.fetch(rebootMsgID);
            await m.edit(`Done rebooting; it took ${((Date.now() - m.createdTimestamp) / 1000).toFixed(1)}s`);
            fs.unlink('./reboot.json', ()=>{});
        } catch(O_o) {
            
        }

        const { getKey } = require("./../../Configuration"); 
        this.client.db.serverconfig.get = getKey; // Short-hand declare a variable to be an existing function

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
                    .send({
                        server_count: this.client.guilds.size
                    });

                console.log('[discord.boats] stats updated');
            } catch(O_o) {
                console.error(O_o);
            }
        }
	}
};