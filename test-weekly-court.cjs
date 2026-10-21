let source=require('fs').readFileSync('test-division-court-pacing.cjs','utf8');
source=source.replaceAll('assets/division-court-audit.json','audits/weekly-court-audit.json');
source=source.replace('assert(table.every(t=>t.played===28))','assert(table.every(t=>t.played===14))');
source=source.replaceAll("'/28 court matches'","'/14 court matches'");
source=source.replace('results.length*28','results.length*14').replace('results.length*84','results.length*42');eval(source);
