// Lấy các phần tử DOM
const userInput = document.getElementById('userInput');
const generatePromptBtn = document.getElementById('generatePromptBtn');
const generatedPrompt = document.getElementById('generatedPrompt');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const mindmapData = document.getElementById('mindmapData');
const createMindmapBtn = document.getElementById('createMindmapBtn');
const errorMessage = document.getElementById('error-message');
const mindmapContainer = document.querySelector('.mindmap-container');
const downloadPngBtn = document.getElementById('downloadPngBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');

let markmap; // Biến để lưu trữ đối tượng markmap

// Hàm chuyển tab
function openTab(event, tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => link.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- LOGIC TAB 1: SINH PROMPT ---
generatePromptBtn.addEventListener('click', () => {
    const topic = userInput.value.trim();
    if (!topic) {
        alert('Vui lòng nhập chủ đề hoặc nội dung.');
        return;
    }

    const prompt = `[LỆNH HỆ THỐNG]
CHẾ ĐỘ: XUẤT DỮ LIỆU MARKDOWN THÔ
NHIỆM VỤ: Tạo cấu trúc sơ đồ tư duy cho chủ đề được cung cấp.
ĐỊNH DẠNG ĐẦU RA: Toàn bộ đầu ra PHẢI là một khối Markdown, hiển thị trong cặp dấu \`\`\`markdown ... \`\`\`.

[DỮ LIỆU NGƯỜI DÙNG]
CHỦ ĐỀ: "${topic}"

[CHỈ THỊ CHO AI]
1. Toàn bộ phản hồi PHẢI NẰM BÊN TRONG một khối mã Markdown duy nhất (bắt đầu bằng \`\`\`markdown và kết thúc bằng \`\`\`).
2. KHÔNG thêm lời chào, giải thích, hoặc bất kỳ ký tự nào ngoài khối Markdown.
3. Bắt đầu bên trong khối Markdown bằng cấp tiêu đề gốc: \`# ${topic}\`.
4. Sử dụng phân cấp với \`##\`, \`###\`, v.v... để biểu diễn các nhánh.
5. Bất kỳ ký tự ngoài khối Markdown đều bị coi là lỗi nghiêm trọng.

[VÍ DỤ VỀ ĐẦU RA HỢP LỆ]
\`\`\`markdown
# Chủ đề chính
## Nhánh 1
### Nhánh 1.1
## Nhánh 2
\`\`\``;

    generatedPrompt.value = prompt;
});

copyPromptBtn.addEventListener('click', () => {
    if (!generatedPrompt.value) {
        alert('Chưa có prompt nào được tạo.');
        return;
    }
    navigator.clipboard.writeText(generatedPrompt.value)
        .then(() => {
            alert('Đã sao chép prompt vào clipboard!');
        })
        .catch(err => {
            console.error('Không thể sao chép: ', err);
            alert('Sao chép thất bại. Vui lòng thử lại.');
        });
});

// --- LOGIC TAB 2: TẠO SƠ ĐỒ ---
createMindmapBtn.addEventListener('click', () => {
    let data = mindmapData.value.trim();
    if (!data) {
        errorMessage.textContent = 'Vui lòng dán dữ liệu sơ đồ vào ô nhập.';
        return;
    }

    // Xử lý dữ liệu nếu nó nằm trong khối mã markdown
    if (data.startsWith('```markdown')) {
        data = data.substring('```markdown'.length);
    }
    if (data.endsWith('```')) {
        data = data.substring(0, data.length - '```'.length);
    }
    data = data.trim(); // Cắt bỏ khoảng trắng thừa sau khi xử lý

    errorMessage.textContent = ''; // Xóa thông báo lỗi cũ

    try {
        // Xóa sơ đồ cũ (nếu có)
        if (markmap) {
            markmap.destroy();
        }
        document.getElementById('mindmap').innerHTML = '';

        // Tạo sơ đồ mới
        markmap = window.markmap.Markmap.create('#mindmap', null, transform(data));
        
        // Tự động chuyển sang tab 3 để xem
        document.querySelector('.tab-link[onclick*="tab3"]').click();

    } catch (error) {
        console.error('Lỗi tạo sơ đồ:', error);
        errorMessage.textContent = 'Định dạng dữ liệu không hợp lệ. Vui lòng kiểm tra lại. Dữ liệu cần ở dạng Markdown.';
    }
});

// Hàm transform cơ bản (sẽ được cải tiến nếu cần)
function transform(markdown) {
    const { Transformer, loadCSS, loadJS } = window.markmap;
    const transformer = new Transformer();
    const { root, features } = transformer.transform(markdown);
    const { styles, scripts } = transformer.getUsedAssets(features);
    if (styles) loadCSS(styles);
    if (scripts) loadJS(scripts);
    return root;
}


// --- LOGIC TAB 3: TẢI SƠ ĐỒ ---



downloadPngBtn.addEventListener('click', () => {
    const mindmapSvg = document.querySelector('#mindmap');
    if (!mindmapSvg || !mindmapSvg.innerHTML.trim()) {
        alert('Chưa có sơ đồ nào để tải.');
        return;
    }

    html2canvas(mindmapContainer).then(canvas => {
        const link = document.createElement('a');
        link.download = 'so-do-tu-duy.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

downloadPdfBtn.addEventListener('click', () => {
    const mindmapSvg = document.querySelector('#mindmap');
    if (!mindmapSvg || !mindmapSvg.innerHTML.trim()) {
        alert('Chưa có sơ đồ nào để tải.');
        return;
    }

    const { jsPDF } = window.jspdf;

    html2canvas(mindmapContainer).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('so-do-tu-duy.pdf');
    });
});
