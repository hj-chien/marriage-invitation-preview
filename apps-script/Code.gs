/*
 * Secure guestbook endpoint for the invitation website.
 *
 * Set these Script Properties before deploying as a web app:
 * - SHEET_ID: target Google Sheet ID
 * - TURNSTILE_SECRET_KEY: Cloudflare Turnstile secret key
 * - TURNSTILE_HOSTNAME: exact production hostname, for example invite.example.com
 */

const CONFIG = {
  sheetName: 'Wishes',
  timezone: 'Asia/Taipei',
  maxWishes: 100
};

function doGet() {
  try {
    const sheet = getSheet_();
    const rows = sheet.getDataRange().getValues().slice(1);
    const wishes = rows
      .slice(-CONFIG.maxWishes)
      .map(row => ({
        name: String(row[0] || '').trim(),
        wish: String(row[1] || '').trim(),
        time: String(row[2] || '').trim()
      }))
      .filter(isValidWish_);
    return json_({ ok: true, wishes });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, message: 'Unable to load wishes.' });
  }
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    if (String(payload.website || '').trim()) return json_({ ok: false, message: 'Rejected.' });

    const name = String(payload.name || '').trim();
    const wish = String(payload.wish || '').trim();
    if (!isValidWish_({ name, wish, time: 'pending' })) {
      return json_({ ok: false, message: 'Invalid wish.' });
    }
    if (!verifyTurnstile_(String(payload.turnstileToken || ''))) {
      return json_({ ok: false, message: 'Verification failed.' });
    }
    if (!allowSubmission_(name)) {
      return json_({ ok: false, message: 'Please wait before submitting another wish.' });
    }

    const time = Utilities.formatDate(new Date(), CONFIG.timezone, 'yyyy/MM/dd HH:mm');
    getSheet_().appendRow([name, wish, time]);
    return json_({ ok: true, wish: { name, wish, time } });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, message: 'Unable to save wish.' });
  }
}

function getSheet_() {
  const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!sheetId) throw new Error('Missing SHEET_ID Script Property.');
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheetByName(CONFIG.sheetName) || spreadsheet.insertSheet(CONFIG.sheetName);
  if (sheet.getLastRow() === 0) sheet.appendRow(['Name', 'Wish', 'Time']);
  return sheet;
}

function isValidWish_(wish) {
  return wish.name.length > 0 && wish.name.length <= 20 &&
    wish.wish.length > 0 && wish.wish.length <= 150 &&
    wish.time.length <= 40;
}

function verifyTurnstile_(token) {
  const properties = PropertiesService.getScriptProperties();
  const secret = properties.getProperty('TURNSTILE_SECRET_KEY');
  const expectedHostname = properties.getProperty('TURNSTILE_HOSTNAME');
  if (!token || !secret || !expectedHostname) return false;

  const response = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret, response: token },
    muteHttpExceptions: true
  });
  const result = JSON.parse(response.getContentText() || '{}');
  return result.success === true && result.hostname === expectedHostname && result.action === 'guestbook';
}

function allowSubmission_(name) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, name.toLowerCase());
  const key = `wish:${Utilities.base64EncodeWebSafe(digest).slice(0, 24)}`;
  const cache = CacheService.getScriptCache();
  if (cache.get(key)) return false;
  cache.put(key, '1', 60);
  return true;
}

function json_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
