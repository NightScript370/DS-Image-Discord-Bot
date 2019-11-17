export function isAuth(req, res, next) { return req.isAuthenticated() ? next() : res.redirect("/servers/login"); }
export function parameters(req) {
	return {
		profile: (req.isAuthenticated() ? "/servers" : "/servers/login")
	}
}