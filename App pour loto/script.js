function genererNombresAleatoires(min, max, quantite) {
    const nombres = new Set();
    const range = max - min + 1;
    
    while (nombres.size < quantite) {
        const buffer = new Uint32Array(1);
        crypto.getRandomValues(buffer);
        const nombreAleatoire = min + (buffer[0] % range);
        nombres.add(nombreAleatoire);
    }
    
    return Array.from(nombres).sort((a, b) => a - b);
}

function genererTirage(type) {
    let resultat = '';
    if (type === 'loto') {
        const numeros = genererNombresAleatoires(1, 49, 5);
        const numeroChance = Math.floor(Math.random() * 10) + 1;
        resultat = `
            <h2>Tirage Loto</h2>
            <p class="tirage-result">
                ${numeros.map((n, i) => `<span class="numero" style="animation-delay: ${i * 0.1}s">${n}</span>`).join('')}
                <span class="numero chance" style="animation-delay: 0.5s">${numeroChance}</span>
            </p>
        `;
    } else if (type === 'euromillions') {
        const numeros = genererNombresAleatoires(1, 50, 5);
        const etoiles = genererNombresAleatoires(1, 12, 2);
        resultat = `
            <h2>Tirage Euromillions</h2>
            <p class="tirage-result">
                ${numeros.map((n, i) => `<span class="numero" style="animation-delay: ${i * 0.1}s">${n}</span>`).join('')}
                ${etoiles.map((n, i) => `<span class="numero etoile" style="animation-delay: ${(i + 5) * 0.1}s">${n}</span>`).join('')}
            </p>
        `;
    }
    
    // Après avoir généré le HTML pour le résultat :
    const resultatContainer = document.getElementById('resultat');
    resultatContainer.innerHTML = resultat;
    
    // Ajouter la classe 'show' pour déclencher l'animation
    setTimeout(() => {
        resultatContainer.classList.add('show');
    }, 50);
}

// Fonction pour basculer le thème
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }    
}

// Vérifier la préférence de thème enregistrée
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

const themeSwitch = document.getElementById('checkbox');
const themeLabel = document.querySelector('.theme-label');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  
    if (currentTheme === 'dark') {
        themeSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }    
}

themeSwitch.addEventListener('change', switchTheme, false);

// Écouter le changement de thème
themeSwitch.addEventListener('click', toggleTheme);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker enregistré avec succès:', registration.scope);
            })
            .catch(error => {
                console.log('Échec de l\'enregistrement du Service Worker:', error);
            });
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event fired');
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('downloadBtn').style.display = 'flex';
});

document.getElementById('downloadBtn').addEventListener('click', (e) => {
    console.log('Install button clicked');
    if (deferredPrompt) {
        deferredPrompt.prompt()
            .then(() => deferredPrompt.userChoice)
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            })
            .catch((error) => {
                console.error('Error during installation prompt:', error);
            });
    } else {
        console.log('No installation prompt available');
        // Ici, vous pouvez ajouter un message pour l'utilisateur
        alert("L'installation n'est pas disponible pour le moment. Assurez-vous d'utiliser un navigateur compatible et que l'application n'est pas déjà installée.");
    }
});

// Vérifie si l'app est déjà installée
window.addEventListener('appinstalled', (evt) => {
    console.log('App installed successfully');
    // Vous pouvez ajouter ici un message de confirmation pour l'utilisateur
});
