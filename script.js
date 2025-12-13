let currentDay = 1;
let audioPlayer = null;
let isPlaying = false;
let lastPlayedSong = null;

const dayIndicator = document.getElementById('current-day');
const totalDays = document.getElementById('total-days');
const progressBar = document.getElementById('progress-bar');
const navButtons = document.querySelectorAll('.nav-btn');
const contentSections = document.querySelectorAll('.content-section');
const gozosContainer = document.getElementById('gozos-container');
const daysButtons = document.getElementById('days-buttons');
const considerationDate = document.getElementById('consideration-date');
const considerationTitle = document.getElementById('consideration-title');
const considerationSigno = document.getElementById('consideration-signo');
const considerationLectura = document.getElementById('consideration-lectura');
const considerationText = document.getElementById('consideration-text');
const considerationCompromiso = document.getElementById('consideration-compromiso');
const nowPlaying = document.getElementById('now-playing');
const mainPlayBtn = document.getElementById('main-play-btn');
const stopBtn = document.getElementById('stop-btn');
const playerVolumeSlider = document.getElementById('player-volume-slider');

function initApp() {
    setupCurrentDay();
    setupNavigation();
    setupGozos();
    setupConsiderations();
    setupVillancicos();
    setupAudioPlayer();
    setupKeyboardShortcuts();
}

function setupCurrentDay() {
    const today = new Date();
    const currentDate = today.getDate();
    if (currentDate >= 16 && currentDate <= 24) {
        currentDay = currentDate - 15;
    } else {
        currentDay = 1;
    }
    updateDayIndicator();
}

function updateDayIndicator() {
    const consideration = consideraciones[currentDay - 1];
    dayIndicator.textContent = consideration.date;
    totalDays.textContent = `de ${consideraciones.length} días`;
    const progressPercentage = (currentDay / consideraciones.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function setupNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            const sectionId = button.getAttribute('data-section');
            document.getElementById(`${sectionId}-section`).classList.add('active');
        });
    });
}

function setupGozos() {
    gozos.forEach(gozo => {
        const gozoCard = document.createElement('div');
        gozoCard.className = 'gozo-card';
        
        // AGREGAR TÍTULO
        let gozoContent = `<h3>${gozo.title}</h3>`;
        
        // AGREGAR CADA SECCIÓN
        gozo.sections.forEach((section, index) => {
            // Agregar el texto de la estrofa
            gozoContent += `<div class="gozo-text">${section.text}</div>`;
            
            // AGREGAR BOTÓN DESPUÉS DE CADA ESTROFA
            gozoContent += `
                <button class="gozo-music-btn" data-song-id="6">
                    <i class="fas fa-play"></i> Reproducir "Ven a nuestras almas"
                </button>
            `;
        });
        
        gozoCard.innerHTML = gozoContent;
        gozosContainer.appendChild(gozoCard);
    });
    
    // CONFIGURAR EVENTOS DE LOS BOTONES
    const gozoMusicBtns = document.querySelectorAll('.gozo-music-btn');
    gozoMusicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playSongById(6); // ID 6 = "Ven a nuestras almas"
        });
    });
}

function setupConsiderations() {
    consideraciones.forEach((consideracion, index) => {
        const button = document.createElement('button');
        button.className = 'day-btn';
        button.textContent = consideracion.date;
        button.dataset.id = consideracion.id;
        
        button.addEventListener('click', () => {
            currentDay = index + 1;
            updateDayIndicator();
            document.querySelectorAll('.day-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            displayConsideration(consideracion);
        });
        
        daysButtons.appendChild(button);
    });
    
    if (consideraciones.length > 0) {
        document.querySelector('.day-btn').click();
    }
}

function displayConsideration(consideracion) {
    considerationDate.textContent = consideracion.date;
    considerationTitle.textContent = consideracion.title;
    considerationSigno.textContent = consideracion.signo;
    considerationLectura.textContent = consideracion.lectura;
    considerationText.textContent = consideracion.meditacion;
    considerationCompromiso.textContent = consideracion.compromiso;
}

function setupVillancicos() {
    const villancicosContainer = document.querySelector('.villancicos-container');
    
    villancicos.forEach(villancico => {
        const villancicoCard = document.createElement('div');
        villancicoCard.className = 'villancico-card';
        
        villancicoCard.innerHTML = `
            <h3>${villancico.title}</h3>
            <div class="villancico-text">
                ${villancico.text.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>
            <button class="villancico-play-btn" data-song-id="${villancico.id}">
                <i class="fas fa-play"></i> Reproducir "${villancico.title}"
            </button>
        `;
        
        villancicosContainer.appendChild(villancicoCard);
    });
    
    const villancicoBtns = document.querySelectorAll('.villancico-play-btn');
    villancicoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const songId = parseInt(btn.getAttribute('data-song-id'));
            playSongById(songId);
        });
    });
}

function setupAudioPlayer() {
    audioPlayer = new Audio();
    audioPlayer.volume = 0.7;
    
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        mainPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        if (lastPlayedSong) {
            nowPlaying.textContent = `Reproduciendo: ${lastPlayedSong.title}`;
        }
    });
    
    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        audioPlayer.currentTime = 0;
    });
    
    mainPlayBtn.addEventListener('click', togglePlayback);
    stopBtn.addEventListener('click', stopPlayback);
    
    playerVolumeSlider.addEventListener('input', () => {
        const volume = playerVolumeSlider.value / 100;
        audioPlayer.volume = volume;
    });
}

function playSongById(songId) {
    const song = villancicos.find(s => s.id === songId);
    if (!song) return;
    
    lastPlayedSong = song;
    audioPlayer.src = song.file;
    
    audioPlayer.play().then(() => {
        nowPlaying.textContent = `Reproduciendo: ${song.title}`;
    }).catch((error) => {
        console.error("Error al reproducir:", error);
        nowPlaying.textContent = "Error: No se pudo reproducir el audio";
    });
}

function togglePlayback() {
    if (!audioPlayer) return;
    
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        if (!audioPlayer.src && lastPlayedSong) {
            playSongById(lastPlayedSong.id);
        } else if (audioPlayer.src) {
            audioPlayer.play();
        } else {
            nowPlaying.textContent = "Seleccione una canción primero";
        }
    }
}

function stopPlayback() {
    if (!audioPlayer) return;
    
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isPlaying = false;
    mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    nowPlaying.textContent = "Música detenida";
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !event.target.matches('button, input, textarea')) {
            event.preventDefault();
            togglePlayback();
        }
        
        if (event.code === 'Escape') {
            stopPlayback();
        }
    });
}

document.addEventListener('DOMContentLoaded', initApp);