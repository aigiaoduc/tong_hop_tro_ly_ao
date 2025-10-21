document.addEventListener('DOMContentLoaded', () => {
    const linkInput = document.getElementById('link-input');
    const dotsColorContainer = document.getElementById('dots-color-container');
    const frameSelect = document.getElementById('frame-select');
    const dotsStyleSelect = document.getElementById('dots-style-select');
    const cornersSquareStyleSelect = document.getElementById('corners-square-style-select');
    const cornersDotStyleSelect = document.getElementById('corners-dot-style-select');
    const logoInput = document.getElementById('logo-input');
    const resetBtn = document.getElementById('reset-btn');
    const downloadBtn = document.getElementById('download-btn');
    const qrcodeDisplayContainer = document.getElementById('qrcode-container');
    const qrcodeCanvas = document.getElementById('qrcode');

    const defaultOptions = {
        data: 'https://www.google.com/',
        dotsColor: '#000000',
        frame: 'none',
        dotsStyle: 'square',
        cornersSquareStyle: 'square',
        cornersDotStyle: 'square',
        logo: ''
    };

    let selectedDotsColor = defaultOptions.dotsColor;

    const getOptions = () => {
        return {
            width: 300,
            height: 300,
            type: 'canvas', // Important: html2canvas works best with canvas
            data: linkInput.value.trim() || defaultOptions.data,
            image: logoInput.value.trim(),
            dotsOptions: {
                color: selectedDotsColor,
                type: dotsStyleSelect.value
            },
            backgroundOptions: {
                color: '#ffffff', // Keep background white for contrast
            },
            cornersSquareOptions: {
                type: cornersSquareStyleSelect.value,
            },
            cornersDotOptions: {
                type: cornersDotStyleSelect.value,
            },
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: 10
            }
        };
    };

    let qrCode = new QRCodeStyling(getOptions());
    qrCode.append(qrcodeCanvas);

    const updateQrCode = () => {
        qrCode.update(getOptions());
    };

    const updateColorSwatches = () => {
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.toggle('active', swatch.dataset.color === selectedDotsColor);
        });
    };

    const updateFrame = () => {
        const selectedFrame = frameSelect.value;
        qrcodeDisplayContainer.classList.remove('frame-1', 'frame-2', 'frame-3');
        if (selectedFrame !== 'none') {
            qrcodeDisplayContainer.classList.add(selectedFrame);
        }
    };

    const resetToDefaults = () => {
        linkInput.value = '';
        selectedDotsColor = defaultOptions.dotsColor;
        frameSelect.value = defaultOptions.frame;
        dotsStyleSelect.value = defaultOptions.dotsStyle;
        cornersSquareStyleSelect.value = defaultOptions.cornersSquareStyle;
        cornersDotStyleSelect.value = defaultOptions.cornersDotStyle;
        logoInput.value = defaultOptions.logo;
        
        updateColorSwatches();
        updateFrame();
        updateQrCode();
    };

    dotsColorContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-swatch')) {
            selectedDotsColor = e.target.dataset.color;
            updateColorSwatches();
            updateQrCode();
        }
    });

    frameSelect.addEventListener('change', updateFrame);

    // Update QR code in real-time
    linkInput.addEventListener('input', updateQrCode);
    dotsStyleSelect.addEventListener('change', updateQrCode);
    cornersSquareStyleSelect.addEventListener('change', updateQrCode);
    cornersDotStyleSelect.addEventListener('change', updateQrCode);
    logoInput.addEventListener('input', updateQrCode);

    resetBtn.addEventListener('click', resetToDefaults);

    downloadBtn.addEventListener('click', () => {
        html2canvas(qrcodeDisplayContainer, { 
            backgroundColor: null, // Use transparent background for canvas
            onclone: (document, element) => {
                // Ensure box-shadows are rendered correctly
                element.style.boxShadow = window.getComputedStyle(element).boxShadow;
            }
        }).then(canvas => {
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = 'qr-code-with-frame.png';
            a.click();
        });
    });

    // Initial generation
    resetToDefaults();
});
