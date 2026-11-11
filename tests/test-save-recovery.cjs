const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
class Storage {
 constructor() { this.data = new Map(); this.failBackup = false; }
 getItem(key) { return this.data.get(key) ?? null; }
 setItem(key, value) {
  if (this.failBackup && key.endsWith('-backup')) throw Error('Quota');
  if (this.failPrimaryWithBackup && this.data.has(key + '-backup')) throw Error('Quota');
  this.data.set(key, String(value));
 }
 removeItem(key) { this.data.delete(key); }
}
const localStorage = new Storage();
const sessionStorage = new Storage();
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../scripts/game/save-recovery.js'), 'utf8'), { Storage, window: { localStorage } });
const key = 'idle-spiker-rooms-v2';
localStorage.setItem(key, '{"ap":100}');
localStorage.setItem(key, '{"ap":200}');
assert.equal(localStorage.getItem(key), '{"ap":200}');
localStorage.data.set(key, '{broken');
assert.equal(localStorage.getItem(key), '{"ap":100}');
assert.equal(localStorage.data.get(key), '{"ap":100}');
localStorage.removeItem(key);
assert.equal(localStorage.getItem(key), '{"ap":100}');
localStorage.failBackup = true;
localStorage.setItem(key, '{"ap":300}');
assert.equal(localStorage.getItem(key), '{"ap":300}', 'backup failure must not block primary save');
localStorage.failBackup = false;
localStorage.failPrimaryWithBackup = true;
localStorage.setItem(key, '{"ap":400}');
assert.equal(localStorage.getItem(key), '{"ap":400}', 'reclaim backup space before retrying primary save');
sessionStorage.setItem(key, 'temporary');
assert.equal(sessionStorage.getItem(key), 'temporary');
localStorage.setItem('unrelated', 'text');
assert.equal(localStorage.getItem('unrelated'), 'text');
localStorage.removeItem(key);
localStorage.removeItem(key + '-backup');
assert.equal(localStorage.getItem(key), null, 'explicit reset clears backup and primary');
console.log('PASS previous valid save recovery, missing/corrupt primary, quota fallback, unrelated storage and explicit reset');
