import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseRoute, routeHref, contentPath } from '../src/routing.js';

const data=JSON.parse(readFileSync(new URL('../src/content.json',import.meta.url),'utf8'));
test('language switches preserve the page and query parameters',()=>{
  const paths=['/','/catalog','/services','/order','/ru/pages/15.html','/ru/tours/57/','/ru/tours/806/','/ru/photo/425/','/ru/photo/','/ru/map/'];
  for(const path of paths){
    const params=new URLSearchParams({type:'winter',q:'Karakol',tour:'/ru/tours/57/'});
    for(const lang of ['en','ru']){
      const parsed=parseRoute(routeHref(path,lang,params));
      assert.equal(parsed.path,path);assert.equal(parsed.lang,lang);assert.equal(parsed.params.toString(),params.toString());
    }
  }
});
test('all visible catalogue and service links have an English content page',()=>{
  for(const item of [...data.catalog,...data.nav])assert.ok(data.pages[contentPath(item.path,'en')],item.path);
});
test('English content has no untranslated Cyrillic text or titles',()=>{
  for(const [path,page] of Object.entries(data.pages)){
    if(!path.startsWith('/en/'))continue;
    const visible=page.html.replace(/<[^>]*>/g,'');
    assert.doesNotMatch(page.title+visible,/[А-Яа-яЁё]/,path);
    for(const card of page.cards)assert.doesNotMatch(card.title+card.description,/[А-Яа-яЁё]/,path);
  }
});
test('decorative arrows, counters and imported editor metadata are removed',()=>{
  const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
  assert.doesNotMatch(source,/[↗↖↘↙↑↓←→]|card-number|service-num|hero-index|terrain-label|padStart/);
  for(const [path,page] of Object.entries(data.pages))assert.doesNotMatch(page.html,/data-(?:path-to-node|index-in-node)|[↗↖↘↙↑↓←→]/,path);
});
