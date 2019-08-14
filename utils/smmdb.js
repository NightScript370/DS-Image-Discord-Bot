let fs = require('fs');
let request = require('request').defaults({ encoding: null });
let querystring = require('querystring');

const { promisify } = require("util");
const promiseRequest = promisify(request);

module.exports = class SMMDB {
    constructor(api_key) {
		this.url = 'https://smmdb.ddns.net/api/';
        this.apiKey = api_key;
        this.getBody = async (object, callback=null) => {
            if (callback) {
		        await request(object, (error, response, body) => {
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
    }

	getStats (callback=null) {
		let APIURL = this.url;
		APIURL += 'getStats';
		return this.getBody({ url: APIURL, json: true }, callback);
	}

	searchCourses (version, args, callback=null) {
		if (version !== "smm" && version !== "smm64") {
			if (callback)
				return callback('Not a valid version');
			else
				return 'Not a valid version';
		}

		let APIURL = this.url;
		APIURL += version == "smm64" ? 'getcourses64?' : 'getcourses?';
		APIURL += querystring.stringify(args);

		return this.getBody({ url: APIURL, json: true }, callback);
	}

	downloadCourse (courseId, target, callback, type) {
		if (type !== '3ds' && type !== 'wiiu' && type !== 'smm64') {
			return callback('Not a valid type');
		}

		let APIURL = this.url;
		APIURL += type == 'smm64' ? 'downloadcourse64?id=' : 'downloadcourse?id=';
		APIURL += courseId;
		APIURL += '&type=';

		switch (type) {
			case 'smm64':
			case 'wiiu':
				APIURL += 'zip';
			case '3ds':
				APIURL += '3ds';
		}

		var req = request({
			method: 'GET',
			uri: APIURL
		});

		var out = fs.createWriteStream(target + '/smm-course-' + courseId + '.zip');
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
				return 'No API key provided';
		}

		let APIURL = this.url;
		APIURL += 'uploadcourse';

		let object = {
			method: 'POST',
			url: APIURL,
			useElectronNet: false,
			body: buffer,
			headers: {
				'Authorization': 'APIKEY ' + this.apiKey,
				'Content-Type': 'application/octet-stream'
			},
			json: true
		};

		return this.getBody(object, callback);
	}

	toggleStar (courseId, callback=null) {
		if (!this.apiKey || this.apiKey && this.apiKey.trim() == '') {
			if (callback)
				return callback('No API key provided');
			else
				return 'No API key provided';
		}

		let object = {
			method: 'POST',
			url: API_BASE + 'starcourse?id=' + courseId,
			useElectronNet: false,
			headers: {
				'Authorization': 'APIKEY ' + this.apiKey
			},
			json: true
		};

		return this.getBody(object, callback);
	}
}