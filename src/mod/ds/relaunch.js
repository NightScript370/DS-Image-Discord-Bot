const MessageEmbed = require('discord.js')

let socialLinks = [
	"[Github Repository](https://github.com/Universal-Team/Relaunch)",
	"[Discord Server](https://discord.gg/KDJCfGF)"
]

export const alias = ['relaunch', 'buttonboot', 'button boot', 'button-boot'];
export const message = "**Relaunch** is a Nintendo DS(i) homebrew that allows the ability to launch an `.nds` file depending on which button you have pressed, similar to NoCash's Unlaunch."
export const embed = new MessageEmbed()
	.setColor("GREEN")
	.setThumbnail('https://media.discordapp.net/attachments/283770736215195648/607029361052352620/thing.png')
	.addField('Social Links', socialLinks.map(feature => `• ${feature}`).join("\n"))
	.setImage('https://media.discordapp.net/attachments/590552111289466890/602310646901768233/2019-07-20_20.25.46.png')
	.setFooter('Made by Universal Team (Mainly by Flame)');