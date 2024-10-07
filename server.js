const Discord = require("discord.js");
const axios = require("axios");
const SQLite = require("better-sqlite3");
const sql = new SQLite("./guild_data.sqlite");
const config = require("config");
const fs = require("fs");
const {
  MessageMentions: { CHANNEL_PATTERN },
} = require("discord.js");
const jwt = require("jsonwebtoken");
var express = require("express");
var app = express();
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { request, gql, GraphQLClient } = require("graphql-request");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const Table = require("easy-table");
const graphql_Client = new GraphQLClient(
  " https://www.fflogs.com/api/v2/client"
);
var temp;
const disc_client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
});

graphql_Client.setHeader(
  "authorization",
  "Bearer " + config.get("graphQLtoken")
);

//graphQL prepared queries
const query_get_info = gql`
      query($name: String,$server: String,$region: String){
	guildData{
guild(name:$name,serverSlug:$server,serverRegion: $region){
				id
		    name
			}
	}
}

    `;

const query_get_ranks = gql`
    query($code: String,$fightID: Int){
	reportData{
		report(code:$code){
				rankings(playerMetric:rdps,fightIDs:[$fightID])
			
		}
	}
}


`;

//

//

//FFlog v2 API getting the auth bearer token
/*axios.post('https://www.fflogs.com/oauth/token', {
    grant_type:'client_credentials' 
  },{auth:{
           username: process.env.FFlogclientID,
           password: process.env.FFlogsecret
           }})
  .then(function (response) {
  fflog_api_token = response.data.access_token;
    //console.log(response);
    console.log(fflog_api_token);
  })
  .catch(function (error) {
    console.log(error);
  });
//
*/
function convertJobName(s){
  switch(s){
    case "BlackMage":return "BLM";
    case "RedMage":return "RDM";
    case "Summoner": return "SMN";
    case "Machinist": return "MCH";
    case ""
    case "Bard":return "BRD";
    case "Samurai":return "SAM";
    case "Gunbreaker":return "GNB";
    case "DarkKnight":return "DRK";
    case "Paladin": return "PLD";
    case "Warrior": return "WAR";
    case "Sage":return "SGE";
    case "WhiteMage":return "WHM";
    case "Scholar": return "SCH";
    case "Astrologian": return "AST";
    
  }
}
function parseJSONtoData(obj) {
  var final = [
    {
      name: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.tanks.characters[0].name
      ),
      class: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.tanks.characters[0].class
      ),
      percentile: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.tanks.characters[0]
          .rankPercent
      ),
      rDPS: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.tanks.characters[0].amount
      ),
    },
    {
      name: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.tanks.characters[1].name
      ),
      class: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.tanks.characters[1].class
      ),
      percentile: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.tanks.characters[1]
          .rankPercent
      ),
      rDPS: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.tanks.characters[1].amount
      ),
    },
    {
      name: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.healers.characters[0].name
      ),
      class: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.healers.characters[0].class
      ),
      percentile: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.healers.characters[0]
          .rankPercent
      ),
      rDPS: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.healers.characters[0]
          .amount
      ),
    },
    {
      name: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.healers.characters[1].name
      ),
      class: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.healers.characters[1].class
      ),
      percentile: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.healers.characters[1]
          .rankPercent
      ),
      rDPS: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.healers.characters[1]
          .amount
      ),
    },
    {
      name: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[0].name
      ),
      class: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[0].class
      ),
      percentile: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[0]
          .rankPercent
      ),
      rDPS: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[0].amount
      ),
    },
    {
      name: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[1].name
      ),
      class: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[1].class
      ),
      percentile: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[1]
          .rankPercent
      ),
      rDPS: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[1].amount
      ),
    },
    {
      name: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[2].name
      ),
      class: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[2].class
      ),
      percentile: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[2]
          .rankPercent
      ),
      rDPS: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[2].amount
      ),
    },
    {
      name: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[3].name
      ),
      class: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[3].class
      ),
      percentile: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[3]
          .rankPercent
      ),
      rDPS: JSON.stringify(
        obj.reportData.report.rankings.data[0].roles.dps.characters[3].amount
      ),
    },
  ];
  //Name,class,percentile,rDPS
  return final;
}
function getNameAndRdps(obj) {
  var final = new Object();
  /*for(var i=0;i<obj.reportData.report.rankings.data.length;i++){
    for(var j=0;j<obj.reportData.report.rankings.data[i].roles.tanks.characters.length;j++){
       final[JSON.stringify(obj.reportData.report.rankings.data[i].roles.tanks.characters[j].name)] = JSON.stringify(obj.reportData.report.rankings.data[i].roles.tanks.characters[j].amount);
    }
    for(var j=0;j<obj.reportData.report.rankings.data[i].roles.healers.characters.length;j++){
       final[JSON.stringify(obj.reportData.report.rankings.data[i].roles.healers.characters[j].name)] = JSON.stringify(obj.reportData.report.rankings.data[i].roles.healers.characters[j].amount);
    }
    for(var j=0;j<obj.reportData.report.rankings.data[i].roles.dps.characters.length;j++){
       final[JSON.stringify(obj.reportData.report.rankings.data[i].roles.dps.characters[j].name)] = JSON.stringify(obj.reportData.report.rankings.data[i].roles.dps.characters[j].amount);
    }
  }*/
  //for some reason the for loops get some value wrong(probably mixups if the reports has rankings from different classes/more then 8 people)
  final[
    JSON.stringify(
      obj.reportData.report.rankings.data[0].roles.tanks.characters[0].name
    )
  ] = JSON.stringify(
    obj.reportData.report.rankings.data[0].roles.tanks.characters[0].amount
  );
  final[
    JSON.stringify(
      obj.reportData.report.rankings.data[0].roles.tanks.characters[1].name
    )
  ] = JSON.stringify(
    obj.reportData.report.rankings.data[0].roles.tanks.characters[1].amount
  );
  final[
    JSON.stringify(
      obj.reportData.report.rankings.data[0].roles.healers.characters[0].name
    )
  ] = JSON.stringify(
    obj.reportData.report.rankings.data[0].roles.healers.characters[0].amount
  );
  final[
    JSON.stringify(
      obj.reportData.report.rankings.data[0].roles.healers.characters[1].name
    )
  ] = JSON.stringify(
    obj.reportData.report.rankings.data[0].roles.healers.characters[1].amount
  );
  final[
    JSON.stringify(
      obj.reportData.report.rankings.data[0].roles.dps.characters[0].name
    )
  ] = JSON.stringify(
    obj.reportData.report.rankings.data[0].roles.dps.characters[0].amount
  );
  final[
    JSON.stringify(
      obj.reportData.report.rankings.data[0].roles.dps.characters[1].name
    )
  ] = JSON.stringify(
    obj.reportData.report.rankings.data[0].roles.dps.characters[1].amount
  );
  final[
    JSON.stringify(
      obj.reportData.report.rankings.data[0].roles.dps.characters[2].name
    )
  ] = JSON.stringify(
    obj.reportData.report.rankings.data[0].roles.dps.characters[2].amount
  );
  final[
    JSON.stringify(
      obj.reportData.report.rankings.data[0].roles.dps.characters[3].name
    )
  ] = JSON.stringify(
    obj.reportData.report.rankings.data[0].roles.dps.characters[3].amount
  );

  return final;
}

const prefix = "$"; //will be changed to discord new slash command implementation later

//ensure database is created before starting
disc_client.on("ready", () => {
  const table = sql
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guild_data';"
    )
    .get();
  if (!table["count(*)"]) {
    //table needs to be created
    sql
      .prepare(
        "CREATE TABLE guild_data (id INTEGER PRIMARY KEY AUTOINCREMENT, guild_id TEXT UNIQUE,ffguildname TEXT,ffguildworld TEXT,ffguildregion TEXT,channel_id TEXT,token TEXT);"
      )
      .run();
  }

  //SQlite prepared queries
  disc_client.getGuildSettings = sql.prepare(
    "SELECT * FROM guild_data WHERE guild_id = ?;"
  );
  disc_client.checkToken = sql.prepare(
    "SELECT * FROM guild_data WHERE token = ?;"
  );
  disc_client.addNewGuild = sql.prepare(
    "INSERT INTO guild_data (guild_id) VALUES (?); "
  );
  disc_client.changeGuildSettings = sql.prepare(
    "UPDATE guild_data SET ffguildname=@ffguildname,ffguildworld=@ffguildworld,ffguildregion=@ffguildregion WHERE guild_id = @guild_id"
  );
  disc_client.deleteGuild = sql.prepare(
    "DELETE FROM guild_data WHERE guild_id = ?;"
  );
  disc_client.changeChannelSettings = sql.prepare(
    "UPDATE guild_data SET channel_id = ? WHERE guild_id = ?;"
  );
  disc_client.changeGuildToken = sql.prepare(
    "UPDATE guild_data SET token=? WHERE guild_id = ?;"
  );
});
//

//On Join and On Remove events
disc_client.on("guildCreate", (guild) => {
  console.log("New server added,creating SQL table entry...");
  disc_client.addNewGuild.run(guild.id);
});

disc_client.on("guildDelete", (guild) => {
  console.log("Deleting server from SQL table...");
  disc_client.deleteGuild.run(guild.id);
});
//

//Slash commands

//arrray that store all the slashcommands
const cmd_array = [];
//array that store the jsons to send to Discord
const cmd_json = [];
//Slash command declaration

cmd_array.push(
  new SlashCommandBuilder()
    .setName("fetchmostrecent")
    .setDescription("Fetch most recent report from linked fflog static")
);

cmd_array.push(
  new SlashCommandBuilder()
    .setName("setguild")
    .setDescription(
      "Set the guild name that you want the bot to post reports of"
    )
    .addStringOption((option) =>
      option
        .setName("guildname")
        .setDescription("Name of the guild")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("guildworld")
        .setDescription("Name of the world the guild is on")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("guildregion")
        .setDescription("Name of the region the guild is on")
        .setRequired(true)
    )
);

cmd_array.push(
  new SlashCommandBuilder()
    .setName("testrank")
    .setDescription("Dev command to test rank pull and display")
    .addStringOption((option) =>
      option.setName("code").setDescription("Encounter code").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("fightid")
        .setDescription("ID of the fight to pull")
        .setRequired(true)
    )
);

cmd_array.push(
  new SlashCommandBuilder()
    .setName("generatetoken")
    .setDescription("Generate a new Token for the ACT plugin")
);
cmd_array.push(
  new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Set the channel where parses are sent")
    .addChannelOption((option) =>
      option.setName("destination").setDescription("Mention a channel")
    )
);

cmd_array.push(
  new SlashCommandBuilder()
    .setName("testembed")
    .setDescription("Test display of reports")
);

cmd_array.forEach(function (item) {
  cmd_json.push(item.toJSON());
});

const rest = new REST({ version: "9" }).setToken(process.env.Token);
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DiscClientID,
        "935314735614808144"
      ),
      { body: cmd_json }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

//command handling

disc_client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  switch (interaction.commandName) {
    case "fetchmostrecent": {
      let guild_data = disc_client.getGuildSettings.get(interaction.guild.id);
      const ffguildname = guild_data.ffguildname;
      const ffguildworld = guild_data.ffguildworld;
      const ffguildregion = guild_data.ffguildregion;
      var reportid = "";
      axios
        .get(
          "https://www.fflogs.com/v1/reports/guild/" +
            ffguildname +
            "/" +
            ffguildworld +
            "/" +
            ffguildregion +
            "?api_key=" +
            process.env.FFlogkey
        )
        .then((res) => {
          console.log("statusCode: " + res.status);
          console.log("id of most recent report is:" + res.data[0].id);
          interaction.reply(
            "Most recent report by " +
              ffguildname +
              ":https://www.fflogs.com/reports/" +
              res.data[0].id
          );
        })
        .catch((error) => {
          console.error(error);
        });
      break;
    }
    case "setguild": {
      const ffguildname = interaction.options.getString("guildname");
      const ffguildworld = interaction.options.getString("guildworld");
      const ffguildregion = interaction.options.getString("guildregion");
      let obj = {
        ffguildname: ffguildname,
        ffguildworld: ffguildworld,
        ffguildregion: ffguildregion,
        guild_id: interaction.guild.id,
      };
      disc_client.changeGuildSettings.run(obj);
      interaction.reply(
        "FFlog guild for this server has been set as:" +
          ffguildname +
          ", world:" +
          ffguildworld +
          ", region:" +
          ffguildregion
      );
      break;
    }
    case "testrank": {
      const variables = {
        code: interaction.options.getString("code"),
        fightID: interaction.options.getString("fightid"),
      };
      try {
        graphql_Client.request(query_get_ranks, variables).then((data) => {
          //console.log(data);
          //console.log(data.reportData.report.rankings);
          //console.log(data.reportData.report);
          const jsonified = JSON.stringify(data);
          //console.log(jsonified);
          const parsed = JSON.parse(jsonified);
          //console.log(data.reportData.report.rankings.data[0].roles);
          const rdpsbyname = getNameAndRdps(data);
          const formated = parseJSONtoData(data);
          var t = new Table();

          formated.forEach(function (player) {
            t.cell("Name", player.name.replace(/["]+/g, ''));
            t.cell("Class", player.class.replace(/["]+/g, ''));
            t.cell("Percentile", player.percentile);
            t.cell("rDPS",parseInt(player.rDPS));
            t.newRow();
          });
          t.sort(["rDPS|des"]);
          t.total("rDPS");
          const logMessage = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("FFlog notify test")
            .setAuthor({
              name: "FFlognotify",
              iconURL: "https://assets.rpglogs.com/img/ff/favicon.png",
              url: "https://www.fflogs.com/",
            })
            .setDescription(t.toString())
            .setThumbnail("https://assets.rpglogs.com/img/ff/favicon.png")
            .addField(
              "XIVAnalysis",
              "https://xivanalysis.com/fflogs/" +
                interaction.options.getString("code") +
                "/" +
                interaction.options.getString("fightid"),
              true
            )
            .setImage("https://assets.rpglogs.com/img/ff/favicon.png")
            .setTimestamp();

          interaction.channel.send({ embeds: [logMessage] });
          interaction.reply("sent");
          //message.reply(JSON.stringify(data.reportData.report.rankings.data[0].roles.tanks.characters[0].name) + JSON.stringify(data.reportData.report.rankings.data[0].roles.tanks.characters[0].amount));
        });
      } catch (error) {
        interaction.reply(JSON.stringify(error));
      }
      break;
    }
    case "generatetoken": {
      const token = jwt.sign(
        { username: interaction.guild.id },
        process.env.TOKEN_SECRET,
        {}
      );
      interaction.reply(
        "New Token for this server has been generated and DM'ed to you"
      );
      interaction.reply(
        "Only share this token with trusted people,if multiple people are parsing,only 1 should be using the plugin"
      );
      interaction.author.send("Your token is:" + token);
      disc_client.changeGuildToken.run(token, interaction.guild.id);
      break;
    }

    case "testembed": {
      //message.reply("pulling encounterid:"+args[0]);

      const logMessage = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("FFlog notify test")
        .setAuthor({
          name: "FFlognotify",
          iconURL: "https://assets.rpglogs.com/img/ff/favicon.png",
          url: "https://www.fflogs.com/",
        })
        .setDescription("stuff")
        .setThumbnail("https://assets.rpglogs.com/img/ff/favicon.png")
        .addField(
          "XIVAnalysis",
          "https://xivanalysis.com/fflogs/91FLbw2YR4vhnf7r",
          true
        )
        .setImage("https://assets.rpglogs.com/img/ff/favicon.png")
        .setTimestamp();
      let guild_data = disc_client.getGuildSettings.get(interaction.guild.id);
      const channelid = guild_data.channel_id;
      console.log("channelid in db is:" + guild_data.channel_id);
      const channel = disc_client.channels.cache.get(channelid);
      channel.send({ embeds: [logMessage] });
      interaction.reply({ content: "testing...", ephemeral: true });
      break;
    }
    case "setchannel": {
      const extracted = interaction.options.getChannel("destination").id;
      disc_client.changeChannelSettings.run(extracted, interaction.guild.id);
      console.log("channel set:" + extracted);
      interaction.reply(
        "Reports will be sent to the <#" + extracted + "> channel"
      );
      break;
    }
  }
});

disc_client.on("messageCreate", function (message) {
  //exclusions and rules
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (message.guild) {
    //actual command processing
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();
    //console.log(command);
    switch (command) {
      case "fetchmostrecent": {
        let guild_data = disc_client.getGuildSettings.get(message.guild.id);
        const ffguildname = guild_data.ffguildname;
        const ffguildworld = guild_data.ffguildworld;
        const ffguildregion = guild_data.ffguildregion;
        axios
          .get(
            "https://www.fflogs.com/v1/reports/guild/" +
              ffguildname +
              "/" +
              ffguildworld +
              "/" +
              ffguildregion +
              "?api_key=" +
              process.env.FFlogkey
          )
          .then((res) => {
            console.log("statusCode: " + res.status);
            console.log("id of most recent report is:" + res.data[0].id);
            message.reply(
              "Most recent report by " +
                ffguildname +
                ":https://www.fflogs.com/reports/" +
                res.data[0].id
            );
          })
          .catch((error) => {
            console.error(error);
          });
        break;
      }
      case "setguild": {
        const ffguildname = args[0];
        const ffguildworld = args[1];
        const ffguildregion = args[2];
        let obj = {
          ffguildname: ffguildname,
          ffguildworld: ffguildworld,
          ffguildregion: ffguildregion,
          guild_id: message.guild.id,
        };
        disc_client.changeGuildSettings.run(obj);
        message.reply(
          "FFlog guild for this server has been set as:" +
            ffguildname +
            ", world:" +
            ffguildworld +
            ", region:" +
            ffguildregion
        );
        break;
      }
      case "showguild": {
        let guild_data = disc_client.getGuildSettings.get(message.guild.id);
        const ffguildname = guild_data.ffguildname;
        const ffguildworld = guild_data.ffguildworld;
        const ffguildregion = guild_data.ffguildregion;
        message.reply(
          "FFlog guild for this server is:" +
            ffguildname +
            ", world:" +
            ffguildworld +
            ", region:" +
            ffguildregion
        );
        break;
      }
      case "setchannel": {
        const extracted = message.mentions.channels.first().id;
        disc_client.changeChannelSettings.run(extracted, message.guild.id);
        console.log("channel set:" + extracted);
        message.reply(
          "Reports will be sent to the <#" + extracted + "> channel"
        );
        break;
      }
      case "hookfflog": {
        console.log("target is:" + message.guild.id);
        let guild_data = disc_client.getGuildSettings.get(message.guild.id);
        const channel_id = guild_data.channel_id;
        temp = channel_id;
        console.log("channel is:" + temp);
        message.reply("Tracking FFlogs report for MyLittlePogChamps ");
        break;
      }
      case "testchannel": {
        let guild_data = disc_client.getGuildSettings.get(message.guild.id);
        const channelid = guild_data.channel_id;
        console.log("channelid in db is:" + guild_data.channel_id);
        const channel = disc_client.channels.cache.get(channelid);
        channel.send("this is the associated channel");
        break;
      }
      case "debugadd": {
        disc_client.addNewGuild.run(message.guild.id);
        message.reply("Table cleared and rebuilt for debuging");
        break;
      }
      case "debugremove": {
        disc_client.deleteGuild.run(message.guild.id);
        message.reply("Server data removed");
        break;
      }

      case "givemetoken": {
        const token = jwt.sign(
          { username: message.guild.id },
          process.env.TOKEN_SECRET,
          {}
        );
        message.reply(
          "New Token for this server has been generated and DM'ed to you"
        );
        message.reply(
          "Only share this token with trusted people,if multiple people are parsing,only 1 should be using the plugin"
        );
        message.author.send("Your token is:" + token);
        disc_client.changeGuildToken.run(token, message.guild.id);
        break;
      }
      case "testgraphql": {
        const variables = {
          name: args[0],
          server: args[1],
          region: args[2],
        };
        try {
          graphql_Client.request(query_get_info, variables).then((data) => {
            console.log(data);
            console.log(data.guildData.guild.id);
            message.reply(JSON.stringify(data.guildData.guild.id));
          });
        } catch (error) {
          message.reply(JSON.stringify(error));
        }
        break;
      }
      case "testrank": {
        const variables = {
          code: args[0],
          fightID: args[1],
        };
        try {
          graphql_Client.request(query_get_ranks, variables).then((data) => {
            //console.log(data);
            //console.log(data.reportData.report.rankings);
            //console.log(data.reportData.report);
            const jsonified = JSON.stringify(data);
            const parsed = JSON.parse(jsonified);
            console.log(
              data.reportData.report.rankings.data[0].roles.tanks.characters[0]
                .id
            );
            const rdpsbyname = getNameAndRdps(data);
            const logMessage = new MessageEmbed()
              .setColor("#0099ff")
              .setTitle("FFlog notify test")
              .setAuthor({
                name: "FFlognotify",
                iconURL: "https://assets.rpglogs.com/img/ff/favicon.png",
                url: "https://www.fflogs.com/",
              })
              .setDescription("A new report has been detected")
              .setThumbnail("https://assets.rpglogs.com/img/ff/favicon.png")
              .addField(
                "XIVAnalysis",
                "https://xivanalysis.com/fflogs/91FLbw2YR4vhnf7r",
                true
              )
              .setImage("https://assets.rpglogs.com/img/ff/favicon.png")
              .setTimestamp();
            for (var key in rdpsbyname) {
              logMessage.addField(key, rdpsbyname[key], false);
            }
            message.channel.send({ embeds: [logMessage] });
            //message.reply(JSON.stringify(data.reportData.report.rankings.data[0].roles.tanks.characters[0].name) + JSON.stringify(data.reportData.report.rankings.data[0].roles.tanks.characters[0].amount));
          });
        } catch (error) {
          message.reply(JSON.stringify(error));
        }
        break;
      }
      case "refreshgraphql": {
        axios
          .post(
            "https://www.fflogs.com/oauth/token",
            {
              grant_type: "client_credentials",
            },
            {
              auth: {
                username: process.env.FFlogclientID,
                password: process.env.FFlogsecret,
              },
            }
          )
          .then(function (response) {
            var file_content = fs.readFileSync("config/default.json");
            var content = JSON.parse(file_content);
            console.log(content);
            content.graphQLtoken = response.data.access_token;
            fs.writeFileSync("config/default.json", JSON.stringify(content));
            graphql_Client.setHeader(
              "authorization",
              "Bearer " + config.get("graphQLtoken")
            );
            //console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        message.reply("GraphhQL token refreshed");
        break;
      }
      case "testembed": {
        //message.reply("pulling encounterid:"+args[0]);
        const logMessage = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("FFlog notify test")
          .setAuthor({
            name: "FFlognotify",
            iconURL: "https://assets.rpglogs.com/img/ff/favicon.png",
            url: "https://www.fflogs.com/",
          })
          .setDescription("A new report has been detected")
          .setThumbnail("https://assets.rpglogs.com/img/ff/favicon.png")
          .addField(
            "XIVAnalysis",
            "https://xivanalysis.com/fflogs/91FLbw2YR4vhnf7r",
            true
          )
          .setImage("https://assets.rpglogs.com/img/ff/favicon.png")
          .setTimestamp();
        let guild_data = disc_client.getGuildSettings.get(message.guild.id);
        const channelid = guild_data.channel_id;
        console.log("channelid in db is:" + guild_data.channel_id);
        const channel = disc_client.channels.cache.get(channelid);
        channel.send({ embeds: [logMessage] });
        break;
      }
      default:
        message.reply("Command not recognized");
        return;
    }
  }
});

app.get("/refreshme", function (req, res) {
  console.log(req);
  console.log("request for refresh received:");
  console.log("token:" + req.query.token);
  const obj = disc_client.checkToken.get(req.query.token);
  console.log(obj);
  const channel = disc_client.channels.cache.get(obj.channel_id);
  const ffguildname = obj.ffguildname;
  const ffguildworld = obj.ffguildworld;
  const ffguildregion = obj.ffguildregion;
  axios
    .get(
      "https://www.fflogs.com/v1/reports/guild/" +
        ffguildname +
        "/" +
        ffguildworld +
        "/" +
        ffguildregion +
        "?api_key=" +
        process.env.FFlogkey
    )
    .then((res) => {
      console.log("statusCode: " + res.status);
      console.log("id of most recent report is:" + res.data[0].id);
      channel.send(
        "New report by " +
          ffguildname +
          ":https://www.fflogs.com/reports/" +
          res.data[0].id
      );
    })
    .catch((error) => {
      console.error(error);
    });

  res.sendStatus(200);
});
disc_client.login(process.env.Token);
var listener = app.listen(process.env.PORT, function () {
  console.log("API backend listening on port" + listener.address().port);
});
console.log("Bot is now running");
