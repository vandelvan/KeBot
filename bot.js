const Discord = require("discord.js");
const client = new Discord.Client();
const TwitchMonitor = require("./twitchStuff/twitch-monitor");
const LiveEmbed = require("./twitchStuff/live-embed");

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

    this.updateActivity();
  }

  /**
   * Marks a channel has having gone offline, and updates the user activity if needed.
   */
  static setChannelOffline(stream) {
    delete this.onlineChannels[stream.user_name];

    this.updateActivity();
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

    this.updateActivity();

    // Continue to update current stream activity every 5 minutes or so
    // We need to do this b/c Discord sometimes refuses to update for some reason
    // ...maybe this will help, hopefully
    setInterval(this.updateActivity.bind(this), 5 * 60 * 1000);
  }
}

TwitchMonitor.onChannelLiveUpdate((streamData) => {
  const isLive = streamData.type === "live";

  // Sending a new message
  if (!isLive) {
    // We do not post "new" notifications for channels going/being offline
    continue;
  }
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
  return true;
});
