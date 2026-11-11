/* Keep the previous valid JSON before replacing a core save. */
(function () {
 'use strict';
 const keys = new Set(['idle-spiker-rooms-v2', 'idle-spiker-women-v1', 'idle-spiker-team-v1', 'idle-spiker-league-v1', 'idle-spiker-main-menu-v1', 'idle-spiker-profile-v1']);
 let storage;
 try { storage = window.localStorage; } catch { return; }
 const nativeGet = Storage.prototype.getItem;
 const nativeSet = Storage.prototype.setItem;
 const nativeRemove = Storage.prototype.removeItem;
 function valid(value) {
  if (!value) return false;
  try { const parsed = JSON.parse(value); return parsed !== null && typeof parsed === 'object'; } catch { return false; }
 }
 Storage.prototype.getItem = function (key) {
  const value = nativeGet.call(this, key);
  if (this !== storage || !keys.has(key) || valid(value)) return value;
  const backup = nativeGet.call(this, key + '-backup');
  if (!valid(backup)) return value;
  try { nativeSet.call(this, key, backup); } catch {}
  return backup;
 };
 Storage.prototype.setItem = function (key, value) {
  let backupWritten = false;
  if (this === storage && keys.has(key)) {
   const previous = nativeGet.call(this, key);
   if (valid(previous) && previous !== String(value)) {
    try { nativeSet.call(this, key + '-backup', previous); backupWritten = true; } catch {}
   }
  }
  try { return nativeSet.call(this, key, value); }
  catch (error) {
   if (!backupWritten) throw error;
   nativeRemove.call(this, key + '-backup');
   return nativeSet.call(this, key, value);
  }
 };
})();
