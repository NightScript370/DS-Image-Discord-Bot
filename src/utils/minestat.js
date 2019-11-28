// For use with Node.js

import { connect } from 'net';

const NUM_FIELDS = 6;      // number of values expected from server
const DEFAULT_TIMEOUT = 5; // default TCP timeout in seconds

export default (address, port, timeout=DEFAULT_TIMEOUT) => {
	let information = { address, port };

	const start_time = new Date();
	const client = connect(port, address);

	client.setTimeout(timeout * 1000);

	client
		.on('connection', () => {
			information.latency = Math.round(new Date() - start_time);
			let buff = Buffer.from([ 0xFE, 0x01 ]);
			client.write(buff);
		})
		.on('data', (data) => {
			if(data != null && data != '') {
				let server_info = data.toString().split("\x00\x00\x00");
				if (server_info != null && server_info.length >= NUM_FIELDS) {
					information.online = true;
					information.version = server_info[2].replace(/\u0000/g,'');
					information.motd = server_info[3].replace(/\u0000/g,'');
					information.current_players = server_info[4].replace(/\u0000/g,'');
					information.max_players = server_info[5].replace(/\u0000/g,'');
				} else
					information.online = false;
			}

			client.end();
			return information;
		})
		.on('timeout', () => {
			client.end();
			Promise.reject(new Error(`Timeout on ${address} using MineStat-API`))
		})
		.on('error', (err) => Promise.reject(new Error(err)));
};