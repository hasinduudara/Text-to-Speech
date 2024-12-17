document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const voiceSelect = document.getElementById('voiceSelect');
    const speakButton = document.getElementById('speakButton');
    const stopButton = document.getElementById('stopButton'); // Stop button
    const progressBar = document.getElementById('progressBar');

    let voices = [];

    // Load available voices
    const loadVoices = () => {
        voices = speechSynthesis.getVoices();
        voices.sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));

        voiceSelect.innerHTML = voices
            .map(
                (voice, index) =>
                    `<option value="${index}">${voice.name} (${voice.lang}) ${
                        voice.default ? ' - Default' : ''
                    }</option>`
            )
            .join('');
    };

    // Speak the entered text
    const speakText = () => {
        const text = textInput.value.trim();
        const selectedVoiceIndex = voiceSelect.value;

        if (text === '') {
            alert('Please enter some text!');
            return;
        }

        // Cancel any ongoing speech before starting a new one
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (voices.length > 0) {
            utterance.voice = voices[selectedVoiceIndex];
        }

        // Optional: Adjust pitch and rate if needed
        utterance.pitch = 1; // Default pitch
        utterance.rate = 1; // Default rate

        speechSynthesis.speak(utterance);
        updateProgressBar(utterance);
    };

    // Stop any ongoing speech
    const stopText = () => {
        speechSynthesis.cancel();
        progressBar.style.width = '0%';
    };

    const updateProgressBar = (utterance) => {
        const totalDuration = utterance.text.length / utterance.rate;
        let elapsed = 0;

        const interval = setInterval(() => {
            elapsed += 0.1;
            const progress = Math.min((elapsed / totalDuration) * 100, 100);
            progressBar.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 100);

        utterance.onend = () => {
            clearInterval(interval);
            progressBar.style.width = '100%';
            setTimeout(() => {
                progressBar.style.width = '0%';
            }, 500);
        };
    };

    // Load voices dynamically
    if ('speechSynthesis' in window) {
        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;
    } else {
        alert('Your browser does not support speech synthesis!');
    }

    // Event listeners
    speakButton.addEventListener('click', speakText);
    stopButton.addEventListener('click', stopText); // Stop button listener
});
