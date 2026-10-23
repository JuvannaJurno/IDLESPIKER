# Legendary önizleme ve Ulusal 2. Lig görsel gelişim

- Legendary açılışları artık `skill-animation-lab.html` veya iç içe laboratuvar iframe'leri yüklemiyor. Ayrı `legendary-preview.html` ve `legendary-showcase.js`, ortak native karakter/poz çizicisini kullanıyor.
- 11 yetenek için kısa ve deterministik saha gösterimi var. Oyuncunun adı, teni, saçı ve forması kendi görünümünden geliyor. SVG parçaları başta çözülüp önbelleğe alınıyor; sahne tek requestAnimationFrame döngüsünde ilerliyor. Arka plan bir kez çiziliyor. Diyalog yumuşak açılıp kapanıyor; kapatma, sekmeyi gizleme ve yeni önizleme başlatma eski döngüyü durduruyor.
- Tam hareketli 10 sahnede yaklaşık 3,6 saniyelik ölçümlerde en uzun kare aralığı yaklaşık 17 ms. Sky Ball otomatik kapanana kadar oynatıldı. Bu sonuçlar test bilgisayarındaki Edge ölçümleridir; her cihaz için performans garantisi değildir.
- Azaltılmış hareket tercihinde sabit bir örnek kare gösterilip otomatik kapanıyor. Önizleme hazır olduktan sonra tekrar açılışta laboratuvar veya yeni frame yüklenmiyor.
- Ulusal 2. Lig'de kullanılan özgün departman resimleri korunuyor; gelişim süsleri üstlerine ayrı SVG katmanı olarak ekleniyor. Beşinci departmanın gelişimi gerçek sosyal medya blok seviyelerinden okunuyor. Oyuncu çerçevesi/gelişim izi daha yüksek OVR aralıklarına da uzatıldı.

Doğrulama:
- `test-legendary-unlock-preview.cjs`: bütün 11 yetenek, temas sonrası da oynatma, laboratuvara ağ isteği olmaması, iç frame olmaması, oyuncu kimliği, otomatik/elle kapatma, döngü temizliği ve azaltılmış hareket geçti.
- `test-progression-visuals.cjs`: Bölgesel ve Ulusal Lig, beş özgün ulusal resmin korunması, beş departmanın görsel gelişimi, ulusal ek özellik açılışı, kart AP harcaması, mobil/masaüstü, yenilemede kalıcılık geçti.
- `test-camp-skill-rewards-browser.cjs`: gerçek üç kamp → Uncommon/Rare/Legendary açılışları → yeni önizleme → kapanış akışı geçti; tekrar ödül penceresi oluşmadı.

Ölçümler: `audits/legendary-showcase-performance.json`.
