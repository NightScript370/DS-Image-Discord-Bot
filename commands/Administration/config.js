const { Command } = require('discord-akairo');
const { oneLine } = require('common-tags');
const { findType } = require('./../../Configuration.js');
const config = require("./../../config.js");

module.exports = class ConfigCommand extends Command {
  constructor() {
    super("config", {
      category: 'Administration',
      aliases: ["conf", "config"],
      clientPermissions: ['EMBED_LINKS'],
      // userPermissions: ['ADMINISTRATOR'],
      description: {
        content: `View and set the server configuration for the bot.`,
        examples: ['config', "config get prefix", "config set prefix !"],
        usage: 'config ["view"|"get"|"set"|"clear"] (key) (value)',
      },
      args: [
        {
          id: 'action',
          description: "The action you would like to perform. If you do not specify this or it's invalid, you will view the configuration instead",
          default: "view",
          type: [["view", ""], ["get"], ["set"], ["clear"]]
        },
        {
          id: 'key',
          description: "This will be the key you would like to modify.",
          default: null,
          type: 'string'
        },
        {
          id: 'value',
          description: "This will be the value of the key you set before.",
          default: null,
          match: "rest"
        }
      ]
    });
  }

  userPermissions(msg) {
    return (this.client.isOwner(msg.author.id) || msg.member.hasPermission("ADMINISTRATOR")) ? null : "ADMINISTRATOR";
  }

  getTitles(__) {
    return {
      logchan: __("Log channel"),
      welcomechan: __("Welcome channel"),
      welcomemessage: __("Welcome messages"),
      leavemessage: __("Leave message"),
      prefix: __("Prefix"),
      makerboard: __("MakerBoard URL"),
      starboardchannel: __("Starboard channel"),
      levelup: __("Level UP"),
      levelupmsgs: __("Level UP messages"),
    }
  }

  async exec(msg, { action, key, value }) {
    const __ = (k, ...v) => global.getString(msg.author.lang, k, ...v);
    let data = this.client.db.serverconfig.findOne({ guildID: msg.guild.id });

    switch (action) {
      case 'view':
        let titles = this.getTitles(__);
        let embed = this.client.util.embed()
          .setTitle(__("Server configuration for {0}", msg.guild.name))
          .setDescription(__("You can use `{0}config set <key> null` to set a value to an empty state.", await this.handler.prefix(msg)))
          .setYamamuraCredits(true);

        for (let k in data) {
          let v = data[k];
          if (["meta", "$loki", "guildID"].includes(k)) continue;
          let type = findType(v.type);
          console.log(v, v.type, type)
          try {
            let deserializedValue = type.render(this.client, msg, v.value);
            embed.addField(titles[k] + " [`" + k + "`]", deserializedValue == type.nullValue || deserializedValue == undefined || (deserializedValue == [] || deserializedValue[0] == undefined)  ? __("This value is empty") : deserializedValue)
          } catch (e) {
            embed.addField(titles[k] + " [`" + k + "`]", "Error field")
          }
        }

        return msg.util.send(embed);
        break;
      case 'get':
        if (!key) return msg.channel.send(__("You didn't specify a key!"));

        let type = findType(data[key].type);
        let deserializedValue = type.render(this.client, msg, data[key].value);

        return msg.channel.send(deserializedValue == type.nullValue || deserializedValue == undefined || (deserializedValue == [] || deserializedValue[0] == undefined) ? __("This value is empty") : deserializedValue)
        break;
      case 'set':
        if (!key) return msg.channel.send(__("You didn't specify a key!"));
        if (!data[key]) return msg.channel.send(__("The key `{0}` does not exist.", key));
        if (data[key].type == "array") return await this.setArray(msg, data, key, value);

        if (!value) return msg.channel.send(__("You didn't specify a value!"));
        if (!key in data) return msg.channel.send(__("There's no `{0}` key in the configuration!", key));
        let t = findType(data[key].type);

        if (!t) return msg.channel.send(__("An error occurred: {0}.\nAlert the bot owners to let them fix this error", __("There's no type with ID `{0}`", data[key].type)));
        if (!t.validate(this.client, msg, value)) return msg.channel.send(__("The input `{0}` is not valid for the type `{1}`.", value, t.id));

        if (value != "null") {
          let newValue = t.serialize(this.client, msg, value);
          data[key].value = newValue;
        } else
          data[key].value = t.nullValue;

        return msg.util.send(require("util").inspect(data[key]), {code: 'js'});
        break;
      case 'clear':
      case 'reset':
        let resp = await this.awaitReply(msg, __("Are you ___**100%**___ sure you want to reset the configuration? [Y/N]"), 30000);

        if (resp && resp.toLowerCase() == "y") {
          console.log(msg.author.tag + " accepted to clear " + msg.guild.name + "'s settings")
          try {
            data.logchan = {"value":"","type":"channel"};
            data.welcomechan = {"value":"","type":"channel"};
            data.welcomemessage = {type: 'array', arrayType: 'string', value: [{value: "Welcome {{user}} to {{guild}}! Enjoy your stay", type: "string"}] },
            data.leavemessage = {"value":"Welp, {{name}} has left.","type":"string"};
            data.prefix = {"value":config.prefix,"type":"string"};
            data.makerboard = {"value":"","type":"string"};
            data.starboardchannel =  {"value":"","type":"channel"};
            data.levelup = {value:"true",type:"bool"}
            await this.client.db.serverconfig.update(data);
            return msg.util.reply(__("I have successfully cleared the configuration"));
          } catch (e) {
            console.error(e);
            console.log(this.client.db)
            return msg.util.send(__("There has been an error with the configuration clearance. Please report this bug to the {0} Developers", this.client.user.username));
          }
        }
        return msg.util.reply(__("action cancelled"));
        break;
      default:
        return msg.util.send(__("The action must be one of [{0}]!", "view, get, set, clear"));
        break;
    }
  }

  async setArray(msg, data, key, value) {
    const __ = (k, ...v) => global.getString(msg.author.lang, k, ...v);
    let t = findType("array");

    let action = await this.awaitReply(msg, __("What do you want to do with the values? [`add` a value/`clear` the values]"), 30000);
    action = action.toLowerCase();

    if (!action) {
      return msg.util.reply(__("action cancelled"));
    } else if (action == "clear") {
      let resp = await this.awaitReply(msg, __("Are you ___**100%**___ sure you want to reset the array? [Y/N]"), 30000);

      if (resp && resp.toLowerCase() == "y") {
        try {
          data[key].value = [];

          return msg.util.reply(__("I have successfully cleared the array"));
        } catch (e) {
          console.error(e);
          return msg.util.send(__("There has been an error with the array clearance. Please report this bug to the {0} Developers", this.client.user.username));
        }
      }
      return msg.util.reply(__("action cancelled"));
    } else if (action == "add") {
      let resp = ""
      let arr = [];
      while (resp.toLowerCase() != "stop") {
        if (resp) arr.push({ type: data[key].arrayType || "string", value: resp });
        resp = await this.awaitReply(msg, __("Enter the value you want to add, or type `stop` (or wait 30 seconds) to stop"), 30000);
      }

      // console.log(arr);
      data[key].value = arr.concat(data[key].value);

      // await this.client.db.serverconfig.update(data);
      return msg.util.send(require("util").inspect(data[key]), {code: 'js'});
    } else {
      return msg.util.send(__("The action must be one of [{0}]!", "add, clear"));
    }
  }

  async awaitReply(msg, question, limit = 60000) {
    const filter = m=>(m.author.id == msg.author.id);
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };
};
