class ConfigurationValue {
  constructor(v, type) {
    this.value = v;
    this.type = type;
  }
  
  serialize(client, msg) {
    return {type: this.type.id, value: this.type.serialize(client, msg, this.value)};
  }
}

let types = [
  class IntType {
    constructor() {
      this.id = "int"
    }

    static get nullValue() {
      return null;
    }

    static get id() {
      return "int";
    }

    static serialize(client, _, val) {
      return "" + val;
    }

    static deserialize(client, _, val) {
      return parseInt(val);
    }
    
    static render(client, _, val) {
      return parseInt(val);
    }

    static validate(client, msg, val) {
      return !isNaN(val);
    }
  },
  
  class BoolType {
    constructor() {
      this.id = "bool"
    }

    static get nullValue() {
      return null;
    }

    static get id() {
      return "bool";
    }

    static serialize(client, _, val) {
      return "" + val;
    }

    static deserialize(client, _, val) {
      return val == "false" ? false : true;
    }
    
    static render(client, msg, val) {
      return getString(msg.author.lang, val.toString() == "true" ? "Enabled" : "Disabled");
    }

    static validate(client, msg, val) {
      return ["true", "false"].includes(val.toLowerCase());
    }
  },

  class StringType {
    constructor() {
      this.id = "string"
    }

    static get nullValue() {
      return "";
    }

    static get id() {
      return "string";
    }

    static serialize(client, _, val) {
      return "" + val;
    }

    static deserialize(client, _, val) {
      return "" + val;
    }
    
    static render(client, _, val) {
      return "" + val;
    }

    static validate() {
      return true;
    }
  },

  class CommandType {
    constructor() {
      this.id = "command"
    }

    static get nullValue() {
      return "";
    }

    static get id() {
      return "command";
    }

    static serialize(client, msg, val) {
      let cmd = client.commandHandler.aliases.get(val);
      if (cmd)
        return cmd.id;

      return this.nullValue;
    }

    static deserialize(client, msg, val) {
      return val ? client.commandHandler.modules.get(val) : this.nullValue;
    }
    
    static render(client, msg, val) {
      let cmd = this.deserialize(client, msg, val);
      return cmd ? cmd.id : this.nullValue;
    }

    static validate(client, _, val) {
      let commands = Array.from(client.commandHandler.modules.keys());
      if (commands.filter(command => command === val).length)
        return true;

      return false;
    }
  },

  class ChannelType {
    constructor() {
      this.id = "channel"
    }

    static get nullValue() {
      return null;
    }

    static get id() {
      return "channel";
    }

    static serialize(client, msg, val) {
      const matches = val.match(/(?:<#)?(\d{17,19})>?/);
      if (matches)
        return matches[1];

      let name = msg.guild.channels.find(c => {
        // console.log(require("util").inspect(c, {depth: 0}), c.name, c.type);
        return c.name ? c.name.toLowerCase() : "" == val.toLowerCase() && c.type == "text";
      });
      if (name) return name.id;

      return this.nullValue;
    }
    
    static deserialize(client, msg, val) {
      return val ? client.channels.get(val) : this.nullValue;
    }

    static render(client, msg, val) {
      let chan = this.deserialize(client, msg, val);
      return chan ? `<#${chan.id}>` : this.nullValue;
    }

    static validate(client, msg, val) {
      // console.log(client);
      try {
        let isID = /(?:<#)?(\d{17,19})>?/.test(val);
        let isName = !!msg.guild.channels.find(c => c.name ? c.name.toLowerCase() : "" == val.toLowerCase() && c.type == "text");
        return isName || isID;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  },

  class RoleType {
    constructor() {
      this.id = "role"
    }

    static get nullValue() {
      return null;
    }

    static get id() {
      return "role";
    }

    static serialize(client, msg, val) {
      const matches = val.match(/(?:<@&)?(\d{17,19})>?/);
      if (matches)
        return matches[1];

      let name = msg.guild.roles.filter(r => r.id != r.guild.id).find(c => {
        // console.log(require("util").inspect(c, {depth: 0}), c.name, c.type);
        return c.name.toLowerCase() == val.toLowerCase();
      });
      if (name) return name.id;

      return this.nullValue;
    }
    
    static deserialize(client, msg, val) {
      return val ? msg.guild.roles.get(val) : this.nullValue;
    }

    static render(client, msg, val) {
      let chan = this.deserialize(client, msg, val);
      return chan ? `<@&${chan.id}>` : this.nullValue;
    }

    static validate(client, msg, val) {
      try {
        let isID = /(?:<@&)?(\d{17,19})>?/.test(val);
        let isName = !!msg.guild.roles.filter(r => r.id != r.guild.id).find(c => c.name.toLowerCase() == val.toLowerCase());
        return isName || isID;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
  },

  // Array is a bit of a special one; in the (de)serialization methods,
  // the val variable refers to an array of objects, not of values themselves,
  // where the objects are something like {type: "string", value: "something just like this"}
  class ArrayType {
    constructor() {
      this.id = "array"
    }

    static get nullValue() {
      return [];
    }

    static get id() {
      return "array";
    }

    static serialize(client, msg, val) {
      return val.map(value => {
        // console.log(value, findType(value.type), findType(value.type).serialize);
        return { type: value.type, value: findType(value.type).serialize(client, msg, value.value) };
      })
    }

    static deserialize(client, msg, val) {
      //console.log(val)
      return val instanceof Array ? val.map(value => {
        // console.log(value, findType(value.type));
        return findType(value.type).deserialize(client, msg, value.value)
      }) : [val];
    }
    
    static render(client, msg, val) {
      return ArrayType.deserialize(client, msg, val).join("\n");
    }

    static validate(client, msg, val) {
      return Array.isArray(val) && val.every(value => !!value.type && value.value != undefined);
    }
  },
];

function findType(id) {
  return types.filter(type => type.id == id)[0];
}

function getKey(client, msg, key) {
  let data = client.db.serverconfig.findOne({guildID: msg.guild.id});
  //console.log(data, key, data[key])
  let obj = data[key];
  return findType(obj.type).deserialize(client, msg, obj.value);
}

module.exports = {
//  ConfigurationKey,
  types, findType, getKey
};