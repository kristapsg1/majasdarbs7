let colors: string[] = ["red", "blue", "green", "red", "blue", "green"]; //krasas kuras bus jamin
let selectedColors: string[] = []; //parbaudis vai minetas krasas ir vienadas
let selectedBoxes: HTMLDivElement[] = []; //sis paurbaudis kuri boxi tika uzpiesti
let score: number = 0; // sakuma cipars
let moves: number = 0;//sakuma gajiens
let highScore: number = 0; // highscores speles beigas

// Si ir funkcija kas randomize masivu, randomize katru indexu
function shuffleArray(array: string[]): void {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Si funkcija noslepj krasas kuras nav saderigas 
  function hideSelectedColors(): void {
    setTimeout(() => {
      selectedBoxes.forEach((box: HTMLDivElement) => {
        box.style.backgroundColor = "#D9D9D9"; 
      });
  
      selectedColors = []; //uztaisa tuksu masivu
      selectedBoxes = [];//uztaisa tuksu masivu
    }, 100); // Laiks 1ms
  }
  
  // highScore funkcija kas paradisies 3.ekrana
  function displayHighScore(): void {
    const highScoreDisplay = document.querySelector<HTMLElement>(".jsHighScore");
    if (highScoreDisplay) {
      highScoreDisplay.textContent = `High Score: ${highScore}`;
      highScoreDisplay.style.display = "flex";
    }
  }
  
  // Parbauda vai visas krasas ir vienadas//////////////////////////////////////////////////////////////////////////////////
  function checkAllColorsMatched(): boolean {
    const colorBoxElements = document.querySelectorAll(".jsColorBox") as NodeListOf<HTMLDivElement>;
  
    for (let i = 0; i < colorBoxElements.length; i++) {
      const colorBox = colorBoxElements[i];
      if (colorBox.style.backgroundColor !== colorBox.dataset.color) {
        return false; // kamer kada 
      }
    }
  
    // All colors are matched, increase the score and reset the move count
    score++;
    displayScore();
    moves = 0;
    displayMoves();
  
    // Update the high score if the current score is higher
    if (score > highScore) {
      highScore = score;
      displayHighScore();
    }
  
    return true; // All colors are matched
  }
  
  
  
  // Function sakt speli
  function startGame(): void {
    // Paslept Start Game buttonu
    const screenStart = document.querySelector<HTMLElement>(".jsScreenStart");
    if (screenStart) {
      screenStart.style.display = "none"; //pazudis ekrans 
    }
  
    // paradit 2.ekranu kur mums bus spelu galds
    const screenGame = document.querySelector<HTMLElement>(".jsScreenGame");
    if (screenGame) {
      screenGame.style.display = "flex"; //parveido no dispaly = none
      screenGame.style.flexDirection = "column";
      
    }
  
    // Izsauc highscore
    displayHighScore();
  
    // izsauc score and moves
    displayScore();
    displayMoves();
  
    // pec katra rounda sataisa jaunu galdu
    initializeColors(); // sagatavojam krasu masivu
    shuffleArray(colors); // randomizeham krasu
  
    const colorBoxesContainer = document.querySelector<HTMLElement>(".jsBoxes");
    if (colorBoxesContainer) {
      colorBoxesContainer.innerHTML = ''; // iztira konteineri
  
      for (let i = 0; i < colors.length; i++) {
        let colorBox: HTMLDivElement = document.createElement("div");
        colorBox.className = "colorBox jsColorBox";
        colorBox.dataset.color = colors[i]; // uzglaba krasu dataset
  
        // Uzraisa eventu ar click listeneru
        colorBox.addEventListener("click", function () {
          selectColor(colorBox);
        });
  
        colorBoxesContainer.appendChild(colorBox); //pievieno krasu kastes
      }
    }
  }
  
  // funkcija ieliekam visas krasas
  function initializeColors(): void {
    colors;
  }
  
  // parada score
  function displayScore(): void {
    const scoreDisplay = document.querySelector<HTMLElement>(".jsScore");
    if (scoreDisplay) {
      scoreDisplay.textContent = `Score: ${score}`;
      scoreDisplay.style.display = "block";
    }
  }
  
  // parada moves
  function displayMoves(): void {
    const moveCounter = document.querySelector<HTMLElement>(".jsMoveCounter");
    if (moveCounter) {
      moveCounter.textContent = `Move count: ${moves}`;
      moveCounter.style.display = "block";
    }
  }
  
  // Function to handle the selection of a color
  function selectColor(clickedBox: HTMLDivElement): void {
    // Ja ir moves ir 10 tad spele bus beigusies
    if (moves === 10) {
      // Paradit play again button
      const screenPlayAgain = document.querySelector<HTMLElement>(".jsScreenPlayAgain");
      if (screenPlayAgain) {
        screenPlayAgain.style.display = "block";
      }
  
      // Paslept otro ekrana elementus
      const screenGame = document.querySelector<HTMLElement>(".jsScreenGame");
      const scoreDisplay = document.querySelector<HTMLElement>(".jsScore");
      const moveCounter = document.querySelector<HTMLElement>(".jsMoveCounter");
      
      if (screenGame && scoreDisplay && moveCounter) {
        screenGame.style.display = "none";
      }
  
      return; // Beigs funkciju
    }
  
    // Parbauda vai kastes jau ir ieksa sis krasas vai ari ir uzslegtas 2 kastes
    if (selectedBoxes.includes(clickedBox) || selectedBoxes.length === 2) {
      return; // Beigs funkciju
    }
  
    const clickedColor: string = clickedBox.dataset.color || "";
    clickedBox.style.backgroundColor = clickedColor;
  
    selectedColors.push(clickedColor); //iepusojam clicked colors
    selectedBoxes.push(clickedBox); //iepusojam clikced boxes
    moves += 1; // updato moves ciparu
  
    // seit vini skaitas kopa
    displayMoves();
  
    // ja sakrit divas krasas
    if (selectedColors.length === 2) {
      setTimeout(() => {
        if (selectedColors[0] === selectedColors[1]) {
          // pievinosim krasas seit lai vinas paliek redzamas
          selectedColors = [];
          selectedBoxes = [];
  
          // ja visam colorboxien ir vienadas krasas tad saksim jaunu limeni
          if (checkAllColorsMatched()) {
            // sakam nakamo limeni
            startNextLevel();
          }
        } else {
          // ja krasa nav vienadas vinas paslepj
          hideSelectedColors();
        }
  
        // ja moves ir demit
        if (moves === 10) {
          // paradam pogu PLAY AGAIN
          const screenPlayAgain = document.querySelector<HTMLElement>(".jsScreenPlayAgain");
          if (screenPlayAgain) {
            screenPlayAgain.style.display = "block";
          }
  
          // paslepjam elementus
          const screenGame = document.querySelector<HTMLElement>(".jsScreenGame");
          const scoreDisplay = document.querySelector<HTMLElement>(".jsScore");
          const moveCounter = document.querySelector<HTMLElement>(".jsMoveCounter");
          if (screenGame && scoreDisplay && moveCounter) {
            screenGame.style.display = "none";
            scoreDisplay.style.display = "none";
            moveCounter.style.display = "none";
          }
  
        }
      }, 300); // 300ms
    }
  }
  
  // Funkcija lai saktu jaunu limeni, aka jaunau raundu 
  function startNextLevel(): void {
    // Saliekma atkal random krasas
    initializeColors(); // sagatavot krasu masivu
    shuffleArray(colors);
  
    // uztaisam jaunas colorboxes
    const colorBoxesContainer = document.querySelector<HTMLElement>(".jsBoxes");
    if (colorBoxesContainer) {
      colorBoxesContainer.innerHTML = ''; // nodzēs HTML saturu
  
      for (let i = 0; i < colors.length; i++) {
        let colorBox: HTMLDivElement = document.createElement("div");
        colorBox.className = "colorBox jsColorBox";
        colorBox.dataset.color = colors[i]; // saliekam krasas dataset masiva
  
        // pieliekam event listener kliksim
        colorBox.addEventListener("click", function () {
          selectColor(colorBox);
        });
        
        //pievieno visus 6 colorboxus
        colorBoxesContainer.appendChild(colorBox);
      }
    }
  
    // izdzesam moves prieks jauna limena
    moves = 0;
    displayMoves();
  }
  
  // Izsaukt resetGame
  function resetGame(): void { //pievientos ari html kodam
    // Iztukso masivus un uztaisa visu pa nullem
    selectedColors = [];
    selectedBoxes = [];
    score = 0;
    moves = 0;
  
    // Reset the score display
    const scoreDisplay = document.querySelector<HTMLElement>(".jsScore");
    const moveCounter = document.querySelector<HTMLElement>(".jsMoveCounter");
    const screenPlayAgain = document.querySelector<HTMLElement>(".jsScreenPlayAgain");
    const screenStart = document.querySelector<HTMLElement>(".jsScreenStart");
    const screenGame = document.querySelector<HTMLElement>(".jsScreenGame");
    
    if (scoreDisplay && moveCounter && screenPlayAgain && screenStart && screenGame) {
      scoreDisplay.textContent = `Score: ${score}`;
      moveCounter.textContent = `Move count: ${moves}`;
      screenPlayAgain.style.display = "none";
      screenStart.style.display = "block";
      screenGame.style.display = "none";
    }
  
  
    // izsaucam start game funkciju
    startGame();
  }
  
  // DOM loaders
  document.addEventListener("DOMContentLoaded", function () {
    // Parbaudam vai start poga pastav un izsaucam eventlistineru kad uzkliko
    const button = document.querySelector<HTMLElement>('.jsButton');
    if (button) {
      button.addEventListener("click", function () {
        resetGame();
      });
    }
  
    // Parbaudam vai poga pastav un izsaucam eventlistineru kad uzkliko
    const playAgainButton = document.querySelector<HTMLElement>('.jsButtonAgain');
    if (playAgainButton) {
      playAgainButton.addEventListener("click", function () {
        resetGame();
      });
    }
  });
  