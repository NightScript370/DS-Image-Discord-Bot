module.exports = function(app, client) {
  app.get("/", (request, response) => {
    response.render("pages/index");
  });
  
  app.get("/leaderboard", (request, response) => {
    response.render("pages/leaderboard", { url: request.originalUrl, id: undefined });
  })
  
  app.get("/leaderboard/:guildID", (request, response) => {
    let id = request.params.guildID;
    if (!id || !client.guilds.has(id)) return response.status(404).render("pages/404");
    response.render("pages/leaderboard", { id });
  });
  
  app.get("/queue/:guildID", (request, response) => {
    let id = request.params.guildID;
    if (!id || !client.guilds.has(id)) return response.status(404).render("pages/404");
    response.render("pages/queue", { id });
  });
  
  app.get("/commands", (request, response) => {
    response.render("pages/commands");
  });

  app.get("/support", (request, response) => {
    response.render("pages/support");
  });
  
  //The 404 Route (ALWAYS keep this as the last route)
  /* app.get('*', function(req, res) {
    res.status(404).render('pages/404')
  }); */
  
  /* ==== oauth stuff ==== */
  
}