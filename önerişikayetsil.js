// Öneri ve şikayet silme yönetimi fonksiyonları

// Öneri/şikayet silme fonksiyonu
function deleteFeedback(feedbackId) {
    if (!confirm('Bu öneri/şikayeti silmek istediğinizden emin misiniz?')) {
        return;
    }

    return fetch(`/api/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    .then(response => {
        if (response.ok) {
            showDeleteSuccess();
            refreshFeedbackList();
        } else {
            showDeleteError();
        }
    })
    .catch(error => {
        console.error('Öneri/şikayet silinirken hata oluştu:', error);
        showDeleteError();
    });
}

// Toplu silme fonksiyonu
function deleteMultipleFeedbacks(feedbackIds) {
    if (!feedbackIds.length) {
        showNoSelectionError();
        return;
    }

    if (!confirm(`${feedbackIds.length} adet öneri/şikayeti silmek istediğinizden emin misiniz?`)) {
        return;
    }

    return fetch('/api/feedback/bulk-delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ ids: feedbackIds })
    })
    .then(response => {
        if (response.ok) {
            showBulkDeleteSuccess(feedbackIds.length);
            refreshFeedbackList();
        } else {
            showDeleteError();
        }
    })
    .catch(error => {
        console.error('Toplu silme işlemi sırasında hata oluştu:', error);
        showDeleteError();
    });
}

// Öneri/şikayet listesini yenileme
function refreshFeedbackList() {
    const feedbackList = document.getElementById('feedback-list');
    if (feedbackList) {
        fetch('/api/feedback/admin', {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        })
        .then(response => response.json())
        .then(feedbacks => {
            feedbackList.innerHTML = generateFeedbackListHTML(feedbacks);
            initializeCheckboxes();
        })
        .catch(error => {
            console.error('Öneri/şikayet listesi alınırken hata oluştu:', error);
        });
    }
}

// Öneri/şikayet listesi HTML oluşturma
function generateFeedbackListHTML(feedbacks) {
    return `
        <table class="feedback-table">
            <thead>
                <tr>
                    <th><input type="checkbox" id="select-all"></th>
                    <th>Başlık</th>
                    <th>Tür</th>
                    <th>Gönderen</th>
                    <th>Tarih</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody>
                ${feedbacks.map(feedback => `
                    <tr>
                        <td><input type="checkbox" class="feedback-checkbox" value="${feedback.id}"></td>
                        <td>${feedback.title}</td>
                        <td>${feedback.type === 'suggestion' ? 'Öneri' : 'Şikayet'}</td>
                        <td>${feedback.email || 'Anonim'}</td>
                        <td>${new Date(feedback.date).toLocaleDateString()}</td>
                        <td>${getStatusBadge(feedback.status)}</td>
                        <td>
                            <button onclick="viewFeedback(${feedback.id})" class="btn-view">Görüntüle</button>
                            <button onclick="deleteFeedback(${feedback.id})" class="btn-delete">Sil</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Durum rozeti oluşturma
function getStatusBadge(status) {
    const statusClasses = {
        'pending': 'badge-warning',
        'reviewed': 'badge-info',
        'resolved': 'badge-success'
    };
    
    const statusTexts = {
        'pending': 'Beklemede',
        'reviewed': 'İncelendi',
        'resolved': 'Çözüldü'
    };

    return `<span class="badge ${statusClasses[status]}">${statusTexts[status]}</span>`;
}

// Checkbox'ları başlatma
function initializeCheckboxes() {
    const selectAll = document.getElementById('select-all');
    const checkboxes = document.querySelectorAll('.feedback-checkbox');

    if (selectAll) {
        selectAll.addEventListener('change', function() {
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

// Başarılı silme mesajı
function showDeleteSuccess() {
    showMessage('Öneri/şikayet başarıyla silindi.', 'success');
}

// Toplu silme başarı mesajı
function showBulkDeleteSuccess(count) {
    showMessage(`${count} adet öneri/şikayet başarıyla silindi.`, 'success');
}

// Silme hatası mesajı
function showDeleteError() {
    showMessage('Öneri/şikayet silinirken bir hata oluştu.', 'error');
}

// Seçim hatası mesajı
function showNoSelectionError() {
    showMessage('Lütfen silmek istediğiniz öneri/şikayetleri seçin.', 'warning');
}

// Genel mesaj gösterme fonksiyonu
function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = `
        <div class="alert alert-${type}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        </div>
    `;
    messageContainer.style.display = 'block';
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

// Yetkilendirme token'ını alma
function getAuthToken() {
    return localStorage.getItem('adminToken');
}

// Sayfa yüklendiğinde listeyi yenile
document.addEventListener('DOMContentLoaded', function() {
    refreshFeedbackList();
}); 