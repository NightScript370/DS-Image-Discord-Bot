import { uptime, freemem, totalmem, loadavg, cpus as _cpus } from 'os';
import { exec } from 'child_process';

export const platform = process.platform;

export const uptime = {
	system: uptime(),
	process: process.uptime()
}

export const memory = {
	free: freemem() / (1024 * 1024),
	total: totalmem() / (1024 * 1024),
}

// Only Linux
export function freeCommand() { return new Promise((resolve, reject) => {
	exec('free -m', (error, stdout) => {
		if (error) {
			reject(error);
			return;
		}

		const lines = stdout.split('\n');

		const strMemInfo = lines[1].replace(/[\s\n\r]+/g, ' ');

		const memInfo = strMemInfo.split(' ');

		const totalMem = parseFloat(memInfo[1]);
		const freeMem = parseFloat(memInfo[3]);
		const buffersMem = parseFloat(memInfo[5]);
		const cachedMem = parseFloat(memInfo[6]);

		const usedMem = totalMem - (freeMem + buffersMem + cachedMem);

		resolve(usedMem - 2);
	});
}); 	}

// HDD usage
export function harddrive() { return new Promise((resolve, reject) => {
	exec('df -k', (error, stdout) => {
		if (error) {
			reject(error);
			return;
		}

		const lines = stdout.split('\n');

		const strDiskInfo = lines[1].replace(/[\s\n\r]+/g, ' ');

		const diskInfo = strDiskInfo.split(' ');

		const total = Math.ceil((diskInfo[1] * 1024) / (1024 ** 2));
		const used = Math.ceil((diskInfo[2] * 1024) / (1024 ** 2));
		const free = Math.ceil((diskInfo[3] * 1024) / (1024 ** 2));

		resolve({ total, free, used });
	});
}); 	}

// Return running processes
export function getProcesses(nProcess) { return new Promise((resolve, reject) => {
	const nP = nProcess || 0;

	let command = `ps -eo pcpu,pmem,time,args | sort -k 1 -r | head -n${10}`;
	if (nP > 0) {
		command = `ps -eo pcpu,pmem,time,args | sort -k 1 -r | head -n${nP + 1}`;
	}

	exec(command, (error, stdout) => {
		if (error) {
			reject(error);
			return;
		}

		const lines = stdout.split('\n');
		lines.shift();
		lines.pop();

		let result = '';

		lines.forEach((item) => {
			let str = item.replace(/[\s\n\r]+/g, ' ');

			str = str.split(' ');

			result += `${str[1]} ${str[2]} ${str[3]} ${str[4].substring((str[4].length - 25))}\n`; // process
		});

		resolve(result);
	});
}); 	}

// Returns all the load average usage for 1, 5 or 15 minutes.
export function allLoadavg() {
	const loads = loadavg();

	return `${loads[0].toFixed(4)},${loads[1].toFixed(4)},${loads[2].toFixed(4)}`;
}

// Returns the load average usage for 1, 5 or 15 minutes.
export function loadavg(time) {
	if (time === undefined || (time !== 5 && time !== 15))
		time = 1;

	const loads = loadavg();

	let v = 0;
	switch (time) {
		case 1:
			v = loads[0];
			break;
		case 5:
			v = loads[1];
			break;
		case 15:
			v = loads[2]
	}

	return v;
}

function getCPUInfo() {
	const cpus = _cpus();

	let user = 0;
	let nice = 0;
	let sys = 0;
	let idle = 0;
	let irq = 0;

	Object.values(cpus).forEach((cpu) => {
		user += cpu.times.user;
		nice += cpu.times.nice;
		sys += cpu.times.sys;
		irq += cpu.times.irq;
		idle += cpu.times.idle;
	});

	const total = user + nice + sys + idle + irq;

	return {
		idle,
		total,
	};
}

export function cpu() { return new Promise((resolve) => {
	const stats1 = getCPUInfo();
	const startIdle = stats1.idle;
	const startTotal = stats1.total;

	setTimeout(() => {
		const stats2 = getCPUInfo();
		const endIdle = stats2.idle;
		const endTotal = stats2.total;

		const idle = endIdle - startIdle;
		const total = endTotal - startTotal;
		const perc = idle / total;

		resolve({
			free: perc,
			used: 1 - perc,
			count: _cpus().length
		});
	}, 1000);
}); 	}