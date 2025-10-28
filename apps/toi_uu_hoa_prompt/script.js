document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const promptTextarea = document.getElementById('prompt');
    const optimizeBtn = document.getElementById('optimizeBtn');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const vietnamesePre = document.getElementById('optimizedVietnamese');
    const englishPre = document.getElementById('optimizedEnglish');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const themeSwitch = document.getElementById('theme-switch');

    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    }

    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }

    // Theme toggle functionality
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // Save API key to localStorage
    saveApiKeyBtn.addEventListener('click', function() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('geminiApiKey', apiKey);
            alert('API Key đã được lưu!');
        } else {
            alert('Vui lòng nhập API Key!');
        }
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.remove('hidden');
        });
    });

    // Copy functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn') || e.target.closest('.copy-btn')) {
            const copyBtn = e.target.classList.contains('copy-btn') ? e.target : e.target.closest('.copy-btn');
            const target = copyBtn.getAttribute('data-target');
            const textElement = document.getElementById('optimized' + target.charAt(0).toUpperCase() + target.slice(1));
            const textToCopy = textElement.textContent;

            copyToClipboard(textToCopy).then(() => {
                // Success feedback
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<span class="copy-icon">✅</span> Đã sao chép!';

                // Reset after 2 seconds
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<span class="copy-icon">📋</span> Sao chép';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback for older browsers
                fallbackCopyTextToClipboard(textToCopy);
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<span class="copy-icon">✅</span> Đã sao chép!';

                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<span class="copy-icon">📋</span> Sao chép';
                }, 2000);
            });
        }
    });

    // Modern clipboard API
    async function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            return fallbackCopyTextToClipboard(text);
        }
    }

    // Fallback method for older browsers
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        return new Promise((resolve, reject) => {
            if (document.execCommand('copy')) {
                resolve();
            } else {
                reject(new Error('Fallback copy failed'));
            }
            document.body.removeChild(textArea);
        });
    }

    // Optimize prompt
    optimizeBtn.addEventListener('click', async function() {
        const apiKey = apiKeyInput.value.trim();
        const prompt = promptTextarea.value.trim();

        if (!apiKey) {
            showError('Vui lòng nhập và lưu API Key trước!');
            return;
        }

        if (!prompt) {
            showError('Vui lòng nhập prompt cần tối ưu hóa!');
            return;
        }

        showLoadingOverlay();
        hideError();
        hideResult();

        try {
            const optimizedPrompts = await optimizePrompt(apiKey, prompt);
            displayResult(optimizedPrompts);
        } catch (error) {
            showError('Có lỗi xảy ra: ' + error.message);
        } finally {
            hideLoadingOverlay();
        }
    });

    async function optimizePrompt(apiKey, originalPrompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const instruction = `Bạn là chuyên gia Prompt Engineering cấp cao với hơn 10 năm kinh nghiệm. Nhiệm vụ của bạn là phân tích và tối ưu hóa prompt một cách chuyên nghiệp.

Đầu tiên, hãy phân tích kỹ prompt gốc theo các tiêu chí sau:
1. **Context**: Có đủ thông tin nền không?
2. **Clarity**: Có rõ ràng, dễ hiểu không?
3. **Specificity**: Có cụ thể, chi tiết không?
4. **Actionability**: Có hướng dẫn rõ ràng để thực hiện không?
5. **Completeness**: Có đầy đủ các thành phần cần thiết không?

Sau đó, tối ưu hóa prompt bằng cách:
- Bổ sung thông tin thiếu
- Làm rõ các điểm mơ hồ
- Cải thiện cấu trúc và logic
- Thêm các kỹ thuật prompt engineering phù hợp (role, few-shot, COT nếu cần)
- Đảm bảo prompt hiệu quả và chuyên nghiệp

Cuối cùng, trả về 2 phiên bản prompt tối ưu:
- Phiên bản tiếng Việt
- Phiên bản tiếng Anh

YÊU CẦU QUAN TRỌNG: Chỉ trả về prompt tối ưu cuối cùng, KHÔNG giải thích hay phân tích gì thêm.

Format đầu ra chính xác:
===TIẾNG VIỆT===
[prompt tối ưu bằng tiếng Việt]

===TIẾNG ANH===
[prompt tối ưu bằng tiếng Anh]

Prompt gốc cần tối ưu hóa: "${originalPrompt}"`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: instruction
                }]
            }],
            generationConfig: {
                temperature: 0.3,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            if (response.status === 400) {
                throw new Error('❌ API Key không hợp lệ hoặc bị thiếu. Vui lòng kiểm tra lại API key của bạn.');
            } else if (response.status === 403) {
                throw new Error('🚫 Quyền truy cập bị từ chối. API key của bạn có thể không có quyền sử dụng Gemini API.');
            } else if (response.status === 429) {
                throw new Error('⏰ Quá nhiều yêu cầu. Bạn đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau.');
            } else if (response.status === 500) {
                throw new Error('🔧 Lỗi máy chủ. Dịch vụ Gemini API đang gặp sự cố. Vui lòng thử lại sau.');
            } else if (response.status === 503) {
                throw new Error('⚠️ Dịch vụ không khả dụng. Gemini API đang bảo trì. Vui lòng thử lại sau.');
            } else {
                throw new Error(`🔌 Lỗi kết nối: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0]) {
            throw new Error('📝 Không thể tạo prompt. Vui lòng thử lại với nội dung khác.');
        }

        if (!data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
            throw new Error('📝 Không thể tạo prompt. AI không trả về kết quả hợp lệ.');
        }

        // Check for blocked content
        if (data.candidates[0].finishReason === 'SAFETY') {
            throw new Error('🚫 Nội dung bị chặn. Prompt của bạn có thể vi phạm chính sách sử dụng của AI.');
        }

        // Check for other finish reasons
        if (data.candidates[0].finishReason === 'RECITATION') {
            throw new Error('📚 Nội dung bị lặp lại. Vui lòng thử với prompt khác.');
        }

        if (data.candidates[0].finishReason === 'LENGTH') {
            throw new Error('📏 Nội dung quá dài. Vui lòng thử với prompt ngắn hơn.');
        }

        const text = data.candidates[0].content.parts[0].text;

        // Parse the response to extract Vietnamese and English versions
        const vietnameseMatch = text.match(/===TIẾNG VIỆT===\s*(.*?)(?====TIẾNG ANH===|$)/s);
        const englishMatch = text.match(/===TIẾNG ANH===\s*(.*?)$/s);

        return {
            vietnamese: vietnameseMatch ? vietnameseMatch[1].trim() : text,
            english: englishMatch ? englishMatch[1].trim() : text
        };
    }

    function displayResult(prompts) {
        vietnamesePre.textContent = prompts.vietnamese;
        englishPre.textContent = prompts.english;
        resultDiv.classList.remove('hidden');
    }

    function showLoading() {
        loadingDiv.classList.remove('hidden');
    }

    function hideLoading() {
        loadingDiv.classList.add('hidden');
    }

    function showLoadingOverlay() {
        document.getElementById('loading-overlay').classList.remove('hidden');
    }

    function hideLoadingOverlay() {
        document.getElementById('loading-overlay').classList.add('hidden');
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    function hideError() {
        errorDiv.classList.add('hidden');
    }

    function hideResult() {
        resultDiv.classList.add('hidden');
    }

    // History Management
    const historyList = document.getElementById('history-list');
    const historyCount = document.getElementById('history-count');
    const historySearch = document.getElementById('history-search');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const saveToHistoryBtn = document.getElementById('saveToHistoryBtn');

    // Load history on page load
    loadHistory();

    // Save to history
    saveToHistoryBtn.addEventListener('click', function() {
        const vietnameseText = document.getElementById('optimizedVietnamese').textContent;
        const englishText = document.getElementById('optimizedEnglish').textContent;
        const originalPrompt = document.getElementById('prompt').value;

        if (!vietnameseText || !englishText) {
            alert('Không có kết quả để lưu!');
            return;
        }

        const historyItem = {
            id: Date.now(),
            originalPrompt: originalPrompt,
            vietnameseResult: vietnameseText,
            englishResult: englishText,
            timestamp: new Date().toISOString(),
            title: generateTitle(vietnameseText) // Use optimized prompt for title
        };

        saveHistoryItem(historyItem);
        loadHistory();

        // Visual feedback
        saveToHistoryBtn.classList.add('saved');
        saveToHistoryBtn.innerHTML = '<span class="save-icon">✅</span> Đã lưu!';
        setTimeout(() => {
            saveToHistoryBtn.classList.remove('saved');
            saveToHistoryBtn.innerHTML = '<span class="save-icon">💾</span> Lưu vào lịch sử';
        }, 2000);
    });

    // Search history
    historySearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterHistory(searchTerm);
    });

    // Clear all history
    clearHistoryBtn.addEventListener('click', function() {
        if (confirm('Bạn có chắc muốn xóa tất cả lịch sử?')) {
            localStorage.removeItem('promptHistory');
            loadHistory();
        }
    });

    // History functions
    function saveHistoryItem(item) {
        const history = getHistory();
        history.unshift(item); // Add to beginning

        // Limit to 50 items to prevent localStorage overflow
        if (history.length > 50) {
            history.splice(50);
        }

        localStorage.setItem('promptHistory', JSON.stringify(history));
    }

    function getHistory() {
        const history = localStorage.getItem('promptHistory');
        return history ? JSON.parse(history) : [];
    }

    function loadHistory() {
        const history = getHistory();
        historyList.innerHTML = '';

        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="empty-history">
                    <div class="empty-icon">📝</div>
                    <h3>Chưa có lịch sử</h3>
                    <p>Hãy tối ưu hóa prompt đầu tiên của bạn!</p>
                </div>
            `;
            historyCount.textContent = '(0/50)';
            return;
        }

        historyCount.textContent = `(${history.length}/50)`;

        history.forEach(item => {
            const historyItem = createHistoryItem(item);
            historyList.appendChild(historyItem);
        });
    }

    function createHistoryItem(item) {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="history-item-header">
                <div class="title-container">
                    <h4 class="history-item-title" data-id="${item.id}">${item.title}</h4>
                    <button class="edit-title-btn" onclick="editTitle('${item.id}')" title="Chỉnh sửa tiêu đề">
                        ✏️
                    </button>
                </div>
                <span class="history-item-date">${formatDate(item.timestamp)}</span>
            </div>
            <div class="history-item-preview">${item.vietnameseResult.substring(0, 100)}${item.vietnameseResult.length > 100 ? '...' : ''}</div>
            <div class="history-item-actions">
                <button class="history-item-btn copy-btn" onclick="copyHistoryItem('${item.id}')">
                    📋 Sao chép
                </button>
                <button class="history-item-btn delete-btn" onclick="deleteHistoryItem('${item.id}')">
                    🗑️ Xóa
                </button>
            </div>
        `;
        return div;
    }

    function generateTitle(prompt) {
        // Generate a meaningful title from the prompt
        const words = prompt.split(' ').slice(0, 5).join(' ');
        return words.length > 30 ? words.substring(0, 30) + '...' : words;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Vừa xong';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)} ngày trước`;

        return date.toLocaleDateString('vi-VN');
    }

    function filterHistory(searchTerm) {
        const history = getHistory();
        const filtered = history.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.originalPrompt.toLowerCase().includes(searchTerm) ||
            item.vietnameseResult.toLowerCase().includes(searchTerm) ||
            item.englishResult.toLowerCase().includes(searchTerm)
        );

        historyList.innerHTML = '';

        if (filtered.length === 0) {
            historyList.innerHTML = `
                <div class="empty-history">
                    <div class="empty-icon">🔍</div>
                    <h3>Không tìm thấy</h3>
                    <p>Thử tìm với từ khóa khác</p>
                </div>
            `;
            return;
        }

        filtered.forEach(item => {
            const historyItem = createHistoryItem(item);
            historyList.appendChild(historyItem);
        });
    }

    // Global functions for onclick handlers
    window.copyHistoryItem = async function(id) {
        const history = getHistory();
        const item = history.find(h => h.id == id);

        if (item) {
            const textToCopy = item.vietnameseResult; // Copy the optimized Vietnamese prompt

            try {
                // Try modern clipboard API first
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    // Fallback to older method
                    await fallbackCopyTextToClipboard(textToCopy);
                }

                // Visual feedback
                const btn = event.target.closest('.copy-btn');
                if (btn) {
                    btn.innerHTML = '✅ Đã sao chép!';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        btn.innerHTML = '📋 Sao chép';
                        btn.classList.remove('copied');
                    }, 2000);
                }
            } catch (err) {
                console.error('Failed to copy: ', err);
                // Try fallback method
                try {
                    await fallbackCopyTextToClipboard(textToCopy);
                    const btn = event.target.closest('.copy-btn');
                    if (btn) {
                        btn.innerHTML = '✅ Đã sao chép!';
                        btn.classList.add('copied');
                        setTimeout(() => {
                            btn.innerHTML = '📋 Sao chép';
                            btn.classList.remove('copied');
                        }, 2000);
                    }
                } catch (fallbackErr) {
                    console.error('Fallback copy also failed: ', fallbackErr);
                    // Last resort: show the text in a temporary textarea for manual copy
                    showManualCopyDialog(textToCopy);
                }
            }
        }
    };

    window.editTitle = function(id) {
        const titleElement = document.querySelector(`.history-item-title[data-id="${id}"]`);
        const editBtn = titleElement.nextElementSibling;

        if (!titleElement || !editBtn) return;

        const currentTitle = titleElement.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentTitle;
        input.className = 'title-edit-input';
        input.maxLength = 50;

        // Replace title with input
        titleElement.parentNode.replaceChild(input, titleElement);

        // Change edit button to save button
        editBtn.innerHTML = '✅';
        editBtn.onclick = () => saveTitle(id, input);
        editBtn.title = 'Lưu tiêu đề';

        // Focus and select all text
        input.focus();
        input.select();

        // Handle Enter key
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveTitle(id, input);
            }
        });

        // Handle Escape key
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                cancelEdit(id, currentTitle);
            }
        });
    };

    function saveTitle(id, input) {
        const newTitle = input.value.trim();
        if (!newTitle) {
            alert('Tiêu đề không được để trống!');
            input.focus();
            return;
        }

        // Update in localStorage
        const history = getHistory();
        const item = history.find(h => h.id == id);
        if (item) {
            item.title = newTitle;
            localStorage.setItem('promptHistory', JSON.stringify(history));
        }

        // Update UI
        const titleElement = document.createElement('h4');
        titleElement.className = 'history-item-title';
        titleElement.setAttribute('data-id', id);
        titleElement.textContent = newTitle;

        input.parentNode.replaceChild(titleElement, input);

        // Reset edit button
        const editBtn = titleElement.nextElementSibling;
        if (editBtn) {
            editBtn.innerHTML = '✏️';
            editBtn.onclick = () => editTitle(id);
            editBtn.title = 'Chỉnh sửa tiêu đề';
        }
    }

    function cancelEdit(id, originalTitle) {
        const input = document.querySelector(`.title-edit-input`);
        if (!input) return;

        const titleElement = document.createElement('h4');
        titleElement.className = 'history-item-title';
        titleElement.setAttribute('data-id', id);
        titleElement.textContent = originalTitle;

        input.parentNode.replaceChild(titleElement, input);

        // Reset edit button
        const editBtn = titleElement.nextElementSibling;
        if (editBtn) {
            editBtn.innerHTML = '✏️';
            editBtn.onclick = () => editTitle(id);
            editBtn.title = 'Chỉnh sửa tiêu đề';
        }
    }

    window.deleteHistoryItem = function(id) {
        if (confirm('Bạn có chắc muốn xóa item này?')) {
            const history = getHistory();
            const filtered = history.filter(h => h.id != id);
            localStorage.setItem('promptHistory', JSON.stringify(filtered));
            loadHistory();
        }
    };

    // Export to TXT file
    window.exportToTxt = function(language) {
        const elementId = language === 'vietnamese' ? 'optimizedVietnamese' : 'optimizedEnglish';
        const textElement = document.getElementById(elementId);

        if (!textElement || !textElement.textContent.trim()) {
            alert('Không có nội dung để xuất!');
            return;
        }

        const content = textElement.textContent.trim();
        const languageName = language === 'vietnamese' ? 'Tieng-Viet' : 'English';
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `prompt-toi-uu-${languageName}-${timestamp}.txt`;

        // Create header for the file
        const header = `=====================================
PROMPT TỐI ƯU HÓA - ${languageName.toUpperCase()}
Xuất ngày: ${new Date().toLocaleString('vi-VN')}
Công cụ: AI Prompt Optimizer

`;

        const fullContent = header + content;

        // Create and download the file
        try {
            const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

            // Visual feedback
            const btn = event.target.closest('.export-btn');
            if (btn) {
                btn.innerHTML = '✅ Đã xuất!';
                btn.classList.add('exported');
                setTimeout(() => {
                    btn.innerHTML = '<span class="export-icon">📄</span> Xuất TXT';
                    btn.classList.remove('exported');
                }, 2000);
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Không thể xuất file. Vui lòng thử lại.');
        }
    };

    // Manual copy dialog for when clipboard API fails
    function showManualCopyDialog(text) {
        // Create modal dialog
        const modal = document.createElement('div');
        modal.className = 'manual-copy-modal';
        modal.innerHTML = `
            <div class="manual-copy-content">
                <h3>📋 Sao chép thủ công</h3>
                <p>Vui lòng chọn toàn bộ văn bản bên dưới và nhấn <strong>Ctrl+C</strong> để sao chép:</p>
                <textarea class="manual-copy-textarea" readonly>${text}</textarea>
                <div class="manual-copy-actions">
                    <button class="manual-copy-btn" onclick="this.closest('.manual-copy-modal').remove()">Đóng</button>
                </div>
            </div>
        `;

        // Add to body
        document.body.appendChild(modal);

        // Focus and select the textarea
        const textarea = modal.querySelector('.manual-copy-textarea');
        textarea.focus();
        textarea.select();

        // Close on click outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
});
