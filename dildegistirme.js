// Dil değiştirme ve çoklu dil desteği fonksiyonları

// Dil çevirileri
const translations = {
    en: {
        // Genel
        'welcome': 'Welcome',
        'search': 'Search',
        'filter': 'Filter',
        'sort': 'Sort',
        'price': 'Price',
        'rating': 'Rating',
        'availability': 'Availability',
        'book_now': 'Book Now',
        'view_details': 'View Details',
        
        // Otel detayları
        'hotel_details': 'Hotel Details',
        'room_types': 'Room Types',
        'amenities': 'Amenities',
        'location': 'Location',
        'reviews': 'Reviews',
        'write_review': 'Write a Review',
        
        // Yorumlar
        'comments': 'Comments',
        'add_comment': 'Add Comment',
        'edit_comment': 'Edit Comment',
        'delete_comment': 'Delete Comment',
        'save': 'Save',
        'cancel': 'Cancel',
        
        // Form etiketleri
        'name': 'Name',
        'email': 'Email',
        'check_in': 'Check In',
        'check_out': 'Check Out',
        'guests': 'Guests',
        'submit': 'Submit'
    },
    tr: {
        // Genel
        'welcome': 'Hoş Geldiniz',
        'search': 'Ara',
        'filter': 'Filtrele',
        'sort': 'Sırala',
        'price': 'Fiyat',
        'rating': 'Değerlendirme',
        'availability': 'Müsaitlik',
        'book_now': 'Hemen Rezervasyon Yap',
        'view_details': 'Detayları Gör',
        
        // Otel detayları
        'hotel_details': 'Otel Detayları',
        'room_types': 'Oda Tipleri',
        'amenities': 'Olanaklar',
        'location': 'Konum',
        'reviews': 'Değerlendirmeler',
        'write_review': 'Değerlendirme Yaz',
        
        // Yorumlar
        'comments': 'Yorumlar',
        'add_comment': 'Yorum Ekle',
        'edit_comment': 'Yorumu Düzenle',
        'delete_comment': 'Yorumu Sil',
        'save': 'Kaydet',
        'cancel': 'İptal',
        
        // Form etiketleri
        'name': 'İsim',
        'email': 'E-posta',
        'check_in': 'Giriş Tarihi',
        'check_out': 'Çıkış Tarihi',
        'guests': 'Misafir Sayısı',
        'submit': 'Gönder'
    }
};

// Mevcut dil
let currentLanguage = localStorage.getItem('language') || 'tr';

// Dil değiştirme fonksiyonu
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updatePageContent();
}

// Sayfa içeriğini güncelleme
function updatePageContent() {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
}

// Dil seçeneklerini görüntüleme
function showLanguageOptions() {
    const languageMenu = document.getElementById('language-menu');
    if (languageMenu) {
        languageMenu.style.display = 'block';
    }
}

// Dil seçeneklerini gizleme
function hideLanguageOptions() {
    const languageMenu = document.getElementById('language-menu');
    if (languageMenu) {
        languageMenu.style.display = 'none';
    }
}

// Sayfa yüklendiğinde dil ayarlarını uygula
document.addEventListener('DOMContentLoaded', function() {
    // Dil değiştirme butonlarına event listener ekle
    const languageButtons = document.querySelectorAll('.language-button');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
            hideLanguageOptions();
        });
    });

    // Sayfa içeriğini mevcut dile göre güncelle
    updatePageContent();
}); 