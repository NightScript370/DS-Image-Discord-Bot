import { RichEmbed } from 'discord.js'

let features = [
	"Redirect your NAND to the SD card",
	"Use normally uncompatible flashcards",
	"Replace your home menu with TWiLightMenu++, an SD card file manager",
	"Launch any DSiWare (out-of-region & 3DS exclusives) from your SD card (using unlaunch)",
	"Run homebrew applications and applications that aren't signed",
	"Use FreeNAND to transfer configurations, sys, titles and tickets to another Nintenod DSi from a SD NAND"
]

export const message = "Nintendo DSi Modding guide: https://ds-homebrew.github.io/flashcard\n"
	+ "This guide will take you from a regular Nintendo DSi to a modified console by using the Memory Pit exploit."
export const embed = new RichEmbed()
	.setColor(16776918)
	.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/8/8b/Nintendo_dsi.png')
	.addField('Advantages to modding a Nintendo DSi', features.map(feature => `- ${feature}`).join("\n"))
	.setFooter('Guide by RocketRobz');