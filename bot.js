const Discord = require("discord.js");
const client = new Discord.Client();
const TwitchMonitor = require("./twitchStuff/twitch-monitor");
const LiveEmbed = require("./twitchStuff/live-embed");
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGODB_URI;
const clientDB = new MongoClient(uri, { poolSize: 10, useNewUrlParser: true });

// Initialize bot by connecting to the server
client.login(process.env.BOT_TOKEN);

// Event listener when a user connected to the server.
client.on("ready", () => {
  client.user
    .setActivity("Ganando KeHoot", {
      type: "STREAMING",
      url: "https://www.twitch.tv/kevin1229",
    })
    .then(console.log)
    .catch(console.error);
  console.log(`Logged in as ${client.user.tag}!`);
  //shoutout timbot
  // Keep our activity in the user list in sync
  StreamActivity.init(client);
  // Begin Twitch API polling
  TwitchMonitor.start();
});

//Bienvenida usuarios
client.on("guildMemberAdd", (member) => {
  member.guild.channels.cache
    .get("735203148544606289")
    .send(
      "<@" +
        member +
        "> pásale a lo barrido! Aquí estarás informado cuando el Kevin esté en stream y puedes encontrar amigos para jugar juntos"
    )
    .catch((e) => console.log(e));
  //Automaticamente le da el rol de "vox populi"
  var role = member.guild.roles.cache.find(
    (role) => role.name === "Vox Populi"
  );
  member.roles.add(role).catch((e) => console.log(e));
});

//shoutout timbot
// Activity updater
class StreamActivity {
  /**
   * Registers a channel that has come online, and updates the user activity.
   */
  static setChannelOnline(stream) {
    this.onlineChannels[stream.user_name] = stream;
  }

  /**
   * Marks a channel has having gone offline, and updates the user activity if needed.
   */
  static setChannelOffline(stream) {
    delete this.onlineChannels[stream.user_name];
  }

  /**
   * Fetches the channel that went online most recently, and is still currently online.
   */
  static getMostRecentStreamInfo() {
    let lastChannel = null;
    for (let channelName in this.onlineChannels) {
      if (typeof channelName !== "undefined" && channelName) {
        lastChannel = this.onlineChannels[channelName];
      }
    }
    return lastChannel;
  }

  static init(discordClient) {
    this.discordClient = discordClient;
    this.onlineChannels = {};
  }
}

TwitchMonitor.onChannelLiveUpdate((streamData) => {
  const isLive = streamData.type === "live";

  // Sending a new message
  if (!isLive) {
    // We do not post "new" notifications for channels going/being offline
    return false;
  }
  clientDB.connect((err) => {
    if (err) throw err;
    const collection = clientDB
      .dbclientD("heroku_pknlh6w2")
      .collection("kebot");
    console.log("conectado a la DB");
    collection.find({}).toArray(function (err, docs) {
      if (err) throw err;
      if (docs[0].streamDate != streamData.started_at) {
        collection.updateOne(
          {},
          { $set: { streamDate: streamData.started_at } },
          function (err, result) {
            if (err) throw err;
            const msgEmbed = LiveEmbed.createForStream(streamData);
            client.channels.cache
              .get("735201896779743353")
              .send(
                "@everyone El Kevin ya está stremeando `" +
                  streamData.title +
                  "`, Caile a verlo! https://twitch.tv/kevin1229",
                {
                  embed: msgEmbed,
                }
              )
              .catch((e) => console.log(e));
          }
        );
      }
    });
  });
  clientDB.close();
  return true;
});
