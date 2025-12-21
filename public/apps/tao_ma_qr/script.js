document.addEventListener('DOMContentLoaded', () => {
    // Basic elements
    const qrTypeSelect = document.getElementById('qr-type-select');
    const linkInput = document.getElementById('link-input');
    const dotsColorContainer = document.getElementById('dots-color-container');
    const frameSelect = document.getElementById('frame-select');
    const dotsStyleSelect = document.getElementById('dots-style-select');
    const cornersSquareStyleSelect = document.getElementById('corners-square-style-select');
    const cornersDotStyleSelect = document.getElementById('corners-dot-style-select');

    // vCard elements
    const vcardNameInput = document.getElementById('vcard-name');
    const vcardPhoneInput = document.getElementById('vcard-phone');
    const vcardEmailInput = document.getElementById('vcard-email');
    const vcardAddressInput = document.getElementById('vcard-address');

    // WiFi elements
    const wifiSsidInput = document.getElementById('wifi-ssid');
    const wifiPasswordInput = document.getElementById('wifi-password');
    const wifiSecuritySelect = document.getElementById('wifi-security');

    // Location elements
    const locationNameInput = document.getElementById('location-name');
    const locationLatInput = document.getElementById('location-lat');
    const locationLngInput = document.getElementById('location-lng');

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
        cornersDotStyle: 'square'
    };

    let selectedDotsColor = defaultOptions.dotsColor;

    // Function to generate vCard data optimized for iOS
    const generateVCard = () => {
        const name = vcardNameInput.value.trim();
        const phone = vcardPhoneInput.value.trim();
        const email = vcardEmailInput.value.trim();
        const address = vcardAddressInput.value.trim();

        // Try MECARD format for iOS (most compatible)
        if (name && phone) {
            let mecard = `MECARD:N:${name};TEL:${phone}`;
            if (email) mecard += `;EMAIL:${email}`;
            if (address) mecard += `;ADR:${address}`;
            mecard += ';;';

            return mecard;
        }

        // Fallback to vCard with UTF-8 BOM for Vietnamese
        let vcard = '\ufeffBEGIN:VCARD\nVERSION:3.0\n';
        if (name) vcard += `FN:${name}\n`;
        if (phone) vcard += `TEL:${phone}\n`;
        if (email) vcard += `EMAIL:${email}\n`;
        if (address) vcard += `ADR:;;${address}\n`;
        vcard += 'END:VCARD';

        return vcard;
    };

    // Function to generate WiFi data
    const generateWiFi = () => {
        const ssid = wifiSsidInput.value.trim();
        const password = wifiPasswordInput.value;
        const security = wifiSecuritySelect.value;

        if (!ssid) return '';

        let wifiString = `WIFI:T:${security};S:${encodeURIComponent(ssid)};`;

        if (security !== 'nopass' && password) {
            wifiString += `P:${encodeURIComponent(password)};`;
        }

        wifiString += ';';
        return wifiString;
    };

    // Function to generate location data
    const generateLocation = () => {
        const name = locationNameInput.value.trim();
        const lat = locationLatInput.value.trim();
        const lng = locationLngInput.value.trim();

        if (!lat || !lng) return '';

        let locationString = `geo:${lat},${lng}`;

        if (name) {
            locationString += `?q=${encodeURIComponent(name)}`;
        }

        return locationString;
    };

    // Function to show/hide form groups based on QR type
    const updateFormVisibility = () => {
        const qrType = qrTypeSelect.value;

        // Hide all form groups first
        document.getElementById('url-input-group').classList.add('hidden');
        document.getElementById('vcard-notice').classList.add('hidden');
        document.getElementById('vcard-input-group').classList.add('hidden');
        document.getElementById('vcard-phone-group').classList.add('hidden');
        document.getElementById('vcard-email-group').classList.add('hidden');
        document.getElementById('vcard-address-group').classList.add('hidden');
        document.getElementById('wifi-ssid-group').classList.add('hidden');
        document.getElementById('wifi-password-group').classList.add('hidden');
        document.getElementById('wifi-security-group').classList.add('hidden');
        document.getElementById('location-name-group').classList.add('hidden');
        document.getElementById('location-lat-group').classList.add('hidden');
        document.getElementById('location-lng-group').classList.add('hidden');

        // Show relevant form groups
        switch(qrType) {
            case 'url':
                document.getElementById('url-input-group').classList.remove('hidden');
                break;
            case 'vcard':
                document.getElementById('vcard-notice').classList.remove('hidden');
                document.getElementById('vcard-input-group').classList.remove('hidden');
                document.getElementById('vcard-phone-group').classList.remove('hidden');
                document.getElementById('vcard-email-group').classList.remove('hidden');
                document.getElementById('vcard-address-group').classList.remove('hidden');
                break;
            case 'wifi':
                document.getElementById('wifi-ssid-group').classList.remove('hidden');
                document.getElementById('wifi-password-group').classList.remove('hidden');
                document.getElementById('wifi-security-group').classList.remove('hidden');
                break;
            case 'location':
                document.getElementById('location-name-group').classList.remove('hidden');
                document.getElementById('location-lat-group').classList.remove('hidden');
                document.getElementById('location-lng-group').classList.remove('hidden');
                break;
        }
    };

    const getOptions = () => {
        const qrType = qrTypeSelect.value;
        let data = '';

        switch(qrType) {
            case 'url':
                data = linkInput.value.trim() || defaultOptions.data;
                break;
            case 'vcard':
                // Use raw vCard data for iOS compatibility
                data = generateVCard();
                break;
            case 'wifi':
                data = generateWiFi();
                break;
            case 'location':
                data = generateLocation();
                break;
            default:
                data = defaultOptions.data;
        }

        return {
            width: 300,
            height: 300,
            type: 'canvas', // Important: html2canvas works best with canvas
            data: data,
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
            }
        };
    };

    let qrCode = new QRCodeStyling(getOptions());
    qrCode.append(qrcodeCanvas);

    const updateQrCode = () => {
        // Show loading indicator
        const loadingIndicator = document.getElementById('loading-indicator');
        const qrcodeElement = document.getElementById('qrcode');

        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        if (qrcodeElement) {
            qrcodeElement.style.opacity = '0.3';
        }

        // Update QR code
        qrCode.update(getOptions());

        // Hide loading indicator after update
        setTimeout(() => {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            if (qrcodeElement) {
                qrcodeElement.style.opacity = '1';
            }
        }, 200);
    };

    const updateColorSwatches = () => {
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            const isActive = swatch.dataset.color === selectedDotsColor;
            swatch.classList.toggle('active', isActive);
            swatch.setAttribute('aria-checked', isActive.toString());
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
        // Reset QR type
        qrTypeSelect.value = 'url';

        // Reset basic inputs
        linkInput.value = '';
        selectedDotsColor = defaultOptions.dotsColor;
        frameSelect.value = defaultOptions.frame;
        dotsStyleSelect.value = defaultOptions.dotsStyle;
        cornersSquareStyleSelect.value = defaultOptions.cornersSquareStyle;
        cornersDotStyleSelect.value = defaultOptions.cornersDotStyle;

        // Reset vCard inputs
        vcardNameInput.value = '';
        vcardPhoneInput.value = '';
        vcardEmailInput.value = '';
        vcardAddressInput.value = '';

        // Reset WiFi inputs
        wifiSsidInput.value = '';
        wifiPasswordInput.value = '';
        wifiSecuritySelect.value = 'WPA';

        // Reset Location inputs
        locationNameInput.value = '';
        locationLatInput.value = '';
        locationLngInput.value = '';

        updateFormVisibility();
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

    // QR Type selection
    qrTypeSelect.addEventListener('change', () => {
        updateFormVisibility();
        updateQrCode();
    });

    // Update QR code in real-time for all inputs
    // Basic inputs
    linkInput.addEventListener('input', updateQrCode);
    dotsStyleSelect.addEventListener('change', updateQrCode);
    cornersSquareStyleSelect.addEventListener('change', updateQrCode);
    cornersDotStyleSelect.addEventListener('change', updateQrCode);

    // vCard inputs
    vcardNameInput.addEventListener('input', updateQrCode);
    vcardPhoneInput.addEventListener('input', updateQrCode);
    vcardEmailInput.addEventListener('input', updateQrCode);
    vcardAddressInput.addEventListener('input', updateQrCode);

    // WiFi inputs
    wifiSsidInput.addEventListener('input', updateQrCode);
    wifiPasswordInput.addEventListener('input', updateQrCode);
    wifiSecuritySelect.addEventListener('change', updateQrCode);

    // Location inputs
    locationNameInput.addEventListener('input', updateQrCode);
    locationLatInput.addEventListener('input', updateQrCode);
    locationLngInput.addEventListener('input', updateQrCode);

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

    // Mobile optimizations
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Enhanced touch feedback for mobile
        document.querySelectorAll('.btn, .color-swatch').forEach(element => {
            element.addEventListener('touchstart', function(e) {
                this.style.transform = 'scale(0.96)';
                this.style.transition = 'transform 0.1s ease';
            }, { passive: true });

            element.addEventListener('touchend', function(e) {
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            }, { passive: true });

            element.addEventListener('touchcancel', function(e) {
                this.style.transform = '';
            }, { passive: true });
        });

        // Improve input focus and UX on mobile
        document.querySelectorAll('input, select').forEach(input => {
            // Better scroll behavior on focus
            input.addEventListener('focus', function(e) {
                setTimeout(() => {
                    const rect = this.getBoundingClientRect();
                    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

                    if (!isVisible) {
                        this.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'nearest'
                        });
                    }
                }, 150);
            }, { passive: true });

            // Prevent zoom on input focus for iOS
            input.addEventListener('touchend', function(e) {
                // Only prevent default if it's a single touch
                if (e.touches.length === 0) {
                    const now = Date.now();
                    if (now - (this.lastTouchEnd || 0) < 300) {
                        e.preventDefault();
                    }
                    this.lastTouchEnd = now;
                }
            }, { passive: false });
        });

        // Better form navigation on mobile
        let currentFocusIndex = -1;
        const focusableElements = document.querySelectorAll('input, select, button, .color-swatch');

        // Add next/previous navigation for better mobile UX
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                e.preventDefault();
                const nextElement = focusableElements[currentFocusIndex + 1];
                if (nextElement) {
                    nextElement.focus();
                }
            }
        });

        // Track current focus element
        focusableElements.forEach((element, index) => {
            element.addEventListener('focus', function() {
                currentFocusIndex = index;
            }, { passive: true });
        });

        // Improve QR code generation feedback on mobile
        const originalUpdateQrCode = updateQrCode;
        updateQrCode = function() {
            // Show loading state
            const loadingIndicator = document.getElementById('loading-indicator');
            const qrcodeElement = document.getElementById('qrcode');

            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
                loadingIndicator.style.position = 'absolute';
            }
            if (qrcodeElement) {
                qrcodeElement.style.opacity = '0.5';
            }

            // Use requestAnimationFrame for smoother updates
            requestAnimationFrame(() => {
                originalUpdateQrCode();

                setTimeout(() => {
                    if (loadingIndicator) {
                        loadingIndicator.style.display = 'none';
                    }
                    if (qrcodeElement) {
                        qrcodeElement.style.opacity = '1';
                    }
                }, 150);
            });
        };
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + R to reset
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            resetToDefaults();
        }

        // Ctrl/Cmd + D to download
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            downloadBtn.click();
        }

        // Ctrl/Cmd + 1-4 to switch QR types
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            const types = ['url', 'vcard', 'wifi', 'location'];
            const index = parseInt(e.key) - 1;
            if (types[index]) {
                qrTypeSelect.value = types[index];
                updateFormVisibility();
                updateQrCode();
            }
        }
    });

    // Hide keyboard shortcuts on mobile
    if (isMobile) {
        const shortcutsInfo = document.getElementById('shortcuts-info');
        if (shortcutsInfo) {
            shortcutsInfo.style.display = 'none';
        }
    }

    // Initial setup
    updateFormVisibility();
    resetToDefaults();
});
