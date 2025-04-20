// Müsaitlik durumu görüntüleme fonksiyonları

// Otel müsaitlik durumunu kontrol etme fonksiyonu
function checkHotelAvailability(hotelId, checkInDate, checkOutDate) {
    // API'den müsaitlik durumunu kontrol et
    return fetch(`/api/hotels/${hotelId}/availability?checkIn=${checkInDate}&checkOut=${checkOutDate}`)
        .then(response => response.json())
        .then(data => {
            return data.available;
        })
        .catch(error => {
            console.error('Müsaitlik durumu kontrol edilirken hata oluştu:', error);
            return false;
        });
}

// Müsaitlik durumunu görüntüleme fonksiyonu
function displayAvailabilityStatus(hotelId, checkInDate, checkOutDate) {
    const availabilityContainer = document.getElementById('availability-status');
    
    checkHotelAvailability(hotelId, checkInDate, checkOutDate)
        .then(isAvailable => {
            if (isAvailable) {
                availabilityContainer.innerHTML = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i>
                        Seçilen tarihler için müsaitlik durumu: Müsait
                    </div>
                `;
            } else {
                availabilityContainer.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="fas fa-times-circle"></i>
                        Seçilen tarihler için müsaitlik durumu: Müsait değil
                    </div>
                `;
            }
        });
}

// Tarih değişikliğinde müsaitlik durumunu güncelleme
function updateAvailabilityOnDateChange() {
    const checkInInput = document.getElementById('check-in-date');
    const checkOutInput = document.getElementById('check-out-date');
    const hotelId = document.getElementById('hotel-id').value;

    if (checkInInput && checkOutInput && hotelId) {
        displayAvailabilityStatus(hotelId, checkInInput.value, checkOutInput.value);
    }
}

// Sayfa yüklendiğinde müsaitlik durumunu kontrol et
document.addEventListener('DOMContentLoaded', function() {
    const checkInInput = document.getElementById('check-in-date');
    const checkOutInput = document.getElementById('check-out-date');
    
    if (checkInInput && checkOutInput) {
        checkInInput.addEventListener('change', updateAvailabilityOnDateChange);
        checkOutInput.addEventListener('change', updateAvailabilityOnDateChange);
    }
}); 