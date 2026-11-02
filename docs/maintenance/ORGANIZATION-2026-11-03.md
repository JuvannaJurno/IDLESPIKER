# Dosya düzenlemesi — 3 Kasım 2026

Ana klasör 980 dosyadan 42 dosyaya indirildi. 2.055 dosya işlevine göre taşındı. Oyun ve laboratuvarların HTML adresleri yerinde kaldı; kod, test, üretim araçları ve geçmiş ölçümler ayrı klasörlere alındı. `README.md` güncel kullanım girişidir.

- JavaScript: `scripts/game/`; ortak menü parçaları `scripts/ui/`.
- CSS: `styles/game/` ve `styles/ui/`.
- 498 mevcut kontrol ve yeni giriş sayfası kontrolü: `tests/`.
- Üretim, ölçüm ve eski tek kullanımlık araçlar: `tools/` altındaki ayrı klasörler.
- Kaynak SVG'ler ve eski PNG'ler: `assets/sources/`.
- Eski ham paketler ve yanlışlıkla saç klasörünün içine kopyalanan ikinci karakter paketi: `archive/source-packs/`.
- Önceki raporlar: `audits/history/` ve `audits/legacy/`.

Aktif oyun görselleriyle üretim kaynakları aynı şey değildir. Eski PNG kaynakları fiziksel olarak taşındı, ancak kayıt dosyalarındaki `PNG/...` karakter kimlikleri korunur. Üretim araçları bu kimlikleri `tools/maintenance/source-files.cjs` üzerinden fiziksel dosyalara çevirir. Oyunun güncel portreleri SVG verilerinden çizilmeye devam eder.

1.069 taşınan görsel/ses/kaynak dosyasının baytları eski halleriyle aynı çıktı. Eksik taşıma hedefi yoktur. Mevcut assetler kalıcı olarak silinmedi; önceden kullanıcı tarafından silinen dosyalar geri getirilmedi. Testlerin eski Git sürümleriyle karşılaştırması da yeni dosya yollarından bağımsız korunur.

## Doğrulama

- 738 çalıştırılabilir kod/test/üretim dosyası: sözdizimi ve statik yerel modül yolları.
- Bütün ana HTML dosyaları: script ve stil yolları.
- 21 oyun/editör/laboratuvar girişi: tarayıcıda eksik istek ve JavaScript hatası yok.
- Önceki aşamalar: 9 ekonomi/kayıt ve 441 rakip örneği aynı.
- 1. Lig: fiyat/hat üretimi, akademi, kayıt yenileme, yedek seçimi, faaliyet ilerlemesi, tek seferlik ödül ve küçük/koyu ekran kontrolleri geçti.
- Karakterler: PNG okumadan 420 SVG parçasının yeniden üretimi, 100 rastgele görünüm, 300 aksesuar örneği ve maç içinde 21 poz/stil birleşimi geçti.

Bir eski `patch.js` düzenleme aracı daha önce de geçersiz sözdizimine sahipti. Oyunun parçası olmadığı doğrulandı ve çalıştırılabilir koddan ayrılarak `archive/legacy-code/patch.js.txt` biçiminde korundu. Eski tek kullanımlık araçların tamamının güncel oyunu yeniden üretebildiği iddia edilmez; normal asset komutu bunları çalıştırmaz.

Taşıma listesi: `file-moves.json`. Sayısal kontrol özeti: `organization-validation.json`. Tarayıcı sonuçları: `../../audits/project-layout-browser.json`.
