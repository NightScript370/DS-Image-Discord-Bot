import { MessageEmbed } from 'discord.js'

let features = [
	"Run Nintendo DS game backups without requiring a physical cartridge",
	"Load multiple backups of Nintendo DS games without having to carry around a bunch of cartridges",
	"Modify your Nintendo DS game using Cheat Codes",
	"Install Custom FirmWare on your 3DS using NTRBoot Hax"
]

export const message = "Nintendo DS Flashcard guide: https://ds-homebrew.github.io/flashcard\n"
	+ "This guide links to most flashcard kernals that are made for the Nintendo DS. You can also view its compatibility status for the Nintendo DSi and the Nintendo 3DS"
export const embed = new MessageEmbed()
	.setColor(16767232)
	.addField('Advantages to using a Flashcard', features.map(feature => `- ${feature}`).join("\n"))
	.setFooter('Guide by NightScript', 'https://cdn.discordapp.com/avatars/178261738364338177/cf26b18ccdf91e6fdfb0720d8402ba36.png?size=2048');