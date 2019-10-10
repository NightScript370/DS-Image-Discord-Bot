exports.isAuth = async (req, res, next) => req.isAuthenticated() ? next() : res.redirect("/servers/login");
exports.parameters = (req) => {
	return {
		profile: (req.isAuthenticated() ? "/servers" : "/servers/login")
	}
}