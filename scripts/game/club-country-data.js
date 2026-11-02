(function(root){'use strict';
const rows={
 "TR": [
  "Kadıköy|Çınar;Bostanlı|Martılar;Bahçelievler|Yıldız;Göztepe|Güneş;Kavaklı|Birlik;Çankaya|Akademi;Mudanya|File",
  "Marmara|Atletik;Ege|Yıldızları;Toros|Voleybol;Trakya|Birlik;Başkent|Akademi;Uludağ|Akademi;Karadeniz|Gücü",
  "Ankara|File;Uludağ|Akademi;Eskişehir|Voleybol;İstanbul|Voleybol;Başkent|Akademi;Antalya|Yıldızları;Karadeniz|Gücü"
 ],
 "IT": [
  "Trastevere|Ragazze;Navigli|Volley;San Paolo|Stelle;Prati|Insieme;Borgo|Giovani;Isola|Rete;San Marco|Aurora",
  "Bergamo|Stelle;Parma|Ducali;Trieste|Bora;Perugia|Grifoni;Verona|Arena;Modena|Gialloblù;Firenze|Gigli"
 ],
 "BR": [
  "Vila Madalena|Vôlei;Tijuca|Jovem;Pinheiros|Estrelas;Ipanema|Praia;Liberdade|União;Barra|Sol;Lapa|Meninas",
  "Recife|Maré;Campinas|Fênix;Curitiba|Araucárias;Niterói|Ondas;Fortaleza|Sol;Belém|Vitória;Santos|Sereias"
 ],
 "US": [
  "Brooklyn|Sparks;Sunset|Juniors;Lincoln Park|Owls;Eastside|Volley;Venice|Waves;Capitol Hill|Stars;Oakwood|Roots",
  "Portland|Pines;Denver|Peaks;Austin|Armadillos;Seattle|Rain;Phoenix|Firebirds;Boston|Harbor;San Diego|Surf"
 ],
 "JP": [
  "Shimokita|Volley;Koenji|Hoshi;Kichijoji|Sakura;Nishijin|Tsubasa;Tennoji|Junior;Motomachi|Minato;Yanaka|Neko",
  "Sendai|Tsubasa;Nagoya|Shachi;Kobe|Minato;Sapporo|Yukibana;Fukuoka|Hibari;Kyoto|Aoi;Yokohama|Seagulls"
 ],
 "CN": [
  "Haidian|Qingchun;Pudong|Xingguang;Yuexiu|Huaduo;Wuchang|Xiaoyan;Nanshan|Yangguang;Jinjiang|Xiaozhu;Gulou|Feiyu",
  "Suzhou|Silk;Qingdao|Seagulls;Chengdu|Pandas;Xiamen|Egret;Hangzhou|Lotus;Harbin|Snow;Nanjing|Phoenix"
 ],
 "PL": [
  "Mokotów|Młode;Praga|Siatka;Wrzeszcz|Fale;Żoliborz|Iskra;Jeżyce|Skrzydła;Kazimierz|Gwiazdy;Nadodrze|Razem",
  "Gdańsk|Fale;Lublin|Kozice;Poznań|Sokoły;Kraków|Smoki;Wrocław|Mosty;Łódź|Iskra;Toruń|Gwiazdy"
 ],
 "RS": [
  "Dorćol|Mladost;Vračar|Iskra;Zemun|Krila;Liman|Mreža;Palilula|Zvezdice;Detelinara|Sloga;Banovo Brdo|Volley",
  "Novi Sad|Dunav;Niš|Sokolice;Kragujevac|Šumadija;Subotica|Sever;Čačak|Morava;Kraljevo|Kruna;Užice|Zlatibor"
 ],
 "DO": [
  "Gazcue|Juvenil;Naco|Estrellas;Los Mina|Unión;Bella Vista|Voleibol;Cristo Rey|Fénix;Mirador|Jóvenes;Villa Juana|Sol",
  "Santiago|Reinas;La Vega|Montaña;Puerto Plata|Mar;San Pedro|Caña;La Romana|Corales;Higüey|Palmas;Bonao|Tormenta"
 ],
 "NL": [
  "De Pijp|Volley;Lombok|Jong;Kralingen|Sterren;Strijp|Vonk;Wittevrouwen|Samen;Oost|Meeuwen;Delfshaven|Netwerk",
  "Groningen|Uilen;Utrecht|Dom;Haarlem|Duinen;Nijmegen|Valken;Zwolle|Blauw;Leiden|Sleutels;Breda|Leeuwinnen"
 ],
 "DE": [
  "Kreuzberg|Juniors;Altona|Netz;Ehrenfeld|Funken;Schwabing|Sterne;Neustadt|Zusammen;Bilk|Volley;Nordend|Flügel",
  "Dresden|Elbe;Münster|Eulen;Potsdam|Adler;Freiburg|Füchse;Kiel|Möwen;Augsburg|Sterne;Bonn|Rhein"
 ],
 "CA": [
  "Kitsilano|Juniors;Plateau|Étoiles;Annex|Volley;Kensington|Owls;Westboro|Roots;Strathcona|Sparks;Limoilou|Ailes",
  "Halifax|Harbor;Ottawa|Owls;Kelowna|Peaks;Québec|Étoiles;Victoria|Orcas;Calgary|Chinook;Winnipeg|Prairie"
 ],
 "TH": [
  "Ari|Dao;Bang Rak|Volley;Lat Phrao|Young;Nimman|Nok;Talat Noi|Saeng;Dusit|Junior;Sathon|Rak",
  "Chiang Mai|Chang;Khon Kaen|Dok Khun;Phuket|Andaman;Nakhon Pathom|Chedi;Hat Yai|Tawan;Udon Thani|Lotus;Rayong|Marée"
 ],
 "FR": [
  "Belleville|Jeunes;Croix-Rousse|Volley;Wazemmes|Étoiles;Chartrons|Union;Batignolles|Ailes;Joliette|Soleil;Saint-Cyprien|Filet",
  "Nantes|Hermine;Tours|Lys;Montpellier|Flamants;Rouen|Vikings;Grenoble|Sommets;La Rochelle|Mouettes;Dijon|Duchesses"
 ],
 "BE": [
  "Ixelles|Étoiles;Borgerhout|Volley;Schaerbeek|Jeunes;Outremeuse|Union;Ledeberg|Vonk;Marolles|Ailes;Heverlee|Net",
  "Gent|Uilen;Namur|Hirondelles;Leuven|Leeuwinnen;Liège|Ardentes;Brugge|Zwanen;Mons|Dragons;Mechelen|Sterren"
 ],
 "CZ": [
  "Vinohrady|Mladé;Žižkov|Jiskra;Královo Pole|Síť;Poruba|Hvězdy;Letná|Křídla;Smíchov|Spolu;Líšeň|Volley",
  "Brno|Dračice;Olomouc|Sovy;Liberec|Ještěd;Plzeň|Jiskra;České Budějovice|Vltava;Zlín|Lišky;Hradec Králové|Lvice"
 ]
};
const motifs=['wave','star','peak','wing','crown','leaf','bolt'],palettes=['#3e777a','#59648f','#8a5869','#527e60','#9a7443','#537e98','#9a634a'];
function country(){return root.CountryRules?.current?.()||'TR'}
function teams(code=country(),stage=1){const data=rows[code]||rows.TR,entries=data[Math.min(stage-1,data.length-1)].split(';');return entries.map((s,i)=>{const [city,title]=s.split('|');return city+' '+title;});}
function identity(name,code=country()){const data=rows[code]||rows.TR;let slot=-1;for(const stage of data){const a=stage.split(';');const i=a.findIndex(s=>s.replace('|',' ')===name);if(i>=0){slot=i;break;}}if(slot<0)return null;const words=name.toLowerCase();let symbol=motifs[slot];if(/owl|uil|eulen|sovy/.test(words))symbol='owl';else if(/peak|monta|somm|ještěd|toros|uludağ/.test(words))symbol='peak';else if(/star|stelle|estrela|étoile|hoshi|yıldız|hvěz/.test(words))symbol='star';else if(/wave|maré|fale|ond|bora|surf|dunav|rhein|vltava/.test(words))symbol='wave';else if(/kruna|reinas|crown|duches/.test(words))symbol='crown';else if(/sokol|fal|adler|tsubasa|aile|kříd|krila/.test(words))symbol='wing';else if(/fire|fênix|phoenix|iskra|jiskra|vonk|funken/.test(words))symbol='flame';return {symbol,primary:palettes[slot],accent:'#f4d78f',shape:['shield','round','hex'][slot%3],pattern:['split','stripe','chevron'][slot%3],border:'double'};}
const api={teams,identity};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ClubCountryData=api;
})(globalThis);
