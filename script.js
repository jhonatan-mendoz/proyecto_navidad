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
const considerationTitle = document.getElementById('consideration-title');
const considerationText = document.getElementById('consideration-text');
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
    currentDay = 1;
    updateDayIndicator();
}

function updateDayIndicator() {
    dayIndicator.textContent = `Día ${currentDay}`;
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
        
        gozoCard.innerHTML = `
            <h3>${gozo.title}</h3>
            <div class="gozo-text">${gozo.text}</div>
            <button class="gozo-music-btn" data-song-id="1">
                <i class="fas fa-play"></i> Reproducir "Ven a nuestras almas"
            </button>
        `;
        
        gozosContainer.appendChild(gozoCard);
    });
    
    const gozoMusicBtns = document.querySelectorAll('.gozo-music-btn');
    gozoMusicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playSongById(1);
        });
    });
}

function setupConsiderations() {
    consideraciones.forEach((consideracion, index) => {
        const button = document.createElement('button');
        button.className = 'day-btn';
        button.textContent = `Día ${index + 1}`;
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
    considerationTitle.textContent = consideracion.title;
    considerationText.textContent = consideracion.text;
}

function setupVillancicos() {
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
    const song = canciones.find(s => s.id === songId);
    if (!song) return;
    
    lastPlayedSong = song;
    audioPlayer.src = song.file;
    
    audioPlayer.play().then(() => {
        nowPlaying.textContent = `Reproduciendo: ${song.title}`;
    }).catch(() => {
        nowPlaying.textContent = "Error: Archivo de audio no encontrado";
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