# 🗺️ İzmir Açık Veri Haritaları

> İzmir Büyükşehir Belediyesi'nin açık verilerini interaktif haritalar üzerinde keşfedin. 37 farklı harita ile şehrin sağlık, ulaşım, kültür, tarih ve daha birçok önemli lokasyonunu görüntüleyin.

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange.svg)
![License](https://img.shields.io/github/license/AtaCanYmc/izmir-nobetci-eczane-haritasi)
![Maps Count](https://img.shields.io/badge/Haritalar-36-blue)
![Tests](https://img.shields.io/badge/Tests-43%2B-green)

## 🎯 Genel Bakış

İzmir Açık Veri Haritaları, İzmir Büyükşehir Belediyesi'nin açık veri API'lerini kullanarak, şehrin çeşitli kategorilerindeki önemli yerlerini etkileşimli haritalar üzerinde sunmaktadır.

Başlangıçta sadece nöbetçi eczane haritası olan bu proje, artık **36 farklı harita** ile genişletilmiştir.

## 🗺️ Harita Kategorileri

### Sağlık (5 harita)
Nöbetçi Eczaneler, Tüm Eczaneler, Hastaneler, Aile Sağlığı Merkezleri, Veterinerlikler

### Ulaşım (4 harita)
Otoparklar, Taksi Duraklari, Tren Garları, Vapur İskeleri

### Kültür (8 harita)
Kütüphaneler, Kültür Merkezleri, Opera ve Bale, Galeriler, Senfoni Orkestrası, Sinemalar, Tiyatrolar, Müzeler

### Tarih (7 harita)
Antik Kentler, Antik Yapılar, Köşk ve Konaklar, Kule/Anıt/Heykeller, Tarihi Çarşı ve Hanlar, Tarihi Su Yapıları, Tarihi Yapılar

### Diğer Kategoriler
- Rekreasyon (4): Plajlar, Hamamlar, Kaplıcalar, Fuar Alanları
- Eğitim (3): Üniversiteler, Liseler, Anaokulları
- Yönetim (1): Muhtarlıklar
- Belediye (1): İzBB Hizmet Noktaları
- Yaşam (1): Semt Pazarları
- Dijital (1): WiZmirNET Noktaları
- Afet (1): Afet Toplanma Alanları

## ✨ Öne Çıkan Özellikler

### 🗺️ Harita Özellikleri
- **36 Etkileşimli Harita** - Kategorilere göre organize edilmiş
- **Marker Clustering** - Yoğun konumlarda otomatik gruplama
- **Canlı Konum Takibi** - Mevcut konumunuzu harita üzerinde görün
- **Hızlı Filtreleme** - Mekan adı, ilçe veya mahalle bazlı arama
- **Direkt Erişim** - Telefon numaraları tıklanabilir, Google Haritalar entegrasyonu

### 🎨 Kullanıcı Arayüzü
- **Light/Dark Mode** - Tam desteği ile gece ve gündüz rahat kullanım
- **Responsive Tasarım** - Tüm cihazlarda kusursuz görünüm
- **Modern UI** - Tailwind CSS v4 ile geliştirilmiş
- **Smooth Animations** - Akıcı kullanıcı deneyimi

### 📱 Progressive Web App (PWA)
- **Kurulum** - Uygulamayı cihazınıza ekleyin
- **Offline Çalışma** - Service Worker ile çevrimdışı desteği
- **Push Notifications** - Bildirim desteği
- **Install Prompt** - iOS ve Android'de kurulum rehberi

### 🧪 Kalite Güvence
- **Unit Testler** - Vitest ile 43+ test
- **TypeScript** - Tam tip güvenliği
- **ESLint** - Kod kalitesi kontrolü
- **CI/CD Pipeline** - Otomatik test ve deployment

### 📥 Harita İndirme
- **Çoklu Format** - PNG, JSON, CSV, GeoJSON formatlarında indir
- **Kolay Paylaşım** - Harita verilerini aktar
- **Batch İndirme** - Tüm harita noktalarını bir dosyaya indir

## 🛠️ Teknoloji Yığını

### Frontend
- React 18, TypeScript, Vite
- Tailwind CSS v4, React Leaflet
- Leaflet Marker Cluster

### Testing & Quality
- Vitest (Unit Testing)
- ESLint, TypeScript Type Checking
- PWA Plugin

### APIs & Data
- izmir-open-data-js
- OpenStreetMap
- Google Maps

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar

```bash
# Projeyi klonla
git clone https://github.com/AtaCanYmc/izbb-acikveri-haritalari.git
cd izbb-acikveri-haritalari

# Bağımlılıkları yükle
npm install

# Development sunucusunu başlat
npm run dev

# Build oluştur
npm run build

# Testleri çalıştır
npm test
```

### Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Development sunucusunu başlat |
| `npm run build` | Production build oluştur |
| `npm run preview` | Build'i yerel olarak önizle |
| `npm run lint` | Kod kalitesini kontrol et |
| `npm run lint-fix` | Linting sorunlarını düzelt |
| `npm run format` | Kodu formatla |
| `npm test` | Unit testleri çalıştır |
| `npm test -- --run` | Testleri tek kez çalıştır |
| `npm run type-check` | TypeScript checking |

## 🔄 CI/CD Pipeline

Proje GitHub Actions ile otomatik olarak test edilip GitHub Pages'e deploy edilmektedir.

### Pipeline Akışı

#### 1. Code Quality Workflow (`quality.yml`)
Her push ve pull request'te çalışır:
- ✅ **ESLint** - Kod kalitesi kontrolü
- ✅ **TypeScript** - Type checking
- ✅ **Unit Tests** - 43+ test çalıştırılır
- ✅ **Build Check** - Production build test edilir

#### 2. Deploy Workflow (`deploy.yml`)
Main/master branch'e push edildiğinde:
- ✅ Bağımlılıkları yükle
- ✅ Linting, type check, test çalıştır
- ✅ Production build oluştur
- ✅ GitHub Pages'e otomatik deploy

### Workflow Dosyaları

```
.github/workflows/
├── quality.yml    # Kod kalitesi kontrolleri
└── deploy.yml     # Build ve deployment
```

### GitHub Pages Konfigürasyonu

Repo settings'de yapılması gerekenler:

1. **Pages Settings**
   - Source: `GitHub Actions`
   - Branch: Otomatik (deploy workflow kullanıyor)

2. **Environments**
   - `github-pages` environment'ı otomatik oluşturuluyor

### Deployment Durumu

GitHub repository'de Actions sekmesinden pipeline durumunu takip edebilirsiniz:
- 🟢 **Success:** Kod başarıyla deploy edildi
- 🔴 **Failed:** Bir adım başarısız oldu (kontrol et)
- 🟡 **In Progress:** Şu anda çalışıyor

## 🧪 Testler

Proje **43+ unit test** ile test edilmektedir:

```bash
# Tüm testleri çalıştır
npm test -- --run

# Coverage raporu oluştur
npm test -- --coverage
```

### Test Kapsamı
- ✅ **dateUtils:** Tarih formatı dönüşümleri (8 test)
- ✅ **mapLinks:** Google Maps ve tel: URL'leri (11 test)
- ✅ **mapPointBuilders:** Harita noktası oluşturma (14 test)
- ✅ **Basic Tests:** Framework testleri (3 test)
- ✅ **İstatistikler:** 43+ test, %100 geçme oranı

## 📊 Proje İstatistikleri

- **📝 36 Harita** - Farklı kategorilerde
- **🧪 43+ Test** - Unit testler
- **🎨 10+ Kategori** - Harita kategorileri
- **🌐 1000+ Veri Noktası** - Toplam harita konumu
- **📱 Responsive** - Tüm cihazlar desteklenir
- **♿ Accessible** - WCAG uyumlu

## 🔄 Veri Güncellemeleri

Tüm harita verileri doğrudan İzmir Açık Veri Portalı API'larından çekilmektedir. Veriler otomatik olarak güncellenmiş haldedir.

**Veri Kaynağı:** [acikveri.bizizmir.com](https://acikveri.bizizmir.com)

## 🤝 Katkı Sağlama

Katkılarınız hoşnut karşılanmaktadır! Lütfen:

1. Projeyi fork'la
2. Özellik branch'i oluştur
3. Değişiklikleri commit et
4. Branch'e push et
5. Pull Request oluştur

### Geliştirme Kuralları
- TypeScript kullanılmalı
- Testler yazılmalı
- ESLint kurallarına uyulmalı
- Commit mesajları açıklayıcı olmalı

## 📄 Lisans

Bu proje MIT Lisansı altında dağıtılmaktadır. Detaylar için [LICENSE.md](LICENSE.md) dosyasına bakın.

## 👨‍💻 Geliştirici

**Ata Can Yaymacı**
- [GitHub](https://github.com/AtaCanYmc)
- [LinkedIn](https://www.linkedin.com/in/ata-can-yaymacı/)

## 📚 İlgili Linkler

- 🌐 [Canlı Demo](https://atacanyaymaclı.github.io/izbb-acikveri-haritalari)
- 📖 [İzmir Açık Veri Portalı](https://acikveri.bizizmir.com)
- 🐙 [GitHub Repository](https://github.com/AtaCanYmc/izbb-acikveri-haritalari)
- 📦 [npm: izmir-open-data-js](https://www.npmjs.com/package/izmir-open-data-js)

## ⭐ Destekle

Eğer bu proje faydalı olduysa, lütfen GitHub'da yıldız (⭐) vermeyi unutmayın!

---

<p align="center">
  <strong>İzmir 🇹🇷</strong>
</p>

