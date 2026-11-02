# IdleSpiker

Oyunu `index.html` ile açabilirsin. Tasarım laboratuvarlarının HTML adresleri korunmuştur.

## Klasörler

| Klasör | İçerik |
|---|---|
| `scripts/game/` | Oyun ve laboratuvarların paylaştığı JavaScript dosyaları |
| `scripts/ui/` | Ortak menü davranışları |
| `styles/game/`, `styles/ui/` | Görünüm dosyaları |
| `assets/` | Görseller, sesler ve üretilmiş medya |
| `assets/sources/` | Yeniden üretim için tutulan karakter ve çizim kaynakları |
| `archive/source-packs/` | Eski ham paketler ve fazladan iç içe kopyalanmış kaynaklar |
| `archive/unused-assets/` | Bağımlılığı bulunmayan, geri alınabilir şekilde ayrılmış dosyalar |
| `tests/` | Otomatik kontroller |
| `tools/build/` | Asset üretimi ve sürümleme araçları |
| `tools/audits/` | Ölçüm ve simülasyon araçları |
| `tools/legacy/` | Eski tek kullanımlık düzenleme araçları; normal derlemenin parçası değildir |
| `audits/` | Kontrol sonuçları ve karşılaştırma kayıtları |
| `docs/` | Planlar ve teknik notlar |

`AGENTS.md` ve `DESIGN-SYSTEM.md` ana klasörde kalır. Görünüm değiştirmeden önce okunmalıdır.

## Komutlar

Proje klasöründe çalıştır:

```sh
node tools/dev-server.cjs
node tools/build/version-assets.cjs
node tools/maintenance/check-project.cjs
node tools/maintenance/check-project.cjs --rules
node tests/test-project-layout-browser.cjs
```

İlk komut oyunu `http://127.0.0.1:4173` adresinden sunar. Kontrollerin tarayıcı bölümü mevcut geliştirme ortamındaki Playwright ve Edge'i kullanır. Oyun için bağımlılık yüklemek veya paketleme işlemi yapmak gerekmez. npm bulunan bir ortamda aynı komutların `package.json` kısayolları da kullanılabilir; npm zorunlu değildir.

Tek kontrol örneği: `node tests/test-media-block-placement.cjs`.

## Korunan kayıtlar

Karakterlerin `PNG/...` biçimindeki kayıt kimlikleri değişmemiştir. Eski PNG kaynakları `assets/sources/legacy-png/` içindedir; üretim araçları bunları `tools/maintenance/source-files.cjs` ile çözer. Oyuncuların güncel görünümü gömülü SVG parçalarından çizilir.

Dosya taşımaları `docs/maintenance/file-moves.json` içindedir. Arşiv bir klasör düzenlemesidir; dosyalar kalıcı olarak silinmemiştir. Eski araçları topluca çalıştırma: bazıları önceki tasarımları yeniden üretir.
