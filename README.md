# Bir Gülümse Bağış Platformu

Bir Gülümse, bebek sahibi aileleri ellerindeki fazla eşyaları ihtiyacı olan ailelerle paylaşmaya teşvik eden sosyal fayda odaklı bir bağış platformudur. Projenin ilk sürümü web tabanlıdır ve Türkiye'deki kullanıcıların aşina olduğu ilan deneyimini kolay, güvenli ve erişilebilir biçimde sunmayı hedefler.

## Proje Amacı ve Kapsamı

Platformun temel hedefi, kullanılabilir durumdaki bebek ürünlerinin ihtiyaç sahibi ailelere ücretsiz ulaştırılmasını sağlamaktır. Bağış yapmak isteyenler ilan açarak ürünlerini listeler, ihtiyaç sahipleri kategorilere göre ilanları inceleyip bağışçılarla iletişime geçer. İlk fazda yalnızca web uygulaması geliştirilir; mobil uygulama ileriki aşamalara bırakılmıştır.

## Kullanıcı Rolleri ve Temel İşlevler

Platformda üç ana kullanıcı rolü bulunmaktadır: **Bağışçı**, **İhtiyaç Sahibi** ve **Admin**. Her rolün sistemdeki yetkileri aşağıda özetlenmiştir.

### Bağışçı (Donör)

- **Kayıt ve Profil**: Kullanıcılar kayıt olur, profil oluşturur; isterlerse anonim kalmayı seçebilirler.
- **İlan Oluşturma**: Fotoğraf, ürün adı/açıklaması, kategori, konum ve telefon numarası içeren ilanlar yayınlarlar.
- **İlan Yönetimi**: Verdikleri ilanları düzenleyebilir, silebilir veya "Bağış Gerçekleşti" olarak işaretleyebilirler.
- **Bağış Takibi**: Onaylanan bağışlar profil sayacına yansır; şimdiye kadar yapılan bağış sayısı görüntülenir.
- **Diğer İlanlar**: Platformdaki tüm ilanları inceleyebilir, gerekirse ihtiyaç sahibi gibi iletişime geçebilirler.

### İhtiyaç Sahibi (Bağış Alan)

- **Kayıt ve Giriş**: Kullanıcı hesabı oluşturur ve gerekirse anonim kalabilir.
- **Kategori İncelemesi**: Sekiz ana bebek ürünü kategorisi üzerinden filtreleme yapar.
- **İlan Listeleme ve Arama**: Konuma göre yakın ilanları veya belirli filtreleri (ör. ürün durumu) uygular.
- **İlan Detayı ve İletişim**: Fotoğraf, açıklama, konum, kategori ve bağışçının telefon bilgisine ulaşarak harici iletişim kurar.

### Admin (Yönetici)

- **Yönetim Paneli**: Toplam kullanıcı, aktif ilan, gerçekleşen bağış sayıları gibi metrikleri izler.
- **İlan Denetimi**: Uygunsuz ilanları kaldırma, düzenleme ve süre aşımı olanları pasifleştirme yetkisine sahiptir.
- **Kullanıcı Yönetimi**: Platform kurallarını ihlal eden kullanıcıları askıya alabilir veya yasaklayabilir.
- **Bağış Onayı**: Bağışçı "Bağışı Tamamladım" dediğinde doğrulama yapar, ilanı tamamlandı olarak işaretler ve bağış sayacını günceller.
- **Kategori & İçerik Yönetimi**: Kategori listelerini ve statik içerikleri (duyurular, SSS) günceller.

## Bebek Ürün Kategorileri

İlk sürümde sekiz ana kategori desteklenir:

1. **Giyim ve Tekstil Ürünleri** – Zıbın, tulum, battaniye vb.
2. **Oyuncaklar ve Kitaplar** – Peluş oyuncaklar, gelişim oyuncakları, hikâye kitapları.
3. **Bebek Mobilyaları ve Odası Eşyaları** – Beşik, park yatak, alt değiştirme masası.
4. **Bebek Arabaları ve Pusetler** – Baston puset, travel system arabalar.
5. **Oto Koltukları ve Taşıyıcılar** – Araç koltukları, ana kucakları, kanguru/sling.
6. **Beslenme ve Emzirme Ürünleri** – Biberon, mama sandalyesi, emzirme yastığı.
7. **Bebek Bezi ve Bakım/Hijyen Ürünleri** – Bez, ıslak mendil, bakım setleri.
8. **Güvenlik ve İzleme Cihazları** – Bebek telsizi, kamera, priz/dolap kilitleri.

Bu kategoriler sektördeki yaygın ihtiyaçlardan ve bebek bankası araştırmalarından derlenmiştir (örn. [Baby Bank Alliance](https://www.babybankalliance.org/), [SEO ve Dijital](https://seovedijital.com/)).

## Arayüz Tasarımı ve Kullanıcı Deneyimi

- **Genel Düzen**: Sahibinden.com benzeri sezgisel bir yapı; üst menü, kategori seçimi ve kart bazlı ilan listeleri.
- **Renk Paleti**: Sıcak sarı tonları ile beyaz/gri arka planlar; marka farklılığı için tonlarda uyarlanmış varyasyonlar.
- **Responsive Tasarım**: Mobil uyumlu, büyük butonlar ve okunabilir tipografi.
- **İlan Kartları**: Thumbnail, kısa açıklama, konum ve tarih bilgisi içerir.
- **Detay Sayfası**: Fotoğraf galerisi, açıklama, kategori, konum haritası ve iletişim numarası.
- **Anonimlik Göstergeleri**: İsim gizleyen bağışçılar için "İsimsiz Bağışçı" etiketi, benzer şekilde ihtiyaç sahipleri için de "İsimsiz İhtiyaç Sahibi".
- **İşlevsel Butonlar**: Bağışçı tarafında düzenle/sil/tamamlandı butonları; ihtiyaç sahibi tarafında telefon numarası gösterme aksiyonu.

## Konum Bilgisi ve Harita Entegrasyonu

- **Otomatik Konum**: Tarayıcıdan izin alınarak İl/İlçe/Mahalle otomatik doldurulur.
- **Manuel Giriş**: Konum izni reddedildiğinde hiyerarşik seçim (İl → İlçe → Mahalle) yapılır.
- **Harita Gösterimi**: Mahremiyeti koruyacak şekilde yaklaşık konum harita üzerinde gösterilir.
- **Konum Bazlı Filtreleme**: Gelecekte "Yakınımdaki ilanlar" gibi mesafe tabanlı aramalar desteklenebilir; bu nedenle koordinat bilgisi veritabanında saklanacaktır.

## Teknoloji Seçimleri ve Altyapı

### Backend

- **Supabase**: PostgreSQL tabanlı BaaS; kimlik doğrulama, dosya depolama, gerçek zamanlı veritabanı ve sunucusuz fonksiyonlar sağlar. Açık kaynak yapısı sayesinde vendor lock-in riski düşüktür.
- **Alternatifler**: Gerekirse Node.js + Express/NestJS ile özel backend veya Firebase gibi servisler değerlendirilebilir ancak geliştirme süresi artar.

### Frontend

- **Next.js (React)**: SSR/SSG desteği, SEO uyumu ve bileşen tabanlı yapı sunar.
- **UI Katmanı**: Tailwind CSS veya benzeri bir framework ile hızlı, responsive tasarım.
- **Supabase Entegrasyonu**: JavaScript SDK ile doğrudan iletişim; Row Level Security (RLS) ile veri yetkilendirmesi sağlanır.
- **Harita Kütüphaneleri**: Google Maps, Mapbox veya OpenStreetMap/Leaflet alternatifleri değerlendirilebilir.

### Admin Paneli

- Aynı Next.js kod tabanında /admin route'u üzerinden erişilebilir.
- Rol tabanlı erişim kontrolü ve gerekiyorsa 2FA gibi ek güvenlik önlemleri planlanır.

## Gizlilik ve Anonimlik

- **İsim Gizleme**: Kullanıcılar adlarını göstermemeyi seçebilir.
- **Telefon Maskesi**: Numara yalnızca giriş yapmış kullanıcılara kısmen gösterilir, "Göster" butonuyla tamamı açılır.
- **Konum Gizliliği**: Tam adres yerine yalnızca İl/İlçe/Mahalle paylaşılır; haritada yaklaşık konum kullanılır.
- **Veri Koruması**: KVKK kapsamında bilgilendirme ve veri güvenliği politikaları hazırlanır.

## Geleceğe Yönelik İyileştirmeler

- Platform içi mesajlaşma ve bildirimler.
- İhtiyaç sahipleri için talep ilanları.
- Bağış geri bildirimleri, teşekkür mesajları ve rozet sistemi.
- Harita üzerinde ilan keşfi, konum tabanlı sıralama.
- STK/belediye entegrasyonları.
- Mobil uygulamalar ve çok dillilik desteği.

## Sosyal Etki

Bir Gülümse, kullanılmayan bebek ürünlerinin yeniden değerlendirilmesini sağlayarak hem paylaşım ekonomisini destekler hem de zor durumdaki ailelere hızlı çözüm sunar. Topluluk geri bildirimleriyle evrilecek bu platform, her bağışta bir bebeğin gülümsemesine katkı sağlamayı amaçlar.
