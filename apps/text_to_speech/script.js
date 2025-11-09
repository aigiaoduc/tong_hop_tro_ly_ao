document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    // Function to fetch and load HTML components
    const loadComponent = async (component, target) => {
        try {
            const response = await fetch(component);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${component}: ${response.statusText}`);
            }
            const text = await response.text();
            target.innerHTML += text;
        } catch (error) {
            console.error('Error loading component:', error);
            target.innerHTML += `<p style="color: red; text-align: center;">Error loading component: ${component}</p>`;
        }
    };

    // Load all components
    const loadApp = async () => {
        await loadComponent('components/header.html', app);
        await loadComponent('components/main.html', app);
        await loadComponent('components/footer.html', app);
        
        // Once components are loaded, initialize the TTS functionality
        initializeTTS();
    };

    const initializeTTS = () => {
        const textarea = document.getElementById('text-input');
        const voiceSelect = document.getElementById('voice-select');
        const speakButton = document.getElementById('speak-button');
        const pauseButton = document.getElementById('pause-button');
        const resumeButton = document.getElementById('resume-button');
        const stopButton = document.getElementById('stop-button');

        if (!textarea || !voiceSelect || !speakButton || !pauseButton || !resumeButton || !stopButton) {
            console.error('TTS elements not found. Check your component HTML.');
            return;
        }

        const synth = window.speechSynthesis;
        let voices = [];

        const populateVoiceList = () => {
            voices = synth.getVoices().sort((a, b) => a.lang.localeCompare(b.lang));
            const selectedVoiceName = voiceSelect.value;
            voiceSelect.innerHTML = '';

            const langDisplayNames = new Intl.DisplayNames(['vi-VN'], { type: 'language' });

            voices.forEach(voice => {
                const option = document.createElement('option');
                
                let name = voice.name.replace('Microsoft', '').trim();
                let lang = voice.lang;

                let langName = '';
                try {
                    const langCode = lang.split('-')[0];
                    langName = langDisplayNames.of(langCode);
                } catch (e) {
                    langName = lang; // Fallback
                }

                option.textContent = `${name} (${langName})`;
                
                option.setAttribute('data-lang', voice.lang);
                option.setAttribute('data-name', voice.name);
                option.value = voice.name;
                voiceSelect.appendChild(option);
            });
            if(selectedVoiceName) {
                voiceSelect.value = selectedVoiceName;
            }
        };

        populateVoiceList();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = populateVoiceList;
        }

        const speak = () => {
            if (synth.speaking) {
                console.error('SpeechSynthesis.speaking');
                return;
            }
            if (textarea.value !== '') {
                const utterThis = new SpeechSynthesisUtterance(textarea.value);
                const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
                utterThis.voice = voices.find(voice => voice.name === selectedVoiceName);
                
                utterThis.onstart = () => {
                    speakButton.disabled = true;
                    pauseButton.disabled = false;
                    stopButton.disabled = false;
                    resumeButton.disabled = true;
                };

                utterThis.onend = () => {
                    speakButton.disabled = false;
                    pauseButton.disabled = true;
                    stopButton.disabled = true;
                    resumeButton.disabled = true;
                };

                utterThis.onerror = (event) => {
                    console.error('SpeechSynthesisUtterance.onerror', event);
                    speakButton.disabled = false;
                    pauseButton.disabled = true;
                    stopButton.disabled = true;
                    resumeButton.disabled = true;
                };
                
                synth.speak(utterThis);
            }
        };

        const pause = () => {
            if (synth.speaking && !synth.paused) {
                synth.pause();
                pauseButton.disabled = true;
                resumeButton.disabled = false;
            }
        };

        const resume = () => {
            if (synth.paused) {
                synth.resume();
                pauseButton.disabled = false;
                resumeButton.disabled = true;
            }
        };

        const stop = () => {
            if (synth.speaking) {
                synth.cancel();
            }
        };

        speakButton.addEventListener('click', speak);
        pauseButton.addEventListener('click', pause);
        resumeButton.addEventListener('click', resume);
        stopButton.addEventListener('click', stop);

        // Initial button states
        pauseButton.disabled = true;
        resumeButton.disabled = true;
        stopButton.disabled = true;
    };

    // Start loading the app
    loadApp();
});
