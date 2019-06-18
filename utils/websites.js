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
        let serverconfig = this.client.db.serverconfig.findOne({guildID: msg.guild.id}) || this.client.setDefaultSettings(msg, this.client);
        return serverconfig.makerboard.value;
      }
    }
  ]
}