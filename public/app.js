const lengthEl = document.getElementById("length");
const useLowerEl = document.getElementById("useLower");
const useUpperEl = document.getElementById("useUpper");
const useNumbersEl = document.getElementById("useNumbers");
const useSymbolsEl = document.getElementById("useSymbols");
const generateBtn = document.getElementById("generateBtn");
const outputEl = document.getElementById("passwordOutput");
const copyBtn = document.getElementById("copyBtn"); // Correção: faltava declarar
const copiedNotice = document.getElementById("copiedNotice");
const meterBar = document.getElementById("meterBar");
const meterText = document.getElementById("meterText");

document.getElementById("year").textContent = new Date().getFullYear();

const CHAR_SETS = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%&*-_=+[]{};:,.?"
};

function getRandomChar(charSet) {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const randomIndex = randomBuffer[0] % charSet.length;
    return charSet[randomIndex];
}

function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        const j = randomBuffer[0] % (i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function generatePassword() {
    const length = clamp(parseInt(lengthEl.value, 10) || 12, 6, 64);
    lengthEl.value = length; 

    let availableSets = [];
    let password = "";
    
    if (useLowerEl.checked) availableSets.push(CHAR_SETS.lower);
    if (useUpperEl.checked) availableSets.push(CHAR_SETS.upper);
    if (useNumbersEl.checked) availableSets.push(CHAR_SETS.numbers);
    if (useSymbolsEl.checked) availableSets.push(CHAR_SETS.symbols);

    if (availableSets.length === 0) {
        alert("Selecione pelo menos um tipo de caractere.");
        return null;
    }

    let allChars = "";
    availableSets.forEach(set => {
        password += getRandomChar(set);
        allChars += set;
    });

    while (password.length < length) {
        password += getRandomChar(allChars);
    }

    return shuffleString(password);
}

generateBtn.addEventListener("click", () => {
    const pwd = generatePassword();
    if (pwd) {
        outputEl.textContent = pwd;
        outputEl.style.color = "var(--text)"; // Resetar cor caso estivesse cinza
        updateStrengthMeter(pwd);
    }
});

copyBtn.addEventListener("click", async () => {
    const text = outputEl.textContent.trim();
    if (!text || text === "-") return;

    try {
        await navigator.clipboard.writeText(text);
        copiedNotice.textContent = "Copiado!";
        copyBtn.textContent = "Copiado!"; // Feedback visual no botão
        
        setTimeout(() => {
            copiedNotice.textContent = "";
            copyBtn.textContent = "Copiar";
        }, 2000);
    } catch (err) {
        copiedNotice.textContent = "Erro ao copiar.";
        console.error(err);
    }
});

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function updateStrengthMeter(pwd) {
    if (!pwd) {
        setMeter(0);
        return;
    }
    
    let score = 0;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;

    setMeter(score);
}

function setMeter(score) {
    let percentage = Math.min(100, (score / 6) * 100);
    
    let color = "var(--danger)";
    let text = "Fraca";

    if (score >= 4) {
        color = "var(--warning)";
        text = "Média";
    }
    if (score >= 6) {
        color = "var(--accent)";
        text = "Forte";
    }

    meterBar.style.width = `${percentage}%`;
    meterBar.style.background = color;
    meterText.textContent = text;
}