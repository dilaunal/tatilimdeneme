// Öneri ve şikayet yönetimi fonksiyonları

// Öneri/şikayet türleri
const feedbackTypes = {
    SUGGESTION: 'suggestion',
    COMPLAINT: 'complaint'
};

// Öneri/şikayet gönderme fonksiyonu
function submitFeedback(type, title, content, email = '') {
    const feedbackData = {
        type: type,
        title: title,
        content: content,
        email: email,
        date: new Date().toISOString(),
        status: 'pending' // pending, reviewed, resolved
    };

    return fetch('/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
    })
    .then(response => response.json())
    .then(data => {
        showFeedbackSuccess();
        return data;
    })
    .catch(error => {
        showFeedbackError();
        console.error('Öneri/şikayet gönderilirken hata oluştu:', error);
        throw error;
    });
}

// Öneri/şikayet formunu görüntüleme
function showFeedbackForm(type) {
    const formContainer = document.getElementById('feedback-form-container');
    formContainer.innerHTML = `
        <div class="feedback-form">
            <h3>${type === feedbackTypes.SUGGESTION ? 'Öneri' : 'Şikayet'} Gönder</h3>
            <form id="feedback-form" onsubmit="handleFeedbackSubmit(event, '${type}')">
                <div class="form-group">
                    <label for="feedback-title">Başlık</label>
                    <input type="text" id="feedback-title" required>
                </div>
                <div class="form-group">
                    <label for="feedback-content">İçerik</label>
                    <textarea id="feedback-content" rows="5" required></textarea>
                </div>
                <div class="form-group">
                    <label for="feedback-email">E-posta (İsteğe bağlı)</label>
                    <input type="email" id="feedback-email">
                </div>
                <button type="submit">Gönder</button>
                <button type="button" onclick="hideFeedbackForm()">İptal</button>
            </form>
        </div>
    `;
    formContainer.style.display = 'block';
}

// Öneri/şikayet formunu gizleme
function hideFeedbackForm() {
    const formContainer = document.getElementById('feedback-form-container');
    formContainer.style.display = 'none';
    formContainer.innerHTML = '';
}

// Form gönderimini işleme
function handleFeedbackSubmit(event, type) {
    event.preventDefault();
    
    const title = document.getElementById('feedback-title').value;
    const content = document.getElementById('feedback-content').value;
    const email = document.getElementById('feedback-email').value;

    submitFeedback(type, title, content, email)
        .then(() => {
            hideFeedbackForm();
        });
}

// Başarılı gönderim mesajı
function showFeedbackSuccess() {
    const messageContainer = document.getElementById('feedback-message');
    messageContainer.innerHTML = `
        <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            Öneri/şikayetiniz başarıyla gönderildi. En kısa sürede değerlendirilecektir.
        </div>
    `;
    messageContainer.style.display = 'block';
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

// Hata mesajı
function showFeedbackError() {
    const messageContainer = document.getElementById('feedback-message');
    messageContainer.innerHTML = `
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle"></i>
            Öneri/şikayet gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </div>
    `;
    messageContainer.style.display = 'block';
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

// Öneri/şikayet geçmişini görüntüleme
function displayFeedbackHistory() {
    fetch('/api/feedback/history')
        .then(response => response.json())
        .then(feedbackList => {
            const historyContainer = document.getElementById('feedback-history');
            
            if (feedbackList.length === 0) {
                historyContainer.innerHTML = '<p>Henüz öneri/şikayet gönderilmemiş.</p>';
                return;
            }

            const feedbackHTML = feedbackList.map(feedback => `
                <div class="feedback-item">
                    <div class="feedback-header">
                        <h4>${feedback.title}</h4>
                        <span class="feedback-date">${new Date(feedback.date).toLocaleDateString()}</span>
                        <span class="feedback-type ${feedback.type}">
                            ${feedback.type === feedbackTypes.SUGGESTION ? 'Öneri' : 'Şikayet'}
                        </span>
                        <span class="feedback-status ${feedback.status}">
                            ${getStatusText(feedback.status)}
                        </span>
                    </div>
                    <div class="feedback-content">${feedback.content}</div>
                    ${feedback.response ? `
                        <div class="feedback-response">
                            <strong>Yanıt:</strong>
                            <p>${feedback.response}</p>
                        </div>
                    ` : ''}
                </div>
            `).join('');

            historyContainer.innerHTML = feedbackHTML;
        })
        .catch(error => {
            console.error('Öneri/şikayet geçmişi alınırken hata oluştu:', error);
        });
}

// Durum metnini alma
function getStatusText(status) {
    switch (status) {
        case 'pending':
            return 'Beklemede';
        case 'reviewed':
            return 'İncelendi';
        case 'resolved':
            return 'Çözüldü';
        default:
            return status;
    }
}

// Sayfa yüklendiğinde öneri/şikayet geçmişini yükle
document.addEventListener('DOMContentLoaded', function() {
    displayFeedbackHistory();
}); 