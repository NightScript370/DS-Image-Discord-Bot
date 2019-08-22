// ***************
// **** IMAGE ****
// ***************

const validateAttachment = (attachment) => {
	if (!attachment) return false;
	if (!attachment.height || !attachment.width) return false;
	if (attachment.size > 8e+6) return false;
	if (!fileTypeRe.test(attachment.name)) return false;

	return attachment.url;
}

const githubRaw = (url) => {
	var [https, n, domain, owner, project, blob, branch, ...position] = url.split("/");
	return `https://raw.githubusercontent.com/${owner}/${project}/${branch}/${position.join("/")}`;
}

const imageType = async (message, argument, attachmentcheck, historycheck) => {
	const fileTypeRe = /\.(jpe?g|png|gif|bmp)$/i;
	const base64 = /data:image\/(jpe?g|png|gif|bmp);base64,([^\"]*)/;

	if (message.attachments.size && attachmentcheck) {
		let attachmentListing = Array.from(message.attachments.values);
		let cleanAttachments;

		for (var attachment of attachmentListing) {
			if (validateAttachment(attachment))
				cleanAttachments.push(attachment.url);
		}

		return cleanAttachments;
	}

	if (isGood(argument)) {
		let user = await akairo_types['user-commando'](message, argument);

		let splitArgs = argument.split(' ');
		let testedArgs = [];

		for (var splitArg of splitArgs) {
			if (!fileTypeRe.test(splitArg.split(/[#?]/gmi)[0]))
				continue;

			if (splitArg.startsWith('https://github.com')
			 || splitArg.startsWith('https://www.github.com')
			 || splitArg.startsWith('http://github.com')
			 || splitArg.startsWith('http://www.github.com')) {

				// Convert GitHub URL to raw type
				splitArg
					.replace('http://www.github.com', 'https://github.com')
					.replace('https://www.github.com', 'https://github.com')

				testedArgs.push(githubRaw(splitArg))
				break;
			}

			testedArgs.push(splitArg);
		}

		if (isGood(testedArgs)) {
			return testedArgs;
		} else if (user && isGood(user.displayAvatarURL({format: 'png'}))) {
			return [ user.displayAvatarURL({ format: 'png', size: 512 }) ];
		}
	}

	if (historycheck) {
		// Check previous messages
		const channel = message.channel;
		let msgs = await channel.messages.fetch({ limit: 100 });
		let att = undefined;
		let attachments = List.fromArray(msgs.array()).filter(msg => !!msg.attachments && !!msg.attachments.first()).reverse().forEach(msg => {
			att = validateAttachment(msg.attachments.first());
		});
		if (!att) return null;
		return [ att ];
	}

	return null
}

// *******************************
// ********* USER SEARCH *********
// *******************************

const userSearch = (message, term) => {
	if (message.guild) {
		let members = message.guild.members.filter(userFilter(false, term, true));
		if (members.size) {
			const exactMembers = members.filter(userFilter(true, term, true));

			if (exactMembers.size > 0)
				members = exactMembers;

			let guildMember = members.first();
			return guildMember.user;
		}
	}

	let users = message.client.users.filter(userFilterInexact(term));
	if (!users.size)
		return null;

	const exactUsers = users.filter(userFilterExact(term));

	if (exactUsers.size > 0)
		users = exactUsers;

	return users.first();
}

const userFilter = (exact, search, guild) => {
	if (guild) {
		if (exact)
			return member => member.displayName.toLowerCase() === search || member.user.username.toLowerCase() === search || member.user.tag.toLowerCase() === search;
		else
			return member => member.displayName.toLowerCase().includes(search) || member.user.username.toLowerCase().includes(search) || member.user.tag.toLowerCase().includes(search);
	} else {
		if (exact)
			return user => user.username.toLowerCase() === search || user.tag.toLowerCase() === search;
		else
			return user => user.username.toLowerCase().includes(search) || user.tag.toLowerCase().includes(search);
	}
}


const isGood = (variable) => {
	if (variable && variable !== null && (variable.size || variable.length)) return true;
		return false;
}



const akairo_types = {
	'question': (message, phrase) => {
		if (!phrase || (phrase && !phrase.endsWith('?'))) return null;
		return phrase;
	},
	'text-fun': async (message, phrase) => {
		if (phrase) return phrase;

		let msgs = await message.channel.messages.fetch({ limit: 100 });
		let msgArr = msgs.array().sort((a, b) => a.createdAt - b.createdAt);

		let target = null;
		// Get the latest one that has text
		for (let i = 99; i >= 0; i--) {
			let msg = msgArr[i];
			if (message == msg) continue;
			if (msg && isGood(msg.cleanContent)) {
				target = msg;
				break;
			}
		}

		if (target)
			return target.cleanContent;

		return null;
	},
	'user-commando': async (message, user) => {
		if (!user) return null;

		const matches = user.match(/^(?:<@!?)?(\d{17,19})>?$/);
		if (matches) {
			let fetchedUser = await message.client.users.fetch(matches[1])
				.catch();

			if (fetchedUser)
				return fetchedUser;
		}

		if (userSearch(message, user.toLowerCase()))
			return userSearch(message, user.toLowerCase());

		let userFound = null;
		let tmp_user = user.split(" ")
		while (!userFound && tmp_user.length > 1) {
			tmp_user.pop()
			userFound = userSearch(message, tmp_user.join(" ").toLowerCase());
		}

		return userFound;
	},
	'externalIP': (message, address) => {
		if (!address)
			return null;

		if (!/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(address))
			return null;

		if (address.split(':')[0] == '127.0.0.1')
			return null;

		return address;
	},
	'image': async (message, argument) => await imageType(message, argument, true, true),
	'image-nohistory': async (message, argument) => await imageType(message, argument, true, false),
	'image-noattachment': async (message, argument) => await imageType(message, argument, false, true),
	'image-nohistoryattachment': async (message, argument) => await imageType(message, argument, false, true)
}

module.exports = akairo_types;
