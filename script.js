// DOM element references
const inputTextarea = document.getElementById('input-text');
const outputTextarea = document.getElementById('output-text');
const sourceLangSelect = document.getElementById('source-lang');
const targetLangSelect = document.getElementById('target-lang');
const translateBtn = document.getElementById('translate-btn');
const swapLanguagesBtn = document.getElementById('swap-languages-btn');
const clearInputBtn = document.getElementById('clear-input-btn');
const copyOutputBtn = document.getElementById('copy-output-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const translateText = document.getElementById('translate-text');
const errorMessageDiv = document.getElementById('error-message');
const errorTextSpan = document.getElementById('error-text');

// Define available languages
const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ur', name: 'Urdu' },
    { code: 'tr', name: 'Turkish' },
    { code: 'it', name: 'Italian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'sv', name: 'Swedish' },
    { code: 'pl', name: 'Polish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ms', name: 'Malay' },
    { code: 'fil', name: 'Filipino' },
    { code: 'el', name: 'Greek' },
    { code: 'he', name: 'Hebrew' },
    { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' },
    { code: 'fi', name: 'Finnish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'ro', name: 'Romanian' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'hr', name: 'Croatian' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'et', name: 'Estonian' },
    { code: 'lv', name: 'Latvian' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'sq', name: 'Albanian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'mk', name: 'Macedonian' },
    { code: 'is', name: 'Icelandic' },
    { code: 'ga', name: 'Irish' },
    { code: 'cy', name: 'Welsh' },
];

// Populate language dropdowns
function populateLanguageSelects() {
    languages.forEach(lang => {
        const sourceOption = document.createElement('option');
        sourceOption.value = lang.code;
        sourceOption.textContent = lang.name;
        sourceLangSelect.appendChild(sourceOption);

        const targetOption = document.createElement('option');
        targetOption.value = lang.code;
        targetOption.textContent = lang.name;
        targetLangSelect.appendChild(targetOption);
    });
    // Set default selections
    sourceLangSelect.value = 'en';
    targetLangSelect.value = 'es';
}

// Function to show error message
function showErrorMessage(message) {
    errorTextSpan.textContent = message;
    errorMessageDiv.classList.remove('hidden');
}

// Function to hide error message
function hideErrorMessage() {
    errorMessageDiv.classList.add('hidden');
    errorTextSpan.textContent = '';
}

// Function to handle translation
async function handleTranslate() {
    const inputText = inputTextarea.value.trim();
    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;

    if (!inputText) {
        showErrorMessage('Please enter text to translate.');
        return;
    }

    // Show loading spinner and disable button
    translateBtn.disabled = true;
    loadingSpinner.classList.remove('hidden');
    translateText.classList.add('hidden');
    hideErrorMessage();
    outputTextarea.value = ''; // Clear previous output

    try {
        const sourceLangName = languages.find(lang => lang.code === sourceLang)?.name || sourceLang;
        const targetLangName = languages.find(lang => lang.code === targetLang)?.name || targetLang;

        const prompt = `Translate the following text from ${sourceLangName} to ${targetLangName}:\n\n"${inputText}"`;

        let chatHistory = [];
        chatHistory.push({ role: 'user', parts: [{ text: prompt }] });

        const payload = { contents: chatHistory };
        const apiKey = 'AIzaSyAxUDoCVYkaJiXqMvXo6i9gF00G_YqtNuM'; // API key is provided by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch translation.');
        }

        const result = await response.json();

        if (
            result.candidates &&
            result.candidates.length > 0 &&
            result.candidates[0].content &&
            result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0
        ) {
            const text = result.candidates[0].content.parts[0].text;
            outputTextarea.value = text;
        } else {
            showErrorMessage('Translation response was empty or malformed.');
            outputTextarea.value = '';
        }
    } catch (error) {
        console.error('Translation error:', error);
        showErrorMessage(`Translation failed: ${error.message}`);
        outputTextarea.value = 'Error during translation. Please try again.';
    } finally {
        // Hide loading spinner and enable button
        translateBtn.disabled = false;
        loadingSpinner.classList.add('hidden');
        translateText.classList.remove('hidden');
    }
}

// Function to swap source and target languages
function handleSwapLanguages() {
    // Prevent swapping if translation is in progress
    if (translateBtn.disabled) return;

    const tempSource = sourceLangSelect.value;
    sourceLangSelect.value = targetLangSelect.value;
    targetLangSelect.value = tempSource;

    // Optionally, re-translate if there's existing output and languages are swapped
    if (outputTextarea.value.trim()) {
        inputTextarea.value = outputTextarea.value;
        outputTextarea.value = ''; // Clear output to show new translation
        // User can click translate again
    }
}

// Function to clear the input text area
function handleClearInput() {
    inputTextarea.value = '';
    outputTextarea.value = '';
    hideErrorMessage();
}

// Function to copy the output text to the clipboard
function handleCopyOutput() {
    if (outputTextarea.value.trim()) {
        const textarea = document.createElement('textarea');
        textarea.value = outputTextarea.value;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            // Optional: Provide visual feedback for copy success
            console.log('Text copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text:', err);
            showErrorMessage('Failed to copy text. Please copy manually.');
        }
        document.body.removeChild(textarea);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    populateLanguageSelects();
    translateBtn.addEventListener('click', handleTranslate);
    swapLanguagesBtn.addEventListener('click', handleSwapLanguages);
    clearInputBtn.addEventListener('click', handleClearInput);
    copyOutputBtn.addEventListener('click', handleCopyOutput);
});
