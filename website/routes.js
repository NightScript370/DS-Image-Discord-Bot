const passport = require("passport");

module.exports = (app, client) => app
  .get("/", (request, response) => response.render("index"))
  .get("/login", passport.authenticate("discord", { failureRedirect: "/" }), (request, response) => response.redirect("/profile"))
  .get("/logout", async (request, response) => {
    await req.logout();
    await res.redirect("/");
  })
  .get("/leaderboard", (request, response) => response.render("leaderboard", { url: request.originalUrl, id: undefined }))
  .get("/leaderboard/:guildID", (request, response) => {
    let id = request.params.guildID;

    if (!id || !client.guilds.has(id))
      return response.redirect("/leaderboard");

    response.render("leaderboard", { id });
  })
  .get("/queue/:guildID", (request, response) => {
    let id = request.params.guildID;
    if (!id || !client.guilds.has(id)) return response.status(404).render("pages/404");
    response.render("queue", { id });
  })
  .get("/commands", (request, response) => response.render("commands"))
  .get("/support", (request, response) => response.render("support"))
  .get('*', (request, response) => response.redirect("/"));
