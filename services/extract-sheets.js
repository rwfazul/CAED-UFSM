const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
var getResponses = function(callback) {
  fs.readFile('credentials.json', (err, content) => {
    console.log(content);
    var credentials = JSON.parse(content);
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      // if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      readSheet(oAuth2Client, callback);
    });    
  });
}

/**
 * Read the sample spreadsheet:foajfp
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function readSheet(auth, cb) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1Xyv_QKWnz-8QsFIHX5yTjQVoXL2IdK8SF6DB2kUeRlk',
    range: 'Responses',
  }, (err, res) => {
    if (err) return cb({}, 'The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      /*rows.map((row) => {
        console.log(row);
      });*/
      cb(rows);
    } else {
      cb({}, 'No data found.');
    }
  });
}



module.exports = getResponses;