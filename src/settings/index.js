const fs = require('fs');
const path = require("path");

let settingProps = {}
let types = [];

let propertyFileNames = fs.readdirSync(path.join(__dirname, 'properties'))
for (var propertyFileName of propertyFileNames) {
	settingProps[propertyFileName.replaceAll('.js', '')] = require(path.join(__dirname, 'properties', propertyFileName))
}

let typesFileNames = fs.readdirSync(path.join(__dirname, 'properties'))
for (var typeFileName of typesFileNames) {
	types.push(require(path.join(__dirname, 'properties', typeFileName)));
}

function findType(key) {
	return types.filter(type => type.id == settingProps[key].type)[0];
}

function getKey(client, msg, key) {
	let data = require("../utils/database.js").serverconfig.findOne({guildID: msg.guild.id});

	let value = data[key];
	return findType(key).deserialize(client, msg, value);
}

module.exports = {
	types, findType, getKey, settingProps
};