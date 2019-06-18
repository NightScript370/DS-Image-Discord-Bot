const { Listener } = require('discord-akairo');

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
    wait(5000);

		console.log(`My body is ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers!`);

    const fs = require("fs");
    try {
      const { id: rebootMsgID, channel: rebootMsgChan, cmd, lang } = require('../../reboot.json');
      const m = await this.client.channels.get(rebootMsgChan).messages.fetch(rebootMsgID);
      await m.edit(`Done rebooting; it took ${((Date.now() - m.createdTimestamp) / 1000).toFixed(1)}s`);
      fs.unlink('./reboot.json', ()=>{});
    } catch(O_o) {
      // console.log(O_o)
    }

    const { getKey } = require("./../../Configuration"); 
    this.client.db.serverconfig.get = getKey; // Short-hand declare a variable to be an existing function

    try {
      if (this.dbl)
        this.dbl.postStats(this.client.guilds.size);
    } catch(O_o) {
      
    }

    const request = require('node-superfetch');
    try {
      console.log('Updating discordbotlist.com stats')

      await request
        .post(`https://discordbotlist.com/api/bots/${this.client.user.id}/stats`)
        .set("Authorization", `Bot ${process.env.DBLORGTOKEN}`)
        .send({
            shard_id: 0,
            guilds: this.client.guilds.size,
            users: this.client.users.size,
            voice_connections: this.client.voice.connections.size
        })

      console.log('Updated discordbotlist.com stats')
    } catch(O_o) {
      console.error(O_o)
    }
	}
}