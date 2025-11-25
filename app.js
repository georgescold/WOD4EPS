// ===================================
// STATE MANAGEMENT
// ===================================
const AppState = {
    currentPage: 'landing',
    selectedExercises: [],
    tabataConfig: {
        exercises: [],
        workTime: 20,
        restTime: 10,
        totalTime: 240
    },
    wodConfig: {
        exercises: [],
        duration: 600,
        observerMode: false
    },
    gooseGame: {
        players: [],
        currentPlayerIndex: 0,
        board: []
    }
};

// ===================================
// AUDIO SYSTEM
// ===================================
const AudioSystem = {
    context: null,

    init() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    },

    playBeep(frequency = 800, duration = 0.1) {
        if (!this.context) this.init();

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    },

    playTransition() {
        this.playBeep(600, 0.15);
    },

    playEnd() {
        this.playBeep(1000, 0.3);
        setTimeout(() => this.playBeep(1200, 0.3), 150);
    },

    playSuccess() {
        this.playBeep(800, 0.1);
        setTimeout(() => this.playBeep(1000, 0.1), 100);
        setTimeout(() => this.playBeep(1200, 0.2), 200);
    }
};

// ===================================
// ROUTING SYSTEM
// ===================================
function navigate(page, data = {}) {
    AppState.currentPage = page;

    const routes = {
        'landing': renderLanding,
        'home': renderHome,
        'repertoire': renderRepertoire,
        'training-menu': renderTrainingMenu,
        'tabata-config': renderTabataConfig,
        'tabata-session': renderTabataSession,
        'wod-config': renderWODConfig,
        'wod-session': renderWODSession,
        'wod-results': renderWODResults,
        'goose-setup': renderGooseSetup,
        'goose-game': renderGooseGame
    };

    const renderFunction = routes[page];
    if (renderFunction) {
        renderFunction(data);
    }
}

// ===================================
// PAGE DE GARDE (LANDING)
// ===================================
function renderLanding() {
    const app = document.getElementById('app');

    const landingImages = [
        'assets/landing/Capture d\'écran 2025-11-25 à 17.12.11.png',
        'assets/landing/Capture d\'écran 2025-11-25 à 17.12.13.png',
        'assets/landing/Capture d\'écran 2025-11-25 à 17.12.15.png',
        'assets/landing/Capture d\'écran 2025-11-25 à 17.12.18.png',
        'assets/landing/Capture d\'écran 2025-11-25 à 17.12.22.png',
        'assets/landing/Capture d\'écran 2025-11-25 à 17.12.24.png',
        'assets/landing/Capture d\'écran 2025-11-25 à 17.12.28.png'
    ];

    app.innerHTML = `
    <div class="landing-page">
      <h1 class="landing-title">WOD4EPS</h1>
      <p class="landing-subtitle">Cross Training pour l'Éducation Physique et Sportive</p>
      
      <div class="landing-carousel">
        ${landingImages.map((img, index) => `
          <img src="${img}" alt="Cross Training ${index + 1}" class="carousel-image ${index === 0 ? 'active' : ''}">
        `).join('')}
      </div>
      
      <button class="btn btn-primary btn-large landing-start-btn" onclick="navigate('home')">
        START
      </button>
    </div>
  `;

    // Carousel auto-rotation
    let currentImageIndex = 0;
    setInterval(() => {
        const images = document.querySelectorAll('.carousel-image');
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].classList.add('active');
    }, 3000);
}

// ===================================
// PAGE D'ACCUEIL (MENU)
// ===================================
function renderHome() {
    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="home-page">
      <div class="home-header">
        <h1 class="home-title">WOD4EPS</h1>
        <p class="home-subtitle">Choisis ton mode d'entraînement</p>
      </div>
      
      <div class="container">
        <div class="modes-grid">
          <div class="card card-gradient fire mode-card" onclick="navigate('training-menu')">
            <div class="mode-icon">🔥</div>
            <h2 class="mode-title">TRAINING</h2>
            <p class="mode-description">Échauffement Tabata et WOD du jour</p>
          </div>
          
          <div class="card card-gradient game mode-card" onclick="navigate('goose-setup')">
            <div class="mode-icon">🎲</div>
            <h2 class="mode-title">JEU DE L'OIE</h2>
            <p class="mode-description">Plateau de jeu avec exercices</p>
          </div>
          
          <div class="card card-gradient repertoire mode-card" onclick="navigate('repertoire')">
            <div class="mode-icon">📚</div>
            <h2 class="mode-title">RÉPERTOIRE</h2>
            <p class="mode-description">Tous les exercices et critères</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===================================
// RÉPERTOIRE
// ===================================
function renderRepertoire() {
    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="repertoire-page">
      <button class="back-button" onclick="navigate('home')">←</button>
      
      <div class="container">
        <div class="repertoire-header">
          <h1>Répertoire des Exercices</h1>
          <p class="text-secondary">Clique sur un exercice pour voir les critères de réussite</p>
        </div>
        
        <div class="repertoire-filters">
          <button class="filter-btn active" data-level="all">Tous</button>
          <button class="filter-btn" data-level="1">Niveau 1</button>
          <button class="filter-btn" data-level="2">Niveau 2</button>
          <button class="filter-btn" data-level="3">Niveau 3</button>
        </div>
        
        <div class="exercises-grid" id="exercises-grid"></div>
      </div>
    </div>
  `;

    displayExercises('all');

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const level = e.target.dataset.level;
            displayExercises(level);
        });
    });
}

function displayExercises(levelFilter) {
    const grid = document.getElementById('exercises-grid');
    const exercises = levelFilter === 'all'
        ? getAllExercises()
        : getExercisesByLevel(parseInt(levelFilter));

    grid.innerHTML = exercises.map(ex => `
    <div class="card exercise-card" onclick='showExerciseModal(${JSON.stringify(ex.id)})'>
      <img src="${ex.image}" alt="${ex.name}" class="exercise-image">
      <h3 class="exercise-name">${ex.name}</h3>
      <span class="exercise-level">Niveau ${ex.level}</span>
    </div>
  `).join('');
}

function showExerciseModal(exerciseId) {
    const exercise = getExerciseById(exerciseId);

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${exercise.name}</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      </div>
      <div class="modal-body">
        <img src="${exercise.image}" alt="${exercise.name}" class="modal-image">
        
        <div class="mb-3">
          <span class="exercise-level">Niveau ${exercise.level}</span>
          <span class="exercise-level" style="margin-left: 10px; background: var(--primary-purple);">${exercise.category}</span>
        </div>
        
        <h3>✅ Critères de Réussite</h3>
        <ul class="criteria-list">
          ${exercise.successCriteria.map(criteria => `<li>${criteria}</li>`).join('')}
        </ul>
        
        <div class="tips-box">
          <strong>💡 Conseil :</strong> ${exercise.tips}
        </div>
      </div>
    </div>
  `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===================================
// TRAINING MENU
// ===================================
function renderTrainingMenu() {
    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="home-page">
      <button class="back-button" onclick="navigate('home')">←</button>
      
      <div class="home-header">
        <h1 class="home-title">TRAINING 🔥</h1>
        <p class="home-subtitle">Choisis ton mode d'entraînement</p>
      </div>
      
      <div class="container">
        <div class="modes-grid">
          <div class="card card-gradient fire mode-card" onclick="navigate('tabata-config')">
            <div class="mode-icon">⏱️</div>
            <h2 class="mode-title">ÉCHAUFFEMENT</h2>
            <p class="mode-description">Tabata - Intervalles chronométrés</p>
          </div>
          
          <div class="card card-gradient fire mode-card" onclick="navigate('wod-config')">
            <div class="mode-icon">💪</div>
            <h2 class="mode-title">WOD DU JOUR</h2>
            <p class="mode-description">AMRAP - Maximum de tours</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===================================
// TABATA CONFIGURATION
// ===================================
function renderTabataConfig() {
    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="page">
      <button class="back-button" onclick="navigate('training-menu')">←</button>
      
      <div class="container">
        <h1 class="text-center mb-4">Configuration Tabata</h1>
        
        <div class="card" style="max-width: 800px; margin: 0 auto;">
          <h3 class="mb-3">Sélectionne 2 exercices</h3>
          <div class="exercises-grid" id="tabata-exercises"></div>
          
          <div class="mt-4">
            <div class="form-group">
              <label class="form-label">Temps de travail : <span id="work-time-value">20</span>s</label>
              <input type="range" class="form-slider" id="work-time" min="10" max="60" value="20" step="5">
            </div>
            
            <div class="form-group">
              <label class="form-label">Temps de repos : <span id="rest-time-value">10</span>s</label>
              <input type="range" class="form-slider" id="rest-time" min="5" max="30" value="10" step="5">
            </div>
            
            <div class="form-group">
              <label class="form-label">Durée totale : <span id="total-time-value">4</span> min</label>
              <input type="range" class="form-slider" id="total-time" min="2" max="10" value="4" step="1">
            </div>
          </div>
          
          <div class="text-center mt-4">
            <button class="btn btn-primary btn-large" id="start-tabata" disabled>LANCER TABATA</button>
          </div>
        </div>
      </div>
    </div>
  `;

    // Display exercises for selection
    const exercises = getAllExercises();
    const grid = document.getElementById('tabata-exercises');
    grid.innerHTML = exercises.map(ex => `
    <div class="card exercise-card tabata-select" data-id="${ex.id}">
      <img src="${ex.image}" alt="${ex.name}" class="exercise-image">
      <h3 class="exercise-name">${ex.name}</h3>
    </div>
  `).join('');

    // Exercise selection
    const selectedExercises = [];
    document.querySelectorAll('.tabata-select').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;

            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                card.style.border = '';
                const index = selectedExercises.indexOf(id);
                selectedExercises.splice(index, 1);
            } else if (selectedExercises.length < 2) {
                card.classList.add('selected');
                card.style.border = '3px solid #ff6b35';
                selectedExercises.push(id);
            }

            document.getElementById('start-tabata').disabled = selectedExercises.length !== 2;
        });
    });

    // Sliders
    document.getElementById('work-time').addEventListener('input', (e) => {
        document.getElementById('work-time-value').textContent = e.target.value;
    });

    document.getElementById('rest-time').addEventListener('input', (e) => {
        document.getElementById('rest-time-value').textContent = e.target.value;
    });

    document.getElementById('total-time').addEventListener('input', (e) => {
        document.getElementById('total-time-value').textContent = e.target.value;
    });

    // Start button
    document.getElementById('start-tabata').addEventListener('click', () => {
        AppState.tabataConfig = {
            exercises: selectedExercises.map(id => getExerciseById(id)),
            workTime: parseInt(document.getElementById('work-time').value),
            restTime: parseInt(document.getElementById('rest-time').value),
            totalTime: parseInt(document.getElementById('total-time').value) * 60
        };
        navigate('tabata-session');
    });
}

// ===================================
// TABATA SESSION
// ===================================
function renderTabataSession() {
    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="page">
      <div class="timer-container">
        <h2 class="timer-label" id="phase-label">TRAVAIL</h2>
        
        <div class="timer-circle">
          <svg width="300" height="300">
            <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="10"/>
            <circle id="timer-progress" cx="150" cy="150" r="140" fill="none" stroke="#ff6b35" stroke-width="10"
              stroke-dasharray="880" stroke-dashoffset="0" transform="rotate(-90 150 150)" 
              style="transition: stroke-dashoffset 1s linear"/>
          </svg>
          <div class="timer-display" id="timer-display">20</div>
        </div>
        
        <div class="timer-exercise">
          <img id="exercise-image" src="" alt="" class="timer-exercise-image">
          <h2 id="exercise-name"></h2>
        </div>
        
        <div class="timer-controls">
          <button class="btn btn-secondary" id="pause-btn">PAUSE</button>
          <button class="btn btn-danger" onclick="navigate('training-menu')">ARRÊTER</button>
        </div>
        
        <p class="mt-3 text-secondary" id="round-info"></p>
      </div>
    </div>
  `;

    startTabataSession();
}

function startTabataSession() {
    const config = AppState.tabataConfig;
    let totalElapsed = 0;
    let currentExerciseIndex = 0;
    let isWorking = true;
    let phaseTime = config.workTime;
    let timeLeft = phaseTime;
    let isPaused = false;
    let interval;

    const timerDisplay = document.getElementById('timer-display');
    const phaseLabel = document.getElementById('phase-label');
    const exerciseImage = document.getElementById('exercise-image');
    const exerciseName = document.getElementById('exercise-name');
    const timerProgress = document.getElementById('timer-progress');
    const roundInfo = document.getElementById('round-info');
    const pauseBtn = document.getElementById('pause-btn');

    function updateDisplay() {
        timerDisplay.textContent = timeLeft;
        const progress = (timeLeft / phaseTime) * 880;
        timerProgress.style.strokeDashoffset = 880 - progress;

        if (isWorking) {
            phaseLabel.textContent = 'TRAVAIL';
            phaseLabel.style.color = '#2ecc71';
            timerProgress.style.stroke = '#2ecc71';
            const exercise = config.exercises[currentExerciseIndex];
            exerciseImage.src = exercise.image;
            exerciseName.textContent = exercise.name;
        } else {
            phaseLabel.textContent = 'REPOS';
            phaseLabel.style.color = '#3498db';
            timerProgress.style.stroke = '#3498db';
            exerciseName.textContent = 'Récupération';
        }

        const totalRounds = Math.floor(config.totalTime / (config.workTime + config.restTime));
        const currentRound = Math.floor(totalElapsed / (config.workTime + config.restTime)) + 1;
        roundInfo.textContent = `Round ${currentRound} / ${totalRounds}`;
    }

    function tick() {
        if (isPaused) return;

        timeLeft--;
        totalElapsed++;
        updateDisplay();

        if (timeLeft <= 0) {
            AudioSystem.playTransition();

            if (isWorking) {
                // Switch to rest
                isWorking = false;
                phaseTime = config.restTime;
                timeLeft = phaseTime;
            } else {
                // Switch to work
                isWorking = true;
                currentExerciseIndex = (currentExerciseIndex + 1) % config.exercises.length;
                phaseTime = config.workTime;
                timeLeft = phaseTime;
            }

            updateDisplay();
        }

        if (totalElapsed >= config.totalTime) {
            clearInterval(interval);
            AudioSystem.playEnd();
            setTimeout(() => {
                alert('Tabata terminé ! Bravo ! 🎉');
                navigate('training-menu');
            }, 500);
        }
    }

    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? 'REPRENDRE' : 'PAUSE';
    });

    updateDisplay();
    interval = setInterval(tick, 1000);
}

// ===================================
// WOD CONFIGURATION
// ===================================
function renderWODConfig() {
    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="page">
      <button class="back-button" onclick="navigate('training-menu')">←</button>
      
      <div class="container">
        <h1 class="text-center mb-4">Créer ton WOD</h1>
        
        <div class="card" style="max-width: 900px; margin: 0 auto;">
          <h3 class="mb-3">Sélectionne 3-4 exercices et leurs répétitions</h3>
          <div class="exercises-grid" id="wod-exercises"></div>
          
          <div id="selected-wod" class="mt-4"></div>
          
          <div class="mt-4">
            <div class="form-group">
              <label class="form-label">Durée du WOD : <span id="wod-duration-value">10</span> min</label>
              <input type="range" class="form-slider" id="wod-duration" min="3" max="20" value="10" step="1">
            </div>
            
            <div class="form-group">
              <label style="display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" id="observer-mode" style="width: 20px; height: 20px;">
                <span class="form-label" style="margin: 0;">Mode Observateur (validation des exercices)</span>
              </label>
            </div>
          </div>
          
          <div class="text-center mt-4">
            <button class="btn btn-primary btn-large" id="start-wod" disabled>DÉMARRER WOD</button>
          </div>
        </div>
      </div>
    </div>
  `;

    const exercises = getAllExercises();
    const grid = document.getElementById('wod-exercises');
    grid.innerHTML = exercises.map(ex => `
    <div class="card exercise-card wod-select" data-id="${ex.id}">
      <img src="${ex.image}" alt="${ex.name}" class="exercise-image">
      <h3 class="exercise-name">${ex.name}</h3>
    </div>
  `).join('');

    const selectedWOD = [];

    document.querySelectorAll('.wod-select').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;

            if (selectedWOD.find(ex => ex.id === id)) {
                return; // Already selected
            }

            if (selectedWOD.length < 4) {
                const reps = prompt(`Nombre de répétitions pour ${getExerciseById(id).name} :`, '10');
                if (reps && parseInt(reps) > 0) {
                    selectedWOD.push({
                        id: id,
                        exercise: getExerciseById(id),
                        reps: parseInt(reps)
                    });
                    card.style.border = '3px solid #ff6b35';
                    updateWODDisplay();
                }
            }
        });
    });

    function updateWODDisplay() {
        const display = document.getElementById('selected-wod');
        if (selectedWOD.length === 0) {
            display.innerHTML = '';
            document.getElementById('start-wod').disabled = true;
            return;
        }

        display.innerHTML = `
      <h3>Ton WOD :</h3>
      <ul style="list-style: none; padding: 0;">
        ${selectedWOD.map((item, index) => `
          <li style="padding: 10px; background: rgba(255,255,255,0.05); margin: 5px 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span>${index + 1}. ${item.exercise.name} - ${item.reps} répétitions</span>
            <button class="btn btn-danger btn-small" onclick="removeWODExercise(${index})">×</button>
          </li>
        `).join('')}
      </ul>
    `;

        document.getElementById('start-wod').disabled = selectedWOD.length < 3;
    }

    window.removeWODExercise = (index) => {
        const removedId = selectedWOD[index].id;
        selectedWOD.splice(index, 1);
        document.querySelector(`[data-id="${removedId}"]`).style.border = '';
        updateWODDisplay();
    };

    document.getElementById('wod-duration').addEventListener('input', (e) => {
        document.getElementById('wod-duration-value').textContent = e.target.value;
    });

    document.getElementById('start-wod').addEventListener('click', () => {
        AppState.wodConfig = {
            exercises: selectedWOD,
            duration: parseInt(document.getElementById('wod-duration').value) * 60,
            observerMode: document.getElementById('observer-mode').checked
        };
        navigate('wod-session');
    });
}

// ===================================
// WOD SESSION
// ===================================
function renderWODSession() {
    const config = AppState.wodConfig;

    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="page">
      <div class="container">
        <div class="card" style="max-width: 800px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h2>WOD en cours</h2>
            <div style="text-align: right;">
              <div style="font-size: 2rem; font-weight: 700; color: #ff6b35;" id="wod-timer">10:00</div>
              <div style="font-size: 1.2rem; color: var(--text-secondary);">Tours: <span id="rounds-count">0</span></div>
            </div>
          </div>
          
          <div id="wod-exercises-list"></div>
          
          <div class="text-center mt-4">
            <button class="btn btn-success btn-large" id="complete-round">TOUR TERMINÉ</button>
            <button class="btn btn-danger mt-2" id="finish-wod">TERMINER WOD</button>
          </div>
        </div>
      </div>
    </div>
  `;

    startWODSession();
}

function startWODSession() {
    const config = AppState.wodConfig;
    let timeLeft = config.duration;
    let rounds = 0;
    let validations = [];
    let totalValidations = 0;
    let successfulValidations = 0;

    const timerDisplay = document.getElementById('wod-timer');
    const roundsDisplay = document.getElementById('rounds-count');
    const exercisesList = document.getElementById('wod-exercises-list');

    function updateExercisesList() {
        exercisesList.innerHTML = config.exercises.map((item, index) => `
      <div class="card" style="margin-bottom: 15px; padding: 20px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <img src="${item.exercise.image}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 12px;">
          <div style="flex: 1;">
            <h3>${item.exercise.name}</h3>
            <p style="color: var(--text-secondary);">${item.reps} répétitions</p>
            <details style="margin-top: 10px;">
              <summary style="cursor: pointer; color: #3498db;">Voir critères de réussite</summary>
              <ul style="margin-top: 10px; font-size: 0.9rem;">
                ${item.exercise.successCriteria.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </details>
          </div>
          ${config.observerMode ? `
            <button class="btn btn-success" onclick="validateExercise(${index})">
              ✓ VALIDER
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
    }

    window.validateExercise = (index) => {
        AudioSystem.playBeep(1000, 0.1);
        totalValidations++;
        successfulValidations++;
        alert('Exercice validé ! ✓');
    };

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateExercisesList();
    updateTimer();

    const interval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(interval);
            AudioSystem.playEnd();
            finishWOD();
        }
    }, 1000);

    document.getElementById('complete-round').addEventListener('click', () => {
        rounds++;
        roundsDisplay.textContent = rounds;
        AudioSystem.playSuccess();

        if (config.observerMode) {
            totalValidations += config.exercises.length;
        }
    });

    document.getElementById('finish-wod').addEventListener('click', () => {
        clearInterval(interval);
        finishWOD();
    });

    function finishWOD() {
        const timeSpent = config.duration - timeLeft;
        const validationPercentage = config.observerMode && totalValidations > 0
            ? Math.round((successfulValidations / totalValidations) * 100)
            : null;

        navigate('wod-results', {
            rounds,
            timeSpent,
            totalTime: config.duration,
            validationPercentage,
            exercises: config.exercises
        });
    }
}

// ===================================
// WOD RESULTS
// ===================================
function renderWODResults(data) {
    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="page">
      <div class="container">
        <div class="card" style="max-width: 700px; margin: 0 auto; text-align: center;">
          <h1 style="font-size: 3rem; margin-bottom: 30px;">WOD Terminé ! 🎉</h1>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="card" style="padding: 20px;">
              <div style="font-size: 2.5rem; font-weight: 700; color: #ff6b35;">${data.rounds}</div>
              <div style="color: var(--text-secondary);">Tours</div>
            </div>
            
            <div class="card" style="padding: 20px;">
              <div style="font-size: 2.5rem; font-weight: 700; color: #3498db;">${Math.floor(data.timeSpent / 60)}:${(data.timeSpent % 60).toString().padStart(2, '0')}</div>
              <div style="color: var(--text-secondary);">Temps</div>
            </div>
            
            ${data.validationPercentage !== null ? `
              <div class="card" style="padding: 20px;">
                <div style="font-size: 2.5rem; font-weight: 700; color: #2ecc71;">${data.validationPercentage}%</div>
                <div style="color: var(--text-secondary);">Réussite</div>
              </div>
            ` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label">Comment te sens-tu ?</label>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-secondary feeling-btn" data-feeling="easy">😊 Facile</button>
              <button class="btn btn-secondary feeling-btn" data-feeling="medium">😐 Moyen</button>
              <button class="btn btn-secondary feeling-btn" data-feeling="hard">😓 Dur</button>
              <button class="btn btn-secondary feeling-btn" data-feeling="very-hard">🥵 Très dur</button>
            </div>
          </div>
          
          <div id="advice-box" class="mt-4"></div>
          
          <div class="mt-4">
            <button class="btn btn-primary" onclick="navigate('wod-config')">NOUVEAU WOD</button>
            <button class="btn btn-secondary" onclick="navigate('home')">MENU PRINCIPAL</button>
          </div>
        </div>
      </div>
    </div>
  `;

    document.querySelectorAll('.feeling-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const feeling = e.target.dataset.feeling;
            showAdvice(feeling, data);
        });
    });
}

function showAdvice(feeling, data) {
    const adviceBox = document.getElementById('advice-box');
    let level = '';
    let advice = '';
    let color = '';

    if (feeling === 'easy') {
        level = 'Niveau: Confirmé 💪';
        advice = 'Tu maîtrises bien ! Pour progresser, augmente le nombre de répétitions ou réduis le temps de repos.';
        color = '#2ecc71';
    } else if (feeling === 'medium') {
        level = 'Niveau: Intermédiaire 👍';
        advice = 'Bon équilibre ! Continue à ce rythme et essaie d\'augmenter progressivement l\'intensité.';
        color = '#3498db';
    } else if (feeling === 'hard') {
        level = 'Niveau: Débutant en progression 💫';
        advice = 'Bravo d\'avoir terminé ! Garde les mêmes paramètres et concentre-toi sur la technique.';
        color = '#f39c12';
    } else {
        level = 'Niveau: Débutant 🌱';
        advice = 'Excellent effort ! Réduis le nombre de répétitions ou augmente le temps pour mieux récupérer.';
        color = '#e74c3c';
    }

    if (data.validationPercentage !== null) {
        if (data.validationPercentage < 70) {
            advice += ' Travaille sur la qualité des mouvements en consultant les critères de réussite.';
        } else if (data.validationPercentage >= 90) {
            advice += ' Excellente technique ! Continue comme ça !';
        }
    }

    adviceBox.innerHTML = `
    <div class="card" style="background: rgba(255,255,255,0.05); padding: 25px; border-left: 4px solid ${color};">
      <h3 style="color: ${color}; margin-bottom: 15px;">${level}</h3>
      <p style="font-size: 1.1rem; line-height: 1.6;">${advice}</p>
    </div>
  `;
}

// ===================================
// JEU DE L'OIE - SETUP
// ===================================
function renderGooseSetup() {
    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="page">
      <button class="back-button" onclick="navigate('home')">←</button>
      
      <div class="container">
        <h1 class="text-center mb-4">Jeu de l'Oie 🎲</h1>
        
        <div class="card" style="max-width: 600px; margin: 0 auto;">
          <h3 class="mb-3">Configuration de la partie</h3>
          
          <div class="form-group">
            <label class="form-label">Nombre de joueurs (2-6)</label>
            <input type="number" class="form-input" id="num-players" min="2" max="6" value="2">
          </div>
          
          <div id="player-names"></div>
          
          <div class="text-center mt-4">
            <button class="btn btn-primary btn-large" id="start-game">COMMENCER</button>
          </div>
        </div>
      </div>
    </div>
  `;

    const numPlayersInput = document.getElementById('num-players');
    const playerNamesDiv = document.getElementById('player-names');

    function updatePlayerInputs() {
        const num = parseInt(numPlayersInput.value);
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

        playerNamesDiv.innerHTML = '';
        for (let i = 0; i < num; i++) {
            playerNamesDiv.innerHTML += `
        <div class="form-group">
          <label class="form-label">
            <span style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; background: ${colors[i]}; margin-right: 10px;"></span>
            Joueur ${i + 1}
          </label>
          <input type="text" class="form-input player-name" placeholder="Nom du joueur ${i + 1}" value="Joueur ${i + 1}">
        </div>
      `;
        }
    }

    numPlayersInput.addEventListener('input', updatePlayerInputs);
    updatePlayerInputs();

    document.getElementById('start-game').addEventListener('click', () => {
        const playerNames = Array.from(document.querySelectorAll('.player-name')).map(input => input.value);
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

        AppState.gooseGame.players = playerNames.map((name, index) => ({
            name,
            color: colors[index],
            position: 0
        }));
        AppState.gooseGame.currentPlayerIndex = 0;

        navigate('goose-game');
    });
}

// ===================================
// JEU DE L'OIE - GAME
// ===================================
function renderGooseGame() {
    const app = document.getElementById('app');

    // Generate board cells
    const cellTypes = generateBoardCells();

    app.innerHTML = `
    <div class="page">
      <button class="back-button" onclick="navigate('home')">←</button>
      
      <div class="container">
        <h1 class="text-center mb-3">Jeu de l'Oie 🎲</h1>
        
        <div class="text-center mb-3">
          <h2 style="color: ${AppState.gooseGame.players[AppState.gooseGame.currentPlayerIndex].color};">
            ${AppState.gooseGame.players[AppState.gooseGame.currentPlayerIndex].name}
          </h2>
        </div>
        
        <div class="dice-container">
          <div class="dice" id="dice" onclick="rollDice()">
            <span id="dice-value">🎲</span>
          </div>
        </div>
        
        <div class="game-board" id="game-board"></div>
      </div>
    </div>
  `;

    updateBoard(cellTypes);
}

function generateBoardCells() {
    const cells = [];
    const exercises = getAllExercises();

    for (let i = 0; i < 30; i++) {
        const rand = Math.random();

        if (i === 0) {
            cells.push({ type: 'start', text: 'DÉPART' });
        } else if (i === 29) {
            cells.push({ type: 'finish', text: 'ARRIVÉE' });
        } else if (rand < 0.15) {
            // Special cells
            const specials = [
                { type: 'bonus', text: 'Avance de 2 cases' },
                { type: 'bonus', text: 'Rejoue !' },
                { type: 'malus', text: 'Recule de 2 cases' },
                { type: 'malus', text: 'Passe ton tour' },
                { type: 'malus', text: 'Retourne à la case ' + Math.floor(i / 2) }
            ];
            cells.push(specials[Math.floor(Math.random() * specials.length)]);
        } else {
            // Exercise cells
            const exercise = exercises[Math.floor(Math.random() * exercises.length)];
            const reps = [5, 10, 15, 20][Math.floor(Math.random() * 4)];
            cells.push({
                type: 'exercise',
                exercise: exercise,
                reps: reps,
                text: `${reps} ${exercise.name}`
            });
        }
    }

    return cells;
}

function updateBoard(cellTypes) {
    const board = document.getElementById('game-board');
    const players = AppState.gooseGame.players;

    board.innerHTML = cellTypes.map((cell, index) => {
        const playersOnCell = players.filter(p => p.position === index);

        return `
      <div class="game-cell ${cell.type}" data-cell="${index}">
        <span class="cell-number">${index + 1}</span>
        <div style="font-size: 0.7rem; text-align: center; margin-top: 20px;">${cell.text.substring(0, 15)}${cell.text.length > 15 ? '...' : ''}</div>
        <div style="position: absolute; bottom: 5px; display: flex; gap: 3px;">
          ${playersOnCell.map(p => `<div class="game-pawn" style="background: ${p.color};"></div>`).join('')}
        </div>
      </div>
    `;
    }).join('');

    window.cellTypes = cellTypes; // Store for later use
}

function rollDice() {
    const dice = document.getElementById('dice');
    const diceValue = document.getElementById('dice-value');

    dice.classList.add('rolling');

    setTimeout(() => {
        const roll = Math.floor(Math.random() * 6) + 1;
        diceValue.textContent = roll;
        dice.classList.remove('rolling');

        AudioSystem.playBeep(400, 0.2);

        setTimeout(() => {
            movePlayer(roll);
        }, 500);
    }, 500);
}

function movePlayer(steps) {
    const currentPlayer = AppState.gooseGame.players[AppState.gooseGame.currentPlayerIndex];
    const newPosition = Math.min(currentPlayer.position + steps, 29);
    currentPlayer.position = newPosition;

    updateBoard(window.cellTypes);

    setTimeout(() => {
        const cell = window.cellTypes[newPosition];
        showCellAction(cell, currentPlayer);
    }, 500);
}

function showCellAction(cell, player) {
    let message = '';
    let extraAction = null;

    if (cell.type === 'exercise') {
        message = `
      <h2>${cell.exercise.name}</h2>
      <img src="${cell.exercise.image}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 12px; margin: 20px auto;">
      <h3>Réalise ${cell.reps} répétitions</h3>
      <details style="margin-top: 15px; text-align: left;">
        <summary style="cursor: pointer; color: #3498db;">Critères de réussite</summary>
        <ul style="margin-top: 10px;">
          ${cell.exercise.successCriteria.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </details>
    `;
    } else if (cell.type === 'finish') {
        AudioSystem.playSuccess();
        message = `
      <h1 style="font-size: 3rem;">🎉 VICTOIRE ! 🎉</h1>
      <h2>${player.name} a gagné !</h2>
      <p style="margin-top: 20px;">Félicitations pour avoir terminé le parcours !</p>
    `;

        setTimeout(() => {
            if (confirm('Partie terminée ! Voulez-vous rejouer ?')) {
                navigate('goose-setup');
            } else {
                navigate('home');
            }
        }, 3000);

    } else {
        message = `<h2>${cell.text}</h2>`;

        if (cell.text.includes('Avance')) {
            extraAction = () => movePlayer(2);
        } else if (cell.text.includes('Recule')) {
            extraAction = () => {
                player.position = Math.max(0, player.position - 2);
                updateBoard(window.cellTypes);
            };
        } else if (cell.text.includes('Retourne')) {
            extraAction = () => {
                const match = cell.text.match(/\d+/);
                if (match) {
                    player.position = parseInt(match[0]) - 1;
                    updateBoard(window.cellTypes);
                }
            };
        } else if (cell.text.includes('Rejoue')) {
            extraAction = () => {
                // Don't change player
                return;
            };
        }
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-body" style="text-align: center;">
        ${message}
        <button class="btn btn-primary btn-large mt-4" id="continue-btn">
          ${cell.type === 'finish' ? 'TERMINER' : 'TERMINÉ'}
        </button>
      </div>
    </div>
  `;

    document.body.appendChild(modal);

    document.getElementById('continue-btn').addEventListener('click', () => {
        modal.remove();

        if (extraAction) {
            extraAction();
        }

        if (cell.type !== 'finish' && !cell.text.includes('Rejoue')) {
            // Next player
            AppState.gooseGame.currentPlayerIndex =
                (AppState.gooseGame.currentPlayerIndex + 1) % AppState.gooseGame.players.length;

            const nextPlayerName = AppState.gooseGame.players[AppState.gooseGame.currentPlayerIndex].name;
            const nextPlayerColor = AppState.gooseGame.players[AppState.gooseGame.currentPlayerIndex].color;

            document.querySelector('.container h2').textContent = nextPlayerName;
            document.querySelector('.container h2').style.color = nextPlayerColor;

            document.getElementById('dice-value').textContent = '🎲';
        }
    });
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    AudioSystem.init();
    navigate('landing');
});
