let currentDay = 1;
let audioPlayer = null;
let currentSongIndex = 0;
let isPlaying = false;

const dayIndicator = document.getElementById('current-day');
const totalDays = document.getElementById('total-days');
const progressBar = document.getElementById('progress-bar');
const navButtons = document.querySelectorAll('.nav-btn');
const contentSections = document.querySelectorAll('.content-section');
const gozosList = document.getElementById('gozos-list');
const gozoTitle = document.getElementById('gozo-title');
const gozoText = document.getElementById('gozo-text');
const daysButtons = document.getElementById('days-buttons');
const considerationTitle = document.getElementById('consideration-title');
const considerationText = document.getElementById('consideration-text');
const playMusicBtn = document.getElementById('play-music-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const nowPlaying = document.getElementById('now-playing');
const mainPlayBtn = document.getElementById('main-play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const stopBtn = document.getElementById('stop-btn');
const playerVolumeSlider = document.getElementById('player-volume-slider');

function initApp() {
    setupCurrentDay();
    setupNavigation();
    setupGozos();
    setupConsiderations();
    setupMusicControls();
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
        const button = document.createElement('button');
        button.className = 'gozo-btn';
        button.textContent = gozo.title;
        button.dataset.id = gozo.id;
        
        button.addEventListener('click', () => {
            document.querySelectorAll('.gozo-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            displayGozo(gozo);
        });
        
        gozosList.appendChild(button);
    });
    
    if (gozos.length > 0) {
        document.querySelector('.gozo-btn').click();
    }
}

function displayGozo(gozo) {
    gozoTitle.textContent = gozo.title;
    gozoText.textContent = gozo.text;
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

function setupMusicControls() {
    playMusicBtn.addEventListener('click', () => {
        currentSongIndex = 0;
        playCurrentSong();
    });
    
    volumeSlider.addEventListener('input', () => {
        updateVolume();
    });
    
    playerVolumeSlider.addEventListener('input', () => {
        updatePlayerVolume();
    });
}

function setupAudioPlayer() {
    audioPlayer = new Audio();
    audioPlayer.volume = volumeSlider.value / 100;
    
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        mainPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        nowPlaying.textContent = `Reproduciendo: ${canciones[currentSongIndex].title}`;
    });
    
    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        playNextSong();
    });
    
    mainPlayBtn.addEventListener('click', togglePlayback);
    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);
    stopBtn.addEventListener('click', stopPlayback);
    
    updateVolume();
    updatePlayerVolume();
}

function playCurrentSong() {
    if (!audioPlayer) return;
    
    audioPlayer.src = canciones[currentSongIndex].file;
    
    audioPlayer.play().then(() => {
        nowPlaying.textContent = `Reproduciendo: ${canciones[currentSongIndex].title}`;
    }).catch(() => {
        nowPlaying.textContent = "Error al cargar la música";
    });
}

function togglePlayback() {
    if (!audioPlayer) return;
    
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        if (!audioPlayer.src) {
            currentSongIndex = 0;
            playCurrentSong();
        } else {
            audioPlayer.play();
        }
    }
}

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % canciones.length;
    playCurrentSong();
}

function playPrevSong() {
    currentSongIndex = (currentSongIndex - 1 + canciones.length) % canciones.length;
    playCurrentSong();
}

function stopPlayback() {
    if (!audioPlayer) return;
    
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isPlaying = false;
    mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    nowPlaying.textContent = "Música detenida";
}

function updateVolume() {
    if (!audioPlayer) return;
    
    const volume = volumeSlider.value / 100;
    audioPlayer.volume = volume;
    volumeValue.textContent = `${volumeSlider.value}%`;
}

function updatePlayerVolume() {
    if (!audioPlayer) return;
    
    const volume = playerVolumeSlider.value / 100;
    audioPlayer.volume = volume;
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        if (event.key >= '1' && event.key <= '9' && document.getElementById('gozos-section').classList.contains('active')) {
            const index = parseInt(event.key) - 1;
            if (index < gozos.length) {
                document.querySelectorAll('.gozo-btn')[index].click();
            }
        }
        
        if (event.key >= '1' && event.key <= '9' && document.getElementById('consideraciones-section').classList.contains('active')) {
            const index = parseInt(event.key) - 1;
            if (index < consideraciones.length) {
                document.querySelectorAll('.day-btn')[index].click();
            }
        }
        
        if (event.code === 'Space' && !event.target.matches('button, input, textarea')) {
            event.preventDefault();
            togglePlayback();
        }
        
        if (event.code === 'ArrowRight') {
            playNextSong();
        }
        
        if (event.code === 'ArrowLeft') {
            playPrevSong();
        }
        
        if (event.code === 'Escape') {
            stopPlayback();
        }
    });
}

document.addEventListener('DOMContentLoaded', initApp);
