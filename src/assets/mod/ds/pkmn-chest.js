import { MessageEmbed } from 'discord.js'

let socialLinks = [
	"[Github Repository](https://github.com/Universal-Team/pkmn-chest)",
	"[Discord Server](https://discord.gg/KDJCfGF)",
	"[GBAtemp Thread](https://gbatemp.net/threads/release-pkmn-chest-a-pokemon-bank-for-the-nintendo-ds-i.549249/)",
	"[Website](https://universal-team.github.io/pkmn-chest)"
]

export const alias = ['pkmn-chest', 'pkmn chest'];
export const message = "**pkmn-chest** is a Pokémon Bank style app that lets you store and edit Pokémon from the 4th and 5th generation games on your DS(i)."
export const embed = new MessageEmbed()
	.setThumbnail('https://github.com/Universal-Team/pkmn-chest/raw/master/resources/icon.png')
	.setColor("BF0300")
	.addField('Social Links', socialLinks.map(feature => `• ${feature}`).join("\n"))
	.setFooter('Made by Universal Team (Mainly by Pk11)');