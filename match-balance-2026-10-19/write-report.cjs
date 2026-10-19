const fs=require('fs'),before=require('./before-matrix.json'),after=require('./matrix.json'),visualBefore=require('./before-matches.json'),visual=require('./matches.json');let text=`# 2. Lig maç zorluğu — 19 Ekim 2026

Üç gerçek ekonomik koşunun sezon başı/ortası/sonu kayıtları sabit tutuldu. Her kayıt yedi rakibin her biriyle 100 deterministik tohumda karşılaştırıldı: ayar öncesi 6.300, sonrası 6.300 kural maçı. Bu oranlar aynı kadronun o bölümde farklı rakiplerle karşılaşmasıdır; sezon şampiyonluk olasılığı değildir.

## Kural matrisi

| Kadro | Bölüm | Kadro OVR | Önce galibiyet | Sonra galibiyet |
|---|---|---:|---:|---:|
`;for(let i=0;i<after.length;i++){const b=before[i],a=after[i];text+=`| ${a.strategy} | ${a.phase} | ${a.ourOVR} | %${(b.winRate*100).toFixed(1)} | %${(a.winRate*100).toFixed(1)} |\n`;}
text+=`
## Ayar

Yalnızca 2. Lig rakiplerine ilk haftadan sonraki her tur için 0,8 ek özellik puanı, yuvarlanarak uygulanır. İlk tur değişmez; 8. turda +6, son turda +10 ek puan olur. Takımların mevcut güç farkları ve rol özellikleri korunur. BAL rakipleri ve oyuncu gelişim/maliyet kuralları değişmedi. Rakipler oyuncunun anlık gücüne göre ölçeklenmez.

## Gerçek animasyonlu motor

Aynı dokuz kayıt, üç rakip takım karşısında test edildi: önce 27, sonra 27 tam maç. Gerçek oyuncu istatistikleri, sahip olunan skiller ve kamp sayıları kullanıldı. Rakiplerin kamp sayıları maç hazırlığındaki (takım + oyuncu sırası) % 4 kuralını izledi. Oyuncu hareketleri ve top simülasyonu 60 Hz sabit adımlarla ilerletildi; bu, duvar saatiyle izleme veya fiziksel telefon testi değildir.

| Bölüm | Önce galibiyet | Sonra galibiyet |
|---|---:|---:|
`;for(const phase of ['start','middle','end']){const a=visual.filter(x=>x.phase===phase),b=visualBefore.filter(x=>x.phase===phase);text+=`| ${phase} | ${b.filter(x=>x.score[0]>x.score[1]).length}/${b.length} | ${a.filter(x=>x.score[0]>x.score[1]).length}/${a.length} |\n`;}
text+=`
27 maçın tamamı bitti. Konsol hatası yok; çizim işlemi maç durumunu değiştirmedi, oyuncu ışınlanma kontrolü geçti. 16 farklı skill görüldü; Legendary odak bitişi ve maç atlama kontrolü geçti. Küçük görsel örneklemden kesin kazanma olasılığı çıkarılmaz.

## Değerlendirme ve sınır

Sezon başı zaten mücadele istiyor. Güçlü kadrolar ilerleyen haftalarda avantajlı kalıyor; son bölümün önceki kadar rahat olmaması için küçük ve sabit bir artış yeterli göründü. Zayıf kadroyu da sürekli kaybettirecek büyük artış yapılmadı.

Bu çalışma sabit kayıtlarla önce/sonra maç karşılaştırmasıdır. Yeni zorlukla üç baştan sona ekonomik sezon tekrar oynanmadı; galibiyet ödülleri ve sezon sıralamasının toplam ilerlemeye etkisi sonraki tam koşuda doğrulanmalı. Temel kural matrisi tüm Legendary müdahalelerini içermez; görsel motor ayrı kontrol edildi.

Yeniden çalıştırma: proje kökünde node match-balance-2026-10-19/matrix.cjs ve node match-balance-2026-10-19/visual.cjs. Önceki JSON dosyaları karşılaştırma için tutulur.
`;fs.writeFileSync(__dirname+'/sonuc.md',text);
