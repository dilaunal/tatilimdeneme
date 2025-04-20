// Yorum yapabilme ve yönetme fonksiyonları

// Yorum ekleme fonksiyonu
function addComment(hotelId, userId, commentText, rating) {
    const commentData = {
        hotelId: hotelId,
        userId: userId,
        comment: commentText,
        rating: rating,
        date: new Date().toISOString()
    };

    return fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Yorum eklenirken hata oluştu:', error);
        throw error;
    });
}

// Yorumları getirme fonksiyonu
function getComments(hotelId) {
    return fetch(`/api/comments?hotelId=${hotelId}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Yorumlar alınırken hata oluştu:', error);
            return [];
        });
}

// Yorum görüntüleme fonksiyonu
function displayComments(hotelId) {
    const commentsContainer = document.getElementById('comments-container');
    
    getComments(hotelId)
        .then(comments => {
            if (comments.length === 0) {
                commentsContainer.innerHTML = '<p>Henüz yorum yapılmamış.</p>';
                return;
            }

            const commentsHTML = comments.map(comment => `
                <div class="comment-card">
                    <div class="comment-header">
                        <span class="user-name">${comment.userName}</span>
                        <span class="comment-date">${new Date(comment.date).toLocaleDateString()}</span>
                        <div class="rating">
                            ${generateStarRating(comment.rating)}
                        </div>
                    </div>
                    <div class="comment-text">${comment.comment}</div>
                    ${comment.userId === currentUserId ? `
                        <div class="comment-actions">
                            <button onclick="editComment('${comment.id}')">Düzenle</button>
                            <button onclick="deleteComment('${comment.id}')">Sil</button>
                        </div>
                    ` : ''}
                </div>
            `).join('');

            commentsContainer.innerHTML = commentsHTML;
        });
}

// Yıldız derecelendirme oluşturma fonksiyonu
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'filled' : ''}"></i>`;
    }
    return stars;
}

// Yorum düzenleme fonksiyonu
function editComment(commentId) {
    const comment = document.querySelector(`[data-comment-id="${commentId}"]`);
    const currentText = comment.querySelector('.comment-text').textContent;
    
    comment.innerHTML = `
        <textarea class="edit-comment-text">${currentText}</textarea>
        <div class="edit-actions">
            <button onclick="saveEdit('${commentId}')">Kaydet</button>
            <button onclick="cancelEdit('${commentId}')">İptal</button>
        </div>
    `;
}

// Yorum silme fonksiyonu
function deleteComment(commentId) {
    if (confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
        fetch(`/api/comments/${commentId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                displayComments(currentHotelId);
            }
        })
        .catch(error => {
            console.error('Yorum silinirken hata oluştu:', error);
        });
    }
}

// Yorum formunu görüntüleme
function showCommentForm() {
    const commentForm = document.getElementById('comment-form');
    commentForm.style.display = 'block';
}

// Yorum formunu gizleme
function hideCommentForm() {
    const commentForm = document.getElementById('comment-form');
    commentForm.style.display = 'none';
}

// Sayfa yüklendiğinde yorumları yükle
document.addEventListener('DOMContentLoaded', function() {
    const hotelId = document.getElementById('hotel-id').value;
    if (hotelId) {
        displayComments(hotelId);
    }
}); 