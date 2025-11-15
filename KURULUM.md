# 🚀 Hızlı Kurulum Rehberi

Bu rehber, projeyi diğer bilgisayarlarda hızlıca çalıştırmak için hazırlanmıştır.

## 📋 Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- Git
- Visual Studio Code (önerilir)

## 🔧 Kurulum Adımları

### 1. Projeyi İndirin

```bash
git clone https://github.com/sefazor2525/atahan.git
cd atahan
```

### 2. Bağımlılıkları Yükleyin

**Ana uygulama için:**
```bash
cd uygulama
npm install
```

**Atahan uygulaması için:**
```bash
cd ../atahan
npm install
```

### 3. Projeyi Çalıştırın

**Ana uygulama:**
```bash
cd uygulama
npm start
```

**Atahan uygulaması:**
```bash
cd atahan
npm start
```

## 💻 Visual Studio Code ile Açma

1. Visual Studio Code'u açın
2. `File > Open Folder` menüsünden `atahan` klasörünü seçin
3. Terminal'de `npm install` komutlarını çalıştırın (yukarıdaki adımlara bakın)

## 🔄 Güncellemeleri Çekme

Projede yapılan değişiklikleri almak için:

```bash
git pull origin main
```

Her iki klasörde de `npm install` çalıştırın (yeni paketler eklenmişse).

## 📝 Notlar

- İlk kurulumda `node_modules` klasörleri oluşturulacaktır (biraz zaman alabilir)
- Her iki proje de bağımsız çalışır, ayrı terminal pencerelerinde çalıştırabilirsiniz

