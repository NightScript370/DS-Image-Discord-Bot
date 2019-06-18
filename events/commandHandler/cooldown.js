const { Listener } = require('discord-akairo');

module.exports = class CooldownListener extends Listener {
  constructor() {
    super('cooldown', {
      emitter: 'commandHandler',
      event: 'cooldown',
      category: 'commandHandler'
    });
  }

  exec(message, command, time) {
    const remaining = time / 1000;

    let placeused = 'DM';
    if (message.guild)
      placeused = message.guild.name

    console.log(`${message.author.username} (#${message.author.id}) was blocked from using ${command.id} in ${placeused} because of cooldown!`);

    if (message.guild ? message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES') : true) 
      message.reply("we're sorry, but may not use the " + command.id + " command for another " + remaining + " seconds.")
  }
}