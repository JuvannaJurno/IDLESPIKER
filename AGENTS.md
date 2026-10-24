# Proje çalışma notları

## Görsel tutarlılık

Arayüz, tema, tutorial, animasyon, aşama geçişi, portre, saha veya bileşen varyantı üzerinde çalışmadan önce [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) dosyasını oku. İlgili korunacak kararları ve tutarsızlık kayıtlarını uygula.

- Hata düzeltmesi sırasında görünüşü veya başka bir ekranın ölçüsünü kendiliğinden yeniden tasarlama.
- Aynı işlev için mevcut bileşen ailesini kullan; farklı özellik için yeni tutorial/karartma/geçiş sistemi üretme.
- Kullanıcının açık yeni kararı bu belgeden üstündür. Üretimde yaptığın tasarım değişikliğini, güncel görünüşünü ve doğrulamasını rehberde güncelle; reddedilmiş varyantları geri getirme.
- Rehberdeki açık tutarsızlıklar çözülmüş sayılmaz; değişiklik kapsamına girmeyenleri sırf listede var diye uygulama.
- Görsel alternatifler üretim onayı değildir. Mevcut gerçek portre ve kart anatomisini koru.

## Teknik referans

Çalışma deposu bu klasördür. JS/CSS değişikliğinden sonra `node version-assets.cjs` ile sürümlü asset referanslarını güncelle. Dokümantasyon değişikliklerinde buna gerek yok.

İlgili mevcut testleri seçerek doğrula. Görsel doğrulamayı yalnız testin PASS çıktısıyla eş tutma; gerçek ekran görüntüsünü de incele. Kullanıcının veya başka işin mevcut değişikliklerini geri alma.
