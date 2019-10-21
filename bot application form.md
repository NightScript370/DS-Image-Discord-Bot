Yamamura ID: 421158339129638933
Owner IDs: 178261738364338177, 280399026749440000, 305817665082097665
Discord server Link: vbYZCRZ
Prefix: ! (customizable using the conf command)
Website: https://yamamura.xyz
Invite URL: https://discordapp.com/api/oauth2/authorize?client_id=421158339129638933&scope=bot&permissions=0
Description: Yamamura is an all-in-one bot focused on providing help for modding communities. If you have a modding server, this is the recommended bot to get. It also supports other features which you can find on our website. We hope to see you soon

Multi Lang Tag: Lead by Samplasion, our bot contains multi language support for Polish, Japanese, English, Italian and more to come. Let us know if you want to support Yamamura in your language.
Logging Tag: Currently, Yamamura can log member joins/leave/update, message edits/deletes/pinned and moderation commands performed by Yamamura. In the future, we plan to allow a system where you can log things at different channels.
Utility Tag: From newbies who want to see a list of DS Homebrew, to support specialists who need a link to a guide, Yamamura's got something for everyone in the DS Modding communities (with plans for 3DS once a definitive homebrew list releases)
Games Tag: While Yamamura does not offer multiplayer games you can play with friends, it has a great list of individual games (tictactoe, Hangman, Google Feed searching and Rock Paper Scissors, with Minesweeper coming soon)
Music Tag: Currently a WIP feature, Yamamura can play short bits of music from Youtube without any stuttering. It supports the bare minimum to have a great user experience (Pausing, Stop Audio playback and a Queue list)
Moderation Tag: With a logging system, you can set Yamamura up to help out the server with moderation. Whether its giving a user the muted role (specified in the server config) or banning members, server owners could rely on Yamamura to help them.


Approver notes: For the nds-bootstrap command, we have two types of responses: "That is not a thing we can get information for. Try again." and "The website is not available. Please try again at a different point in time". As we use an API hosted on glitch, we cannot ensure full 24/7 hosting of the API. As such, those two errors can happen on first execution. The nds-bootstrap command takes in Title IDs, not title names. You can get the title ID via Googling the game or using TWiLightMenu++.

To disable level up messages/welcome messages, type !conf set welcomemessage, then type clear, then type Y. Things like this will eventually be moved to the SETUP page of the bot, or the online dashboard when that comes out.






|                                                                                                                                                                                                                                                                        [![Logo](https://yamamura.xyz/logo.png "Yamamura")](https://yamamura.xyz)                                                                                                                                                                                                                                                                                     |
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|![Owner](https://discordbots.org/api/widget/owner/421158339129638933.svg "NightYoshi370 - Yamamura Owner") ![Status](https://discordbots.org/api/widget/status/421158339129638933.svg "Bot Status") ![Upvotes](https://discordbots.org/api/widget/upvotes/421158339129638933.svg "Bot Upvotes") ![Server Count](https://discordbots.org/api/widget/servers/421158339129638933.svg "The amount of servers the bot is in") ![Library](https://discordbots.org/api/widget/lib/421158339129638933.svg "The language the bot is coded in") [![Discord](https://img.shields.io/discord/484464227067887645.svg "Chat")](https://discord.gg/vbYZCRZ)|

Yamamura is an all-in-one Discord bot dedicated to helping modding communities and more     
It can fulfill your server's moderation needs and create fun events for your community to enjoy.

Here are a list of features it can do outside of commands:

- Handle a StarBoard
- Server Experience Points
- Logging Server Events with things that the Discord Audit Logs do not log for you
- A group of Welcome and Leave messages, picked at random
- Listen to audio on Youtube
- A website in which you can access at any time to see all what Yamamura has to offer

That isn't even talking about the commands which you can perform on the bot. There are many to be offered, with some exclusives being:

- Showcase your very own Super Mario Maker (1) course
- Connecting to a makerboard website
- Edit any image you throw at the bot with memes and game covers
- Organize your server moderation, with things such as warning, message prune and message moving
- Get information on Game Servers
- ...and much more!

To check out the commands, either check out our website (which contains other information, found [here](https://yamamura.xyz/)) or use the commands command.

## Server Experience Points

Want to have a way to reward your members for being active? Want to have a way to have a shop of sorts? Yamamura can help you with both.


## Customization

Yamamura allows users to customize the bot in many ways possible. From having custom randomized welcome messages and level up messages to enabling server logging (to be used instead of the audit log), the experience can be tweaked to an administrator's liking. Use the !conf command to change a configuration.

Once we get a dashboard up and running, you can use a website as a replacement, making inputting new configurations much easier. You'd also be able to use a JSON file as a server configuration.

## Nintendo DS Homebrew

So far, our biggest server is the TWL Mode Hacking server. As such, Yamamura has a lot of focus on DS homebrew. Supporting recent advancements (such as running DS titles on your DSi/3DS SD card), you can ensure the bot will be up to date.

- Find the latest kernels for flashcards (to be used on a Nintendo DS Lite/Fat) (!consolemod flashcard)
- Get compatibility for nds-bootstrap, the open source NDS title loader (!ndsbcompat [TITLEID, found in the ROM meta data (use google or twilightmenu++ to access it)])
- Check out a list of useful DS Homebrew (from Pokemon Banks, to a DSi Menu replacement)
- Follow a Guide on how to install the latest HiyaCFW, the only DSi Custom Firmware on the market (!consolemod dsi)



## Bug Reports, Support, Feedback and More

Please join our [Discord Server](https://discord.gg/vbYZCRZ) if you'd like to talk about any of those.

## Your own local instance

If you'd just like to invite the Bot to the server, just use the invite found on the website.
In order to have your own Yamamura, you will need to have a server that can run node.js. Then clone this git repository, run npm init and then run yamamura.js

## Helping out

Do you want to help make Yamamura the best bot possible?!
If so, here's how you can help us out:

- Find a bug? Report it! Our developers will take care of it as soon as possible.
- Spread the word! The more servers the bot is in, there will be more people to experience the bot.
- Join our [Discord Server](https://discord.gg/vbYZCRZ)! You can express your opinion about the bot there as well as partake in development.
- Let us know what you think of the bot, and what we should add or change! We take your opinion seriously.
- Upvote the bot on [discordbotlist.com](https://discordbotlist.com/bots/421158339129638933), [discordbots.org](https://discordbots.org/bot/421158339129638933) & [discord.boats](https://discord.boats/bot/421158339129638933).
- If you're a programmer, you can help out with Yamamura development sending pull requests on our [GitLab repository](https://gitlab.com/Samplasion/yamamura-discord-bot). We're currently looking for help in regards to code cleaning and adding highly requested and complex features. We use Node.JS as the language backend alongside Discord.JS with Discord-Akairo.
- Help [JeDaYoshi#7942](https://jedayoshi.com) pay for a server by donating to his [PayPal](https://paypal.me/Naydire). Currently, Yamamura is running on a VPS he's borrowing, but by donating, you can help maintain the server and buy a better one.
- Documentation is quite sparse at the moment. We need you to help fill it out by documenting what each command does and give descriptions to the command parameters. You can do so by Sending a Pull Request on our GitLab repository.
- Do you know another language? Help translate Yamamura.

If you need anything, join the support server found on our website. We hope to see you soon!
~ NightYoshi370, owner of Yamamura
