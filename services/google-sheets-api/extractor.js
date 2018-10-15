const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const CLIENT_SECRET_PATH = 'services/google-sheets-api/credentials/credentials.json';
const TOKEN_PATH = 'services/google-sheets-api/credentials/token.json';


// Load client secrets from a local file.
var getAuthClient = function(callback) {
  fs.readFile(CLIENT_SECRET_PATH, (err, content) => {
    if (err) return callback({}, {}, 'Error loading client secret file:' + err);
    // Authorize a client with credentials
    authorize(JSON.parse(content), callback);
  });
}

var authorize = function(credentials, callback) {
  // Check if we have previously stored a token.
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
  client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      callback(oAuth2Client, oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      }));
    } else {
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    }
  });
}

var readSheet = function(auth, sheetInfo, cb) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: sheetInfo.sheetId,
    range: sheetInfo.sheetRange,
  }, (err, res) => {
    if (err) return cb({}, 'The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) cb(rows);
    else cb({}, 'No data found.');
  });
}

module.exports = {

  getSheetData : function(sheet, callback) {
    getAuthClient(function (authClient, authUrl, credentialsErr) {
      if (credentialsErr) callback({}, credentialsErr);
      else if (authUrl)   callback({ authUrl: authUrl });
      else {
        readSheet(authClient, sheet, function (result, err) {
          if (err) callback({}, err);
          else     callback(result);
        })
      }
    });
  },

  setToken : function(code, callback) {
    fs.readFile(CLIENT_SECRET_PATH, (err, content) => {
      if (err) return callback({}, {}, 'Error loading client secret file:' + err);
      // Authorize a client with credentials
      var credentials = JSON.parse(content);
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) callback('Error writing token file:' + err);
          else callback();
        });
      });
    });
  }

}