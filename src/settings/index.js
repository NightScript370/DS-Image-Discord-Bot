import { readdirSync } from 'fs';
import { join } from "path";
import * as databaseModule from '../utils/database.js';

let settingProps = {}
let types = [];

let propertyFileNames = readdirSync(join(__dirname, 'properties'))
for (var propertyFileName of propertyFileNames) {
	settingProps[propertyFileName.replaceAll('.js', '')] = require(join(__dirname, 'properties', propertyFileName))
}

let typesFileNames = readdirSync(join(__dirname, 'properties'))
for (var typeFileName of typesFileNames) {
	types.push(require(join(__dirname, 'properties', typeFileName)));
}

function findType(key) {
	return types.filter(type => type.id == settingProps[key].type)[0];
}

function getKey(client, msg, key) {
	let data = databaseModule.serverconfig.findOne({guildID: msg.guild.id});

	let value = data[key];
	return findType(key).deserialize(client, msg, value);
}

export default {
	types, findType, getKey, settingProps
};