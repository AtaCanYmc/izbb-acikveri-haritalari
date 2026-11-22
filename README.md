<div align="center">
  <a href="https://github.com/AtaCanYmc/izbb-acikveri-haritalari">
    <img src="docs/images/logo.svg" alt="İzmir Açık Veri Haritaları Logo" width="160" height="160" />
  </a>
  <br />
  <br />
</div>

# İzmir Açık Veri Haritaları

İzmir Büyükşehir Belediyesi Açık Veri Portalı API servislerini kullanarak 36 belediye veri kümesini Leaflet tabanlı etkileşimli haritalar üzerinde görselleştiren web uygulaması.

Canlı uygulama: [izmirharitalari.atacanymc.com.tr](https://izmirharitalari.atacanymc.com.tr/)

[![CI](https://github.com/AtaCanYmc/izbb-acikveri-haritalari/actions/workflows/quality.yml/badge.svg)](https://github.com/AtaCanYmc/izbb-acikveri-haritalari/actions/workflows/quality.yml)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)](https://web.dev/progressive-web-apps/)
[![Demo Video](https://img.shields.io/badge/YouTube-Tan%C4%B1t%C4%B1m%20Videosu-red.svg)](https://www.youtube.com/watch?v=BnCiBaFpaWs)

<div align="center">
  <a href="https://www.youtube.com/watch?v=BnCiBaFpaWs">
    <img src="docs/images/banner-atlas.jpg" alt="İzmir Veri Atlası: Tanıtım Videosunu İzle" width="100%" />
  </a>
  <p><a href="https://www.youtube.com/watch?v=BnCiBaFpaWs">Tanıtım Videosunu YouTube üzerinden izleyin</a></p>
</div>

---

## İçindekiler

- [Sistem Mimarisi](#sistem-mimarisi)
- [Ekran Görüntüleri](#ekran-görüntüleri)
- [Harita Kapsamı ve Veri Kümeleri](#harita-kapsamı-ve-veri-kümeleri)
- [Teknik Özellikler](#teknik-özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [Doğrulama ve Test](#doğrulama-ve-test)
- [CI/CD İş Akışı](#cicd-iş-akışı)
- [Veri Kaynağı ve Lisans](#veri-kaynağı-ve-lisans)
- [Katkıda Bulunma ve Yönetişim](#katkıda-bulunma-ve-yönetişim)

---

## Sistem Mimarisi

Uygulama, belediye açık veri servislerinden çekilen ham veriyi normalize ederek Leaflet işaretçi katmanlarına dönüştürür.

```mermaid
flowchart TD
    API["İzmir Açık Veri Portalı REST API"] --> Client["izmir-open-data-js SDK"]
    Client --> Normalizer["mapPointBuilders & Normalizer"]
    Normalizer --> Registry["Map Registry (36 Veri Kümesi)"]
    Registry --> State["React Application State"]
    State --> View["OpenDataMap (React Leaflet)"]
    State --> Cluster["Leaflet MarkerCluster Engine"]
    State --> Export["Veri Dışa Aktarımı (PNG, GeoJSON, CSV, JSON, HTML)"]
    Tiles["OpenStreetMap / CARTO Basemaps (Voyager & Dark)"] --> View
```

### Dizin Yapısı

```text
.
├── .github/workflows/          # CI (quality), GitHub Pages deploy, release-please, auto-merge
├── docs/images/                # README görselleri, ekran görüntüleri ve logo
├── public/                     # Statik varlıklar (CNAME, sitemap.xml, robots.txt, llms.txt, SVG)
└── src/
    ├── components/             # Ortak bileşenler (SEOMetadata, PwaInstallPrompt, DeveloperDocsModal, footer, mapIcons)
    ├── features/maps/
    │   ├── components/         # HomePage, OpenDataMap, OpenDataSidebar, SelectedPointCard, DownloadModal
    │   ├── config/             # mapRegistry.ts (36 katman tanımı)
    │   ├── hooks/              # useOpenDataMapPage, useLocationPermission, useMapQueryParam
    │   ├── pages/              # OpenDataMapPage.tsx
    │   ├── services/           # izmirOpenDataClient.ts, mapDataLoaders.ts
    │   ├── types/              # mapData.ts
    │   └── utils/              # categoryMeta, mapLinks, mapPointBuilders, mapTileConfig, searchUtils
    └── utils/                  # assetUtils.ts, dateUtils.ts, security.ts
```

---

## Ekran Görüntüleri

<div align="center">
  <img src="docs/images/open-data-showcase.jpg" alt="İzmir Açık Veri Harita Katmanları" width="48%" />
  &nbsp;
  <img src="docs/images/open-source-overview.jpg" alt="Açık Kaynak İzmir Harita Görünümü" width="48%" />
</div>

<br />

<div align="center">
  <img src="docs/images/home-page-example.png" alt="Ana Sayfa Görünümü" width="48%" />
  &nbsp;
  <img src="docs/images/eczane-map-example.png" alt="Nöbetçi Eczane Haritası Görünümü" width="48%" />
</div>

---

## Harita Kapsamı ve Veri Kümeleri

Uygulama toplam 36 bağımsız harita katmanını 8 ana kategoride sunar:

| Kategori | Katman Sayısı | Veri Kümeleri |
| --- | --- | --- |
| **Sağlık** | 5 | Nöbetçi Eczaneler, Tüm Eczaneler, Hastaneler, Aile Sağlığı Merkezleri, Veterinerlikler |
| **Ulaşım** | 4 | Otoparklar, Taksi Durakları, Tren Garları, Vapur İskeleleri |
| **Kültür ve Sanat** | 8 | Kütüphaneler, Kültür Merkezleri, Müzeler, Sinemalar, Tiyatrolar, Sergi Salonları, Senfoni Orkestrası, Opera ve Bale |
| **Tarihi Miras** | 7 | Antik Kentler, Antik Yapılar, Köşk ve Konaklar, Kule ve Heykeller, Tarihi Çarşı ve Hanlar, Tarihi Su Yapıları, Tarihi Yapılar |
| **Rekreasyon** | 4 | Plajlar, Hamamlar, Kaplıcalar, Fuar Alanları |
| **Eğitim** | 3 | Üniversiteler, Liseler, Anaokulları |
| **Kamu ve Hizmet** | 3 | Muhtarlıklar, İzBB Hizmet Noktaları, Semt Pazarları |
| **Altyapı ve Acil Durum** | 2 | WiZmirNET Ücretsiz İnternet Noktaları, Afet Toplanma Alanları |

---

## Teknik Özellikler

- **İşaretçi Gruplama:** Yoğun koordinat kümelerinde `leaflet.markercluster` ile istemci taraflı performans optimizasyonu.
- **Dinamik Karo Katmanı:** Açık ve koyu tema geçişine duyarlı CARTO raster karo entegrasyonu.
- **Kullanıcı Konumu:** Tarayıcı Geolocation API üzerinden anlık koordinat tespiti ve yarıçap odaklaması.
- **Arama ve Filtreleme:** İlçe, mahalle ve mekan adına göre istemci tarafında anlık veri filtreleme.
- **Veri Dışa Aktarma:** Seçili harita verilerini PNG ekran görüntüsü, GeoJSON, CSV, JSON veya tek dosyalık çevrimdışı HTML harita formatında indirme.
- **PWA Desteği:** `vite-plugin-pwa` ile çevrimdışı önbellekleme ve mobil cihazlara doğrudan kurulabilirlik.

---

## Teknoloji Yığını

- **Çekirdek:** React 19, TypeScript 5.9, Vite 7
- **Harita Kütüphaneleri:** Leaflet 1.9, React-Leaflet 5, Leaflet MarkerCluster 1.5
- **Stil ve Arayüz:** Tailwind CSS v4, Lucide React
- **Veri Sağlayıcı:** `izmir-open-data-js`
- **Test ve Tip Kontrolü:** Vitest 5.1, ESLint 9, TypeScript `tsc`

---

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 22.x
- npm 10 veya üzeri

### Kurulum Adımları

```bash
# 1. Depoyu klonlayın
git clone https://github.com/AtaCanYmc/izbb-acikveri-haritalari.git
cd izbb-acikveri-haritalari

# 2. Bağımlılıkları yükleyin
npm install

# 3. Ortam değişkenlerini yapılandırın
cp .env.example .env

# 4. Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama yerel olarak `http://localhost:5173` adresinde çalışır.

---

## Ortam Değişkenleri

Uygulama varsayılan olarak herhangi bir API anahtarı gerektirmeden ücretsiz **OpenStreetMap** katmanını kullanır. CARTO Basemaps (Voyager ve Dark) tema katmanlarını etkinleştirmek için isteğe bağlı olarak `VITE_CARTO_API_KEY` tanımlanabilir.

| Değişken | Tip | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `VITE_CARTO_API_KEY` | String | Hayır (Opsiyonel) | [CARTO Basemaps](https://carto.com/basemaps/apikey) API anahtarı. Belirtilmezse ücretsiz OpenStreetMap kullanılır. |

Örnek `.env` dosyası:

```env
# İsteğe bağlı CARTO anahtarı (boş bırakılırsa OpenStreetMap kullanılır)
VITE_CARTO_API_KEY=your_carto_api_key_here
```

---

## Doğrulama ve Test

Proje Vitest ile yazılmış birim testleri ve TypeScript tip kontrolleri içerir.

```bash
# Kod stili ve ESLint denetimi
npm run lint

# TypeScript derleyici tip kontrolü
npm run type-check

# Birim testlerini tek seferlik çalıştır
npm test -- --run

# Üretim derlemesi oluştur
npm run build
```

---

## CI/CD İş Akışı

GitHub Actions üzerinde çalışan otomatik iş akışları:

1. **Code Quality (`.github/workflows/quality.yml`):**
   - Her `push` ve `pull_request` tetiklemesinde çalışır.
   - ESLint, TypeScript `type-check`, Vitest birim testleri ve üretim derleme adımlarını doğrular.

2. **Deploy (`.github/workflows/deploy.yml`):**
   - `main` dalına birleştirilen değişikliklerde derleme çıktısını otomatik olarak GitHub Pages ortamına dağıtır.

3. **Release Please (`.github/workflows/release-please.yml`):**
   - Conventional Commits mesajlarını analiz ederek otomatik SemVer sürüm artırımı, `CHANGELOG.md` güncellemesi ve sürüm çekme istekleri (Release PR) oluşturur; PR birleştirildiğinde GitHub Release ve git etiketi yayınlar.

4. **Owner Auto-Merge (`.github/workflows/owner-auto-merge.yml`):**
   - Depo sahibine ait çekme isteklerini tüm CI kontrolleri başarıyla tamamlandığında otomatik olarak birleştirir.

---

## Veri Kaynağı ve Lisans

Harita verileri [İzmir Büyükşehir Belediyesi Açık Veri Portalı](https://acikveri.bizizmir.com) üzerinden sağlanmaktadır. Veriler portalın açık veri politikalarına ve CC BY 4.0 lisansına tabidir.

Uygulama kaynak kodları **Apache License 2.0** kapsamında lisanslanmıştır. Detaylı bilgi için [LICENSE.md](LICENSE.md) dosyasını inceleyebilirsiniz.

---

## Katkıda Bulunma ve Yönetişim

- Katkı kuralları, dal adlandırma ve Conventional Commits formatı için [CONTRIBUTING.md](CONTRIBUTING.md) belgesini okuyun.
- Güvenlik açığı bildirim süreci ve yanıt süreleri için [SECURITY.md](SECURITY.md) politikasını inceleyin.
- Gelecek planları ve teknik hedefler için [ROADMAP.md](ROADMAP.md) belgesine göz atın.
