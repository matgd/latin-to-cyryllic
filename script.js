// Mapping definition - Easy to modify
// Keys are the Latin characters, Values are the Cyrillic visual equivalents.
// Order matters: Sort keys by length (longest first) to handle "IO" before "I".
const MAPPING = {
    "IO": "Ю",
    "io": "Ю",
    "Io": "Ю", // Handle Mixed Case if needed
    "iO": "Ю",
    "N": "И",
    "n": "П",
    "A": "Д",
    "a": "Д",
    "X": "Ж",
    "x": "Ж",
    "C": "С",
    "c": "С",
    "W": "Ш",
    "w": "Ш",
    "E": "Э",
    "e": "Э",
    "R": "Я",
    "r": "Я"
};

// Sort keys by length descending to ensure overlapping keys (like IO vs I) are matched correctly
const SORTED_KEYS = Object.keys(MAPPING).sort((a, b) => b.length - a.length);

// Set of all target Cyrillic values for easy checking
const CYRILLIC_VALUES = new Set(Object.values(MAPPING));

document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const themeToggle = document.getElementById('theme-toggle');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const blyatFill = document.getElementById('blyat-fill');
    const blyatScore = document.getElementById('blyat-score');

    // Conversion Logic
    function convertText(text) {
        let result = "";
        let i = 0;
        
        while (i < text.length) {
            let matchFound = false;

            // Try to match keys starting from current position
            for (const key of SORTED_KEYS) {
                if (text.substr(i, key.length) === key) {
                    result += MAPPING[key];
                    i += key.length;
                    matchFound = true;
                    break;
                }
            }

            // If no match, keep original character
            if (!matchFound) {
                result += text[i];
                i++;
            }
        }
        return result;
    }

    const CS_RANKS = [
        "Silver I", "Silver II", "Silver III", "Silver IV", "Silver Elite", "Silver Elite Master",
        "Gold Nova I", "Gold Nova II", "Gold Nova III", "Gold Nova Master",
        "Master Guardian I", "Master Guardian II", "Master Guardian Elite", "Distinguished Master Guardian",
        "Legendary Eagle", "Legendary Eagle Master", "Supreme Master First Class", "The Global Elite"
    ];

    // Function to calculate "Rus Factor" level (CS Rank)
    function updateBlyatMeter(text) {
        if (!text || text.length === 0) {
            blyatFill.style.width = '0%';
            blyatScore.textContent = CS_RANKS[0]; // Silver I
            return;
        }

        let cyrillicCount = 0;
        // Basic heuristic: check if char is in our target values
        for (const char of text) {
            if (CYRILLIC_VALUES.has(char)) {
                cyrillicCount++;
            }
        }

        const percentage = (text.length > 0) ? (cyrillicCount / text.length) : 0;
        
        // Update bar width (0-100%)
        blyatFill.style.width = `${percentage * 100}%`;

        // Map to Rank (0 to 17)
        // We want 100% to be Global Elite, 0% to be Silver I
        const rankIndex = Math.floor(percentage * (CS_RANKS.length - 1));
        
        // Update Label
        blyatScore.textContent = CS_RANKS[rankIndex];
        
        // Optional: Color code the bar based on rank tiers?
        // Silver: Gray/Green, Nova: Gold, MG: Blue, LE: Pink/Purple, Global: Red/Gold
        // For now, keeping the gradient.
    }

    // Input Event Listener
    inputText.addEventListener('input', (e) => {
        const val = e.target.value;
        const converted = convertText(val);
        outputText.value = converted;
        updateBlyatMeter(converted);
    });

    // Copy Functionality
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            
            if (targetEl && targetEl.value) {
                navigator.clipboard.writeText(targetEl.value).then(() => {
                    // Visual feedback
                    const originalIcon = btn.innerHTML;
                    btn.classList.add('copied');
                    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = originalIcon;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        });
    });

    // Theme Toggle Logic
    themeToggle.addEventListener('click', () => {
        const body = document.body;
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (!body.classList.contains('dark-mode') && !body.classList.contains('light-mode')) {
            if (isSystemDark) {
                body.classList.add('light-mode');
            } else {
                body.classList.add('dark-mode');
            }
        } else {
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
            } else {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
            }
        }
    });
});
