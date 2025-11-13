// We use a flag to ensure this only runs once per session
if (!sessionStorage.getItem('veo3sora_redirected')) {
    window.open('https://gemini.google.com/gem/1-FTkAWaFHNUEUKbys6eGhSgFpFP8TxvJ?usp=sharing', '_blank');
    sessionStorage.setItem('veo3sora_redirected', 'true');
}
