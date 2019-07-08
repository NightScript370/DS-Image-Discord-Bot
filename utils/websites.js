const client = require("../yamamura.js")

module.exports = {
  makerboard_args: [
    {
		  id: 'name',
		  type: 'string',
		  default: 'mine'
    },
    {
		  id: 'makerBoardToPick',
      match: 'option',
      type: 'string',
		  flag: ['makerBoardURL:', 'url:', 'makerboard:', 'website:'],
		  default: msg => {
        if (!msg.guild) return null;
        let serverconfig = client.db.serverconfig.findOne({guildID: msg.guild.id}) || client.setDefaultSettings(msg, client);
        return serverconfig.makerboard.value;
      }
    }
  ]
}