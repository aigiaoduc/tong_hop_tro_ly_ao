(function() {
    const botUrl = 'https://gemini.google.com/gem/1tvPuhBcdeJOCqoMOkkWhUWTOUEpSSqcU?usp=sharing';

    // We need to open the new window in response to a user gesture, but we can't.
    // So we try to open it immediately and handle the popup blocker.
    const newWindow = window.open(botUrl, '_blank');

    if (newWindow === null || typeof(newWindow) === 'undefined' || newWindow.closed) {
        // The popup was blocked.
        const fallbackElement = document.getElementById('fallback');
        if (fallbackElement) {
            fallbackElement.style.display = 'block';
        }
    } else {
        // The popup was opened successfully.
        // We can optionally close the current window if it's a popup itself.
        // window.close();
    }
})();
