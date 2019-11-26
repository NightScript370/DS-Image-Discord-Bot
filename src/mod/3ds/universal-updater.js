import { MessageEmbed } from 'discord.js'

let socialLinks = [
	"[Github Repository](https://github.com/Universal-Team/Universal-Updater)",
	"[Discord Server](https://discord.gg/KDJCfGF)"
]

export const alias = ['Universal-Updater', 'universal-updater', 'U-U', 'UU'];
export const message = "**Universal-Updater** is a 3DS homebrew that allows easy installation and updating of other 3DS homebrew!"
export const embed = new MessageEmbed()
	.setColor("GREEN")
	.setThumbnail('https://cdn.discordapp.com/attachments/589882205556310076/639500871176028180/image0.png')
	.addField('Social Links', socialLinks.map(feature => `• ${feature}`).join("\n"))
	.setImage('https://cdn.discordapp.com/attachments/589882205556310076/642613818781990922/MainMenu.png')
	.setFooter('Made by Universal-Team (Mainly by VoltZ)');