# Character vector sources

The six files in `Vector/` are the supplied Kenney vector sheets. `Spritesheet/*.xml` supplies original part names and native pixel sizes; its rectangles refer to the PNG atlas, **not** the SVG coordinates. They must not be used directly as SVG crop rectangles.

`parts/` contains extracted, path-only SVGs with the original native width/height. Their viewBoxes were matched to the vector sheets and checked against the former raster bundle. The original skin/clothing colors are retained. `character-layout.json` preserves the approved layouts and dimensions. These are the canonical editable/build sources; they do not depend on the former root `PNG/` directory.

Build:

```
node build-character-vectors.cjs
node sync-character-vector-embeds.cjs
node build-women-assets.cjs
node version-assets.cjs
```

`build-team-data.cjs` delegates to the same vector build. The generated bundle embeds SVGs so file:// play, portrait coloring, masks and Canvas remain origin-clean without asynchronous external piece requests. Saved paths beginning with `PNG/` are stable **logical IDs**, not fetch URLs. Renaming them would break existing saved appearances, so they intentionally remain.

`Profile/` contains six female and seven male hair choices. Only the profile editor sets `appearance.profileHair`; TeamAppearance.generate and the transfer, opponent and academy pools never set it. Man8 is an isolated sideburn piece and is not offered as a standalone hairstyle. Player bodies and gameplay animation transforms are unchanged. The game already uses the approved native vector rig for live action; this migration replaces the old raster portrait/reference parts without rebuilding those animations.

Verification: `test-character-vectors.cjs` compares all 420 sources against commit 4fcbaef's raster bundle, including native silhouette and color error. Thin, antialiased face elements differ slightly at pixel boundaries and are checked separately. `test-character-vector-integration.cjs` blocks every `/PNG/` request while checking creation, both genders, every style, save/reload, widths 320/390/1440, 2,000 female player generations and a loaded native match.
- Son entegrasyon kontrolü karakter-uretici, uc-parca-editoru ve yerlesim-editoru ekranlarını da PNG istekleri engelliyken açtı; gömülü bütün karakter kaynakları SVG, tarayıcı hatası yok. Erkek model seçimi kaydedilip yenilendi; 13 saçın tamamı çözümlendi ve katalog görseli incelendi. Tam ekran ayar/maç yerleşim testi de geçti.

Profile follow-up: the random appearance button alternates female/male hair in the profile only. All eight body styles and colors remain available in the profile editor through profileBody. Random male profiles avoid the female-cut 4/8, while manual customization stays unrestricted.

Player generation uses playerBodyModels [1], excluding pocket/zipper/collar/chest-detail variants 2/3/4/5/6/7/8 in all colors. The style derives from the existing appearance with no extra RNG calls. Existing saved faces/accessories and reserved characters are not regenerated. Only the approved native shirt part changes on newly generated players; profileBody/profileHair are never copied to players. Approved player sources preserve collar shading; the live match rig and gameplay math stay intact.

Body coordinates keep the approved torso top and shoulder/waist center. Profile hair clips use the visible hairstyle coordinates. Eye scales, facial transforms, jewelry, glasses, marks, stickers, nose strip, clips and gradients retain their existing generation. Tests: test-vector-accessory-preservation.cjs, test-profile-body-models.cjs, test-character-vector-integration.cjs and test-character-vector-build.cjs.

29 October exception: native Man3 (textured short) and Man7 (smooth open forehead) may now appear on roster players at half the weight of each normal hair style. Other male hairstyles stay profile-only. Optional hairSides is portrait-only; both short models use the existing short native match hair.
