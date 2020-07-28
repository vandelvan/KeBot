//OG FILE https://github.com/roydejong/timbot/blob/master/twitch-api.js
const axios = require('axios');

/**
 * Twitch Helix API helper ("New Twitch API").
 */
class TwitchApi {
  static get requestOptions() {
    // Automatically remove "oauth:" prefix if it's present
    const oauthPrefix = "oauth:";
    let oauthBearer = process.env.TWITCH_TOKEN;
    if (oauthBearer.startsWith(oauthPrefix)) {
      oauthBearer = oauthBearer.substr(oauthPrefix.length);
    }
    // Construct default request options
    return {
      baseURL: "https://api.twitch.tv/helix/",
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT,
        "Authorization": `Bearer ${oauthBearer}`
      }
    };
  }

  static handleApiError(err) {
    const res = err.response || { };

    if (res.data && res.data.message) {
      console.error('[TwitchApi]', 'API request failed with Helix error:', res.data.message, `(${res.data.error}/${res.data.status})`);
    } else {
      console.error('[TwitchApi]', 'API request failed with error:', err.message || err);
    }
  }

  static fetchStreams(channelNames) {
    return new Promise((resolve, reject) => {
      axios.get(`/streams?user_login=${channelNames.join('&user_login=')}`, this.requestOptions)
        .then((res) => {
          resolve(res.data.data || []);
        })
        .catch((err) => {
          this.handleApiError(err);
          reject(err);
        });
    });
  }

  static fetchUsers(channelNames) {
    return new Promise((resolve, reject) => {
      axios.get(`/users?login=${channelNames.join('&login=')}`, this.requestOptions)
        .then((res) => {
          resolve(res.data.data || []);
        })
        .catch((err) => {
          this.handleApiError(err);
          reject(err);
        });
    });
  }
}

module.exports = TwitchApi;