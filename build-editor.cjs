const fs = require('fs');
const source = fs.readFileSync('karakter-uretici.html', 'utf8');
const assets = JSON.parse(source.match(/const assets=(.*?);const cache=new Map\(\);/s)[1]);
const template = fs.readFileSync('editor-template.html.template', 'utf8');
const layout = JSON.parse(fs.readFileSync('onaylanan-yerlesim.json', 'utf8'));
let html = template.replace('__ASSETS__', JSON.stringify(assets)).replace('__LAYOUT__', JSON.stringify(layout.parts));
// Render the starting character into the file itself, before JavaScript runs.
const vm = require('vm');
const nodes = {};
class Node {
  constructor(tag = 'div') { this.tag = tag; this.attrs = {}; this.children = []; this.style = {}; this.classList = { toggle() {} }; }
  setAttribute(k,v) { this.attrs[k] = v; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  addEventListener() {}
}
const context = { atob, console, localStorage: { getItem() { return null; }, setItem() {} }, document: {
  getElementById(id) { return nodes[id] ??= new Node(); }, createElementNS(ns,tag) { return new Node(tag); },
  createElement(tag) { return new Node(tag); }, querySelectorAll() { return []; }, addEventListener() {}
} };
vm.createContext(context);
vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context);
vm.runInContext('validate(parts)', context);
const escape = x => String(x).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
function serialize(n) { return `<${n.tag} ${Object.entries(n.attrs).map(([k,v]) => `${k}="${escape(v)}"`).join(' ')}>${n.children.map(serialize).join('')}</${n.tag}>`; }
const character = nodes.pieces.children.map(serialize).join('');
if (nodes.pieces.children.length !== 23) throw Error('Initial character is incomplete');
html = html.replace('<g id="pieces"></g>', `<g id="pieces">${character}</g>`);
fs.writeFileSync('yerlesim-editoru.html', html);
fs.writeFileSync('editor-template.html', '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=yerlesim-editoru.html"><title>Karakter editörü</title><a href="yerlesim-editoru.html">Hazır karakteri düzenlemek için editörü aç</a>');
console.log('Editor built with', Object.keys(assets).length, 'embedded assets');
if (process.argv.includes('--test')) {
  context.assert = require('assert');
  context.expected = layout.parts;
  context.document.getElementById('faceAmount').value = '55';
  vm.runInContext(`
    assert.equal(JSON.stringify(parts),JSON.stringify(expected));
    const baseline=clone(parts);
    for(let run=0;run<200;run++){
      varyIdentity();varyFace();varyClothes();validate(parts);
      for(const p of parts.filter(p=>! /^(eye-|brow-|nose$|mouth$|hair$)/.test(p.id))){
        const b=baseline.find(x=>x.id===p.id),q=pivot(p),r=pivot(b);
        assert(Math.abs(q.x-r.x)<1e-7 && Math.abs(q.y-r.y)<1e-7);
        assert.equal(p.rotation,b.rotation);
      }
      assert.equal(byId('shirt').path.split('/')[2],byId('sleeve-left').path.split('/')[2]);
      assert.equal(byId('waist').path.split('/')[2],byId('pants-leg-left').path.split('/')[2]);
      assert.equal(byId('head').path.split('/')[2],byId('nose').path.split('/')[3]);
      assert.equal(parts.map(p=>p.id).join(),baseline.map(p=>p.id).join());
    }
    fresh();assert.equal(JSON.stringify(parts),JSON.stringify(expected));
    assert(!paths.some(p=>/Man8\\.png$/i.test(p)));
    for(const color of hairPalette){
      applyHairColor(color.value);varyFace();render();validate(parts);
      assert.equal(byId('hair').tint,color.value.startsWith('#')?color.value:undefined);
      if(color.value.startsWith('#')){
        assert(byId('hair').path.startsWith('PNG/Hair/Grey/'));
        assert.equal(byId('brow-left').tint,color.value);
        assert.equal($('hairFilters').children.length,3);
      }
    }
    fresh();
    record();varyFace();const edited=JSON.stringify(parts);$('undo').onclick();
    assert.equal(JSON.stringify(parts),JSON.stringify(expected));$('redo').onclick();
    assert.equal(JSON.stringify(parts),edited);
  `,context);
  console.log('PASS: exact imported layout, 200 variants with fixed body pivots and layers, matching colors, reset, undo/redo.');
}
