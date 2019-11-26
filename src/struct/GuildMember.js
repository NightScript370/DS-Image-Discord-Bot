const Structures = require("discord.js")
const points as pointsTable, infractions  = require('../utils/database.js')

function getDateTime(date) {
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min	= date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	var sec	= date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day	= date.getDate();
	day = (day < 10 ? "0" : "") + day;

	return `${year}:${month}:${day}:${hour}:${min}:${sec}`;
}

// This extends Discord's native Member class with our own methods and properties
module.exports = Structures.extend("GuildMember", GuildMember => class extends GuildMember {
	constructor(...args) {
		super(...args)
	}

	get exp() {
		let member = this;
		return {
			points: pointsTable.findOne({guild: member.guild.id, member: member.id}).points || pointsTable.insert({guild: member.guild.id, member: member.id, points: 0, level: 0}).then(row => row.points),
			level: Math.floor(this.points / 350)
		};
	}

	get warns() {
		let member = this;
		return pointsTable.find({guild: member.guild.id, user: member.id});
	}

	set exp(points) {
		let dbdata = pointsTable.findOne({guild: this.guild.id, member: this.id});

		dbdata.points = points;
		dbdata.level = Math.floor(this.points / 350);

		pointsTable.update(dbdata);
		return { points: dbdata.points, level: dbdata.level };
	}

	warn (reason, moderator) {
		let member = this;
		return infractions.insert({
			user: member.user.id, guild: member.guild.id, reason: reason, moderator: moderator.id, time: getDateTime(new Date())
		})
	}
})