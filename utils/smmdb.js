const API_BASE = 'https://smmdb.ddns.net/api/';

let fs = require('fs');
let request = require('request').defaults({ encoding: null });
let querystring = require('querystring');

const { promisify } = require("util");
const promiseRequest = promisify(request);

module.exports = class SMMDB {
    constructor(api_key) {
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
        return this.getBody({ url: API_BASE + 'getstats', json: true }, callback);
    }

    searchCourses (args, callback=null) {
		let query = querystring.stringify(args);
		return this.getBody({ url: API_BASE + 'getcourses?' + query, json: true }, callback);
	}

    downloadCourse (courseId, target, callback) {
		var req = request({
			method: 'GET',
			uri: API_BASE + 'downloadcourse?id=' + courseId + '&type=zip'
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

		let object = {
			method: 'POST',
			url: API_BASE + 'uploadcourse',
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