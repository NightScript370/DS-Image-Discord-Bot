import { readdirSync } from 'fs';
import { join, resolve } from "path";
import databaseModule from '../utils/database.js';

let settingProps = {}
let types = [];

let propertyFileNames = readdirSync(join(resolve(), 'properties'))
for (var propertyFileName of propertyFileNames) {
	settingProps[propertyFileName.split('.').slice(0, -1).join('.')] = import(join(resolve(), 'properties', propertyFileName))
}

let typesFileNames = readdirSync(join(resolve(), 'properties'))
for (var typeFileName of typesFileNames) {
	types.push(require(join(resolve(), 'properties', typeFileName)));
}

export const findType = (key) => types.filter(type => type.id == settingProps[key].type)[0];
export const getKey = (client, msg, key) => {
	let data = databaseModule.serverconfig.findOne({guildID: msg.guild.id});

	let value = data[key];
	return findType(key).deserialize(client, msg, value);
}

export default {
	types, findType, getKey, settingProps
};