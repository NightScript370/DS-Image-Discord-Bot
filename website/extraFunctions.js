exports.isAuth = async (req, res, next) => req.isAuthenticated() ? next() : res.redirect("/profile/login");
exports.parameters = (req) => {
	return {
		profile: (req.isAuthenticated() ? "/profile" : "/login")
	}
}