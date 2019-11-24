global.pathDirectory = __dirname;

console.backlogs = {
	debug: [],
	errors: [],
	others: []
};

// This is used to debug the errors.
const util = require('util');
const maxLog = 20;

console.log = function () {
	let logged = util.format.apply(null, arguments);

	console.backlogs.others.push(logged);
	process.stdout.write(logged + '\n');

	if (console.backlogs.others.length > maxLog)
		console.backlogs.others.shift();
}
console.error = function () {
	let logged = util.format.apply(null, arguments);

	console.backlogs.errors.push(logged);
	process.stderr.write(logged + '\n');

	if (console.backlogs.errors.length > maxLog)
		console.backlogs.errors.shift();
}


try { import('cache-require-paths') } catch {}
import("./utils/extraFunctions.js");

import * as translateModule from './langs/framework';
global.translate = translateModule;

import Client from './struct/Client';
import { token } from "./config";
import * as List from "list-array";

import("./struct/User");
import("./struct/Guild");
import("./struct/DMChannel");
import("./struct/TextChannel");
import("./struct/GuildMember");

const client = new Client();
client.login(token);

global.List = List;
export default client;
