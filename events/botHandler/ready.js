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
    await wait(5000);

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

    const { getKey } = require("../../Configuration"); 
    this.client.db.serverconfig.get = getKey; // Short-hand declare a variable to be an existing function

    this.client.website = await require("../../views/website.js")(this.client)
	}
}