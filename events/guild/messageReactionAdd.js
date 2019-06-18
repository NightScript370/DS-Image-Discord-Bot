const { Listener } = require('discord-akairo');

module.exports = class messageReactionAddListener extends Listener {
	constructor() {
		super('messageReactionAdd', {
			emitter: 'client',
			event: 'messageReactionAdd',
			category: 'guild'
		});
	}

	async exec(reaction, user) {
		const client = await this.client;
		const message = reaction.message;
		const channel = require("./../../Configuration").getKey(client, message, "starboardchannel");

    	if (reaction.message.partial) await reaction.message.fetch();

		if (!message.guild) return;
		if (reaction.count < 3) return;
		if (reaction.emoji.name !== '⭐') return;
		if (message.channel.id == channel.id) return;
		if (message.author.id === user.id || message.author.bot) {
			let errormessage;

			if (message.guild.me.permissions.has('MANAGE_MESSAGES')) {
				reaction.remove(user)
				.catch(function(error) { console.log(error) });
			}

			if (message.guild.me.permissions.has('SEND_MESSAGES') && message.channel.name.includes('test')) {
                if (message.author.id === user.id)  errormessage = await message.channel.send(`${user}, you may not star your own message.`);
                else								errormessage = await message.channel.send(`${user}, you may not star bot messages.`);

				return errormessage.delete({timeout: 5000});
			} else {
				return;
			}
		}

		const image = message.attachments.size > 0 ? isImage(message.attachments.array()[0].url) : '';

		const reacount = await (await reaction.users.fetch()).filter(r => r.id !== message.author.id && !r.bot).size;
		if (reacount < 3) return;

		const starChannel = channel; // message.guild.channels.find("name", "starboard");
		if (starChannel && starChannel.permissionsFor(this.client.user).has('SEND_MESSAGES')) {
			let PostMessage = true;

			const fetchedMessages = starChannel.messages.fetch({ limit: 100 });

			const rdanny = fetchedMessages.find(m => m.cleanContent.endsWith(message.id));
			if(rdanny && message.guild.me.permissions.has('MANAGE_MESSAGES')) {
				rdanny.delete();
			}

			const stars = fetchedMessages.find(m => m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id));
			if (stars) {
				const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
				const foundStar = stars.embeds[0];
				const embed = this.client.util.embed()
					.setColor(foundStar.color)
					.setAuthor(`${message.member.displayName} (#${message.channel.name})`, message.author.displayAvatarURL({format: 'png'}))
					.setThumbnail(message.guild.iconURL({format: 'png'}))
					.setTimestamp(foundStar.timestamp)
					.setFooter(`⭐ ${reacount} | ${message.id}`);

				if(!isEmpty(foundStar.description))	embed.setDescription(foundStar.description);
				if(!isEmpty(image))	embed.setImage(image);

				const starMsg = starChannel.messages.get(stars.id);
				starMsg.edit({ embed });
			} else {
				if (isEmpty(image) && isEmpty(message.content)) return message.channel.send(`${user}, you cannot star an empty message.`);
				const embed = this.client.util.embed()
					.setColor(message.member.displayHexColor)
					.setAuthor(`${message.member.displayName} (#${message.channel.name})`, message.author.displayAvatarURL({format: 'png'}))
					.setThumbnail(message.guild.iconURL({format: 'png'}))
					.setTimestamp(new Date())
					.setFooter(`⭐ ${reacount} | ${message.id}`);

				if(!isEmpty(message.content)) embed.setDescription(message.content);
				if(!isEmpty(image))	embed.setImage(image);

				/* TODO: Check if the bot can send messages in the server */
				starChannel.send({ embed });
			}
		}

        let pointsUser = this.client.db.points.findOne({guild: message.guild.id, member: message.author.id}) || this.client.db.points.insert({guild: message.guild.id, member: message.author.id, points: 0, level: 0});

        if(reacount == 3) {
            //If the reaction count is 3, the user gets 20 points
            pointsUser.points = 20 + user.points;
        } else if (reacount > 3) {
            pointsUser.points = 5 + user.points;
        }

        this.client.db.points.update(pointsUser);
	}
}

// Here we add the this.extension function to check if there's anything attached to the message.
function isImage(attachment) {
	const imageLink = attachment.split('.');
	const typeOfImage = imageLink[imageLink.length - 1];
	const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
	if (!image) return '';
	return attachment;
}

function isEmpty(value) {
	return (value == null || value.length === 0);
}