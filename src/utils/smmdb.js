import { createWriteStream } from 'fs';
import { stringify } from 'querystring';

const request = import('request').defaults({ encoding: null });
const promiseRequest = import('util').promisify(request);

const URL = 'https://smmdb.ddns.net/api/';
const getBody = async (object, callback=null) => {
	if (callback) {
		request(object, (error, response, body) => {
			if (error) return callback(error);
			if (!response || response.statusCode !== 200) return callback('Invalid response code');
			return callback(null, body);
		});
	} else {
		let { body, statusCode } = await promiseRequest(object);
		if (statusCode !== 200) return 'Invalid response code';
		return body;
	}
}

export default class SMMDB {
    constructor(api_key) {
        this.apiKey = api_key;
    }

	getStats (callback=null) {
		return getBody({ url: URL + 'getStats', json: true }, callback);
	}

	searchCourses (version, args, callback=null) {
		if (version !== "smm" && version !== "smm64") {
			if (callback)
				return callback('Not a valid version');
			else
				return Promise.reject(new Error('Not a valid version'));
		}

		let APIURL = URL;
		APIURL += version == "smm64" ? 'getcourses64?' : 'getcourses?';
		APIURL += stringify(args);

		return getBody({ url: APIURL, json: true }, callback);
	}

	downloadCourse (type, courseId, target, callback) {
		if (type !== '3ds' && type !== 'wiiu' && type !== 'smm64') {
			if (callback)
				return callback('Not a valid type');
			else
				return Promise.reject(new Error('Not a valid type'));
		}

		let APIURL = URL;
		APIURL += type == 'smm64' ? 'downloadcourse64?id=' : 'downloadcourse?id=';
		APIURL += courseId;
		APIURL += '&type=';

		let format;

		switch (type) {
			case 'smm64':
			case 'wiiu':
				format = 'zip';
			case '3ds':
				format = '3ds';
		}

		APIURL += format;
		let req = request({ method: 'GET', uri: APIURL });

		const out = createWriteStream(target + '/smm' + type + '-course-' + courseId + '.' + format);
		req.pipe(out);

		req.on('error', (error) => {
			return callback(error);
		});

		out.on('finish', () => {
			return true;
		});
	}

	uploadCourse (buffer, callback=null) {
		if (!this.apiKey || this.apiKey && this.apiKey.trim() == '') {
			if (callback)
				return callback('No API key provided');
			else
				return Promise.reject(new Error('No API key provided'));
		}

		let object = {
			method: 'POST',
			url: URL + 'uploadcourse',
			useElectronNet: false,
			body: buffer,
			headers: {
				'Authorization': 'APIKEY ' + this.apiKey,
				'Content-Type': 'application/octet-stream'
			},
			json: true
		};

		return getBody(object, callback);
	}

	toggleStar (courseId, callback=null) {
		if (!this.apiKey || this.apiKey && this.apiKey.trim() == '') {
			if (callback)
				return callback('No API key provided');
			else
				return Promise.reject(new Error('No API key provided'));
		}

		let object = {
			method: 'POST',
			url: URL + 'starcourse?id=' + courseId,
			useElectronNet: false,
			headers: {'Authorization': 'APIKEY ' + this.apiKey },
			json: true
		};

		return getBody(object, callback);
	}
}