const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const CLIENT_SECRET_PATH = 'services/google-sheets-api/credentials/credentials.json';

var writeToken = function(token_path, token, callback) {
  fs.writeFile(token_path, JSON.stringify(token), (err) => {
    if (err) callback(err);
  });
}

var authorize = function(credentials, tokenPath, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(tokenPath, (err, token) => {
    if (err) {
      callback({}, oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      }));
    } else {
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    }
  });
}

module.exports = {

  // Load client secrets from a local file.
  getAuthClient : function(tokenInfo, callback) {
    fs.readFile(CLIENT_SECRET_PATH, (err, content) => {
      if (err) return callback({}, {}, 'Error loading client secret file:' + err);
      // Authorize a client with credentials
      var credentials = JSON.parse(content);
      if (tokenInfo.newToken) {
        writeToken(tokenInfo.tokenPath, tokenInfo.newToken, function(err) {
        if (err) return callback({}, {}, 'Error writing token file:' + err);
          authorize(credentials, tokenInfo.tokenPath, callback)
        });
      }
      else authorize(credentials, tokenInfo.tokenPath, callback);
    });
  },

  readSheet : function(auth, sheetInfo, cb) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: sheetInfo.id,
      range: sheetInfo.range,
    }, (err, res) => {
      if (err) return cb({}, 'The API returned an error: ' + err);
      const rows = res.data.values;
      if (rows.length) cb(rows);
      else cb({}, 'No data found.');
    });
  }

}