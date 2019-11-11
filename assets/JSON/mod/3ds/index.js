import { RichEmbed } from 'discord.js'

let features = [
	"Redirect your NAND to the SD card",
	"Run any software compatible, regardless of if Nintendo signed it or if it was made for your region",
	"Run game backups without requiring a physical cartridge",
	"Redirect Software Data to the SD card, used for software modification",
	"Customize your HOME Menu with user-created themes",
	"Experience software the way you'd like it with screenshots and cheat codes",
	"Backup, edit, and restore save data",
	"Play older software using their respective emulator",
	"Stream live gameplay to your PC wirelessly with NTR CFW (requires a New system)"
]

export const message = "Nintendo 3DS Modding guide: https://3ds.cfw.guide\n"
	+ "This guide will install LumaCFW alongside boot9strap, the latest CFW"
export const embed = new RichEmbed()
	.setColor(49151)
	.setThumbnail('https://cdn.bulbagarden.net/upload/0/0f/Nintendo_3DS_Aqua_Blue.png')
	.addField('Advantages to modding a 3DS', features.map(feature => `- ${feature}`).join("\n"))
	.setFooter('Guide by Plailect', 'https://pbs.twimg.com/profile_images/698944593715310592/wTDlD5rA_400x400.png')