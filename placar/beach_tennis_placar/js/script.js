// Initialize BroadcastChannel for communication with scoreboard
const channel = new BroadcastChannel('beachTennisScore');

// DOM Elements - Team Names
const teamANameInput = document.getElementById('team-a-name');
const teamBNameInput = document.getElementById('team-b-name');

// DOM Elements - Category and Circuit
const categoryTextInput = document.getElementById('category-text');
const circuitTextInput = document.getElementById('circuit-text');

// DOM Elements - Points
const pointButtons = document.querySelectorAll('.point-btn');

// DOM Elements - Sets
const teamASetMinus = document.getElementById('team-a-set-minus');
const teamASetPlus = document.getElementById('team-a-set-plus');
const teamBSetMinus = document.getElementById('team-b-set-minus');
const teamBSetPlus = document.getElementById('team-b-set-plus');
const teamASetDisplay = document.getElementById('team-a-set-display');
const teamBSetDisplay = document.getElementById('team-b-set-display');

// DOM Elements - Tiebreak
const tiebreakToggle = document.getElementById('tiebreak-toggle');
const tiebreakControls = document.getElementById('tiebreak-controls');
const teamATiebreakMinus = document.getElementById('team-a-tiebreak-minus');
const teamATiebreakPlus = document.getElementById('team-a-tiebreak-plus');
const teamBTiebreakMinus = document.getElementById('team-b-tiebreak-minus');
const teamBTiebreakPlus = document.getElementById('team-b-tiebreak-plus');
const teamATiebreakDisplay = document.getElementById('team-a-tiebreak-display');
const teamBTiebreakDisplay = document.getElementById('team-b-tiebreak-display');

// DOM Elements - Serve
const serveTeamA = document.getElementById('serve-team-a');
const serveTeamB = document.getElementById('serve-team-b');

// DOM Elements - Timer and Break Point
const timerStart = document.getElementById('timer-start');
const timerStop = document.getElementById('timer-stop');
const timerReset = document.getElementById('timer-reset');
const breakPointBtn = document.getElementById('break-point-btn');

// DOM Elements - Reset Match
const resetMatchBtn = document.getElementById('reset-match');

// State
let state = {
    teamAName: 'Time A',
    teamBName: 'Time B',
    categoryText: 'CATEGORIA',
    circuitText: 'CIRCUITO',
    teamAPoints: '0',
    teamBPoints: '0',
    teamASets: 0,
    teamBSets: 0,
    teamATiebreak: 0,
    teamBTiebreak: 0,
    isTeamAServing: false,
    isTeamBServing: false,
    isTiebreakActive: false,
    isBreakPointActive: false,
    timerStatus: 'reset' // 'running', 'stopped', 'reset'
};

// Initialize the control panel
function init() {
    // Set initial values
    teamANameInput.value = state.teamAName;
    teamBNameInput.value = state.teamBName;
    categoryTextInput.value = state.categoryText;
    circuitTextInput.value = state.circuitText;
    
    // Send initial values to scoreboard
    updateScoreboard();
}

// Update the scoreboard via BroadcastChannel
function updateScoreboard() {
    // Update team names
    channel.postMessage({
        type: 'name',
        team: 1,
        value: state.teamAName
    });
    
    channel.postMessage({
        type: 'name',
        team: 2,
        value: state.teamBName
    });
    
    // Update category and circuit
    channel.postMessage({
        type: 'category',
        value: state.categoryText
    });
    
    channel.postMessage({
        type: 'circuit',
        value: state.circuitText
    });
    
    // Update points
    channel.postMessage({
        type: 'points',
        team: 1,
        value: state.teamAPoints
    });
    
    channel.postMessage({
        type: 'points',
        team: 2,
        value: state.teamBPoints
    });
    
    // Update sets
    channel.postMessage({
        type: 'sets',
        team: 1,
        value: state.teamASets
    });
    
    channel.postMessage({
        type: 'sets',
        team: 2,
        value: state.teamBSets
    });
    
    // Update tiebreak
    channel.postMessage({
        type: 'tiebreak',
        active: state.isTiebreakActive,
        teamA: state.teamATiebreak,
        teamB: state.teamBTiebreak
    });
    
    // Update serve
    channel.postMessage({
        type: 'serve',
        teamA: state.isTeamAServing,
        teamB: state.isTeamBServing
    });
    
    // Update break point
    channel.postMessage({
        type: 'breakPoint',
        active: state.isBreakPointActive
    });
}

// Event listeners
function setupEventListeners() {
    // Team Names
    teamANameInput.addEventListener('input', function() {
        state.teamAName = this.value;
        updateScoreboard();
    });
    
    teamBNameInput.addEventListener('input', function() {
        state.teamBName = this.value;
        updateScoreboard();
    });
    
    // Category and Circuit
    categoryTextInput.addEventListener('input', function() {
        state.categoryText = this.value;
        updateScoreboard();
    });
    
    circuitTextInput.addEventListener('input', function() {
        state.circuitText = this.value;
        updateScoreboard();
    });
    
    // Points
    pointButtons.forEach(button => {
        button.addEventListener('click', function() {
            const team = this.dataset.team;
            const points = this.dataset.points;
            
            // Update state
            if (team === '1') {
                state.teamAPoints = points;
                // Update active button status
                document.querySelectorAll('.point-btn[data-team="1"]').forEach(btn => 
                    btn.classList.remove('active'));
                this.classList.add('active');
            } else {
                state.teamBPoints = points;
                // Update active button status
                document.querySelectorAll('.point-btn[data-team="2"]').forEach(btn => 
                    btn.classList.remove('active'));
                this.classList.add('active');
            }
            
            updateScoreboard();
        });
    });
    
    // Sets
    teamASetPlus.addEventListener('click', function() {
        state.teamASets++;
        teamASetDisplay.textContent = state.teamASets;
        // Reset points when set increases
        state.teamAPoints = '0';
        state.teamBPoints = '0';
        document.querySelectorAll('.point-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.point-btn[data-points="0"]').forEach(btn => btn.classList.add('active'));
        updateScoreboard();
    });
    
    teamASetMinus.addEventListener('click', function() {
        if (state.teamASets > 0) {
            state.teamASets--;
            teamASetDisplay.textContent = state.teamASets;
            updateScoreboard();
        }
    });
    
    teamBSetPlus.addEventListener('click', function() {
        state.teamBSets++;
        teamBSetDisplay.textContent = state.teamBSets;
        // Reset points when set increases
        state.teamAPoints = '0';
        state.teamBPoints = '0';
        document.querySelectorAll('.point-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.point-btn[data-points="0"]').forEach(btn => btn.classList.add('active'));
        updateScoreboard();
    });
    
    teamBSetMinus.addEventListener('click', function() {
        if (state.teamBSets > 0) {
            state.teamBSets--;
            teamBSetDisplay.textContent = state.teamBSets;
            updateScoreboard();
        }
    });
    
    // Tiebreak
    tiebreakToggle.addEventListener('change', function() {
        state.isTiebreakActive = this.checked;
        tiebreakControls.style.display = state.isTiebreakActive ? 'flex' : 'none';
        updateScoreboard();
    });
    
    teamATiebreakPlus.addEventListener('click', function() {
        state.teamATiebreak++;
        teamATiebreakDisplay.textContent = state.teamATiebreak;
        updateScoreboard();
    });
    
    teamATiebreakMinus.addEventListener('click', function() {
        if (state.teamATiebreak > 0) {
            state.teamATiebreak--;
            teamATiebreakDisplay.textContent = state.teamATiebreak;
            updateScoreboard();
        }
    });
    
    teamBTiebreakPlus.addEventListener('click', function() {
        state.teamBTiebreak++;
        teamBTiebreakDisplay.textContent = state.teamBTiebreak;
        updateScoreboard();
    });
    
    teamBTiebreakMinus.addEventListener('click', function() {
        if (state.teamBTiebreak > 0) {
            state.teamBTiebreak--;
            teamBTiebreakDisplay.textContent = state.teamBTiebreak;
            updateScoreboard();
        }
    });
    
    // Serve
    serveTeamA.addEventListener('click', function() {
        state.isTeamAServing = !state.isTeamAServing;
        this.classList.toggle('active', state.isTeamAServing);
        
        // If team A is serving, team B cannot be serving
        if (state.isTeamAServing) {
            state.isTeamBServing = false;
            serveTeamB.classList.remove('active');
        }
        
        updateScoreboard();
    });
    
    serveTeamB.addEventListener('click', function() {
        state.isTeamBServing = !state.isTeamBServing;
        this.classList.toggle('active', state.isTeamBServing);
        
        // If team B is serving, team A cannot be serving
        if (state.isTeamBServing) {
            state.isTeamAServing = false;
            serveTeamA.classList.remove('active');
        }
        
        updateScoreboard();
    });
    
    // Timer
    timerStart.addEventListener('click', function() {
        state.timerStatus = 'running';
        channel.postMessage({
            type: 'timer',
            action: 'start'
        });
    });
    
    timerStop.addEventListener('click', function() {
        state.timerStatus = 'stopped';
        channel.postMessage({
            type: 'timer',
            action: 'stop'
        });
    });
    
    timerReset.addEventListener('click', function() {
        state.timerStatus = 'reset';
        channel.postMessage({
            type: 'timer',
            action: 'reset'
        });
    });
    
    // Break Point
    breakPointBtn.addEventListener('click', function() {
        state.isBreakPointActive = !state.isBreakPointActive;
        this.classList.toggle('active', state.isBreakPointActive);
        updateScoreboard();
    });
    
    // Reset Match
    resetMatchBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja reiniciar a partida? Todos os dados serão perdidos.')) {
            // Reset state
            state = {
                teamAName: teamANameInput.value,
                teamBName: teamBNameInput.value,
                categoryText: categoryTextInput.value,
                circuitText: circuitTextInput.value,
                teamAPoints: '0',
                teamBPoints: '0',
                teamASets: 0,
                teamBSets: 0,
                teamATiebreak: 0,
                teamBTiebreak: 0,
                isTeamAServing: false,
                isTeamBServing: false,
                isTiebreakActive: false,
                isBreakPointActive: false,
                timerStatus: 'reset'
            };
            
            // Reset UI
            document.querySelectorAll('.point-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.point-btn[data-points="0"]').forEach(btn => btn.classList.add('active'));
            teamASetDisplay.textContent = '0';
            teamBSetDisplay.textContent = '0';
            teamATiebreakDisplay.textContent = '0';
            teamBTiebreakDisplay.textContent = '0';
            tiebreakToggle.checked = false;
            tiebreakControls.style.display = 'none';
            serveTeamA.classList.remove('active');
            serveTeamB.classList.remove('active');
            breakPointBtn.classList.remove('active');
            
            // Send reset command to scoreboard
            channel.postMessage({
                type: 'resetMatch'
            });
            
            // Update scoreboard with reset values
            updateScoreboard();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    setupEventListeners();
    
    // Set initial active state for 0 points buttons
    document.querySelectorAll('.point-btn[data-points="0"]').forEach(btn => 
        btn.classList.add('active'));
});
