import { readdirSync } from 'fs';
import { join } from "path";
import dirname from 'es-dirname';
import databaseModule from '../utils/database.js';

let settingProps = {}
let types = [];

let propertyFileNames = readdirSync(join(dirname(), 'properties'))
for (var propertyFileName of propertyFileNames) {
	settingProps[propertyFileName.split('.').slice(0, -1).join('.')] = import(join(dirname(), 'properties', propertyFileName))
}

let typesFileNames = readdirSync(join(dirname(), 'properties'))
for (var typeFileName of typesFileNames) {
	types.push(import(join(dirname(), 'properties', typeFileName)));
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