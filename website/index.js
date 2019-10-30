const { website: websiteConfig } = require("../config.js");
const List = require("list-array");
const path = require("path");
const fs = require('fs')
const routers = fs.readdirSync(path.join(process.cwd(), 'website', 'router'));

module.exports = (client) => {
	let website = require('fastify')({ logger: true, ignoreTrailingSlash: true })
		.register(require('point-of-view'), {
			engine: {
				ejs: require('ejs')
			},
			templates: 'pages',
			options: {
				filename: path.resolve('pages')
			}
		})
	website.URL = websiteConfig.url;

	website.register(require('fastify-helmet'))
		.then(console.log("[WEBSITE] Helmet loaded"))
		.catch(console.error("[WEBSITE] FAILED TO LOAD HELMET"))

	const handleRoute = (id, routerModule) => (routerModule.callback && id !== "/") ? website.get(routerModule.id, routerModule.callback) : website.get(id, routerModule)

	let routerModule
	for (let router of routers) {
		routerModule = require("./router/" + router)(client);
		handleRoute(router.replace('.js', ''), routerModule)
	}

	routerModule = require("./router/" + websiteConfig.mainPage.replace(".js", '') + '.js')(client)
	handleRoute('/', routerModule);

	website.get('*', (request, response) => response.redirect("/"));

	website.listen(process.env.PORT || 3000, '0.0.0.0')
		.then(address => website.log.info(`[WEBSITE] Server listening on ${address}`))
		.catch(e => website.log.error(`[WEBSITE][ERROR] ${e}`))

	return website
}