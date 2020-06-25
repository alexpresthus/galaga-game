/* *****************  Declerations *****************
********************************************* */

let fireFq = 8;           //Set fire frequency from 1 - 10
let playerSpeed = 3;      //Set player movement speed
let bulletSpeed = 4;      //Set bullet speed
let enemySpeed = 0.5;     //Set enemy movement speed


//States
const LOADING = 0;
const MAIN_MENU = 1;
const PLAY = 2;
const LEADERBOARD = 3;
const GAME_OVER = 4;
const GAME_COMPLETE = 5;


//Screens
let loadingScreen, mainMenuScreen, playScreen, leaderboardScreen;


//Initial state
let currentState = LOADING;


//Background animation
const starsN = 20; //number of background stars
const bgSpeed = 3; //speed of background stars
let starsX, starsY; //Arrays for all points' x and y value


//Data
let stages;
let leaderboard;


//Assets
  //images
  let galaga_spritesheet;
  let imgPlayer;
  let imgExp01, imgExp02, imgExp03, imgExp04;
  let imgBullet;
  let imgEnemyBullet;
  let imgE1_01, imgE1_02, imgE2_01, imgE2_02, imgE3_01, imgE3_02, imgE4_01, imgE4_02;
  let imgEnExp01, imgEnExp02, imgEnExp03, imgEnExp04, imgEnExp05;

  //sounds
  let bgMusic;
  let soundBullet;
  let soundExplosion;
  let soundButton;
  let soundGameOver;
  let soundGameComplete;
  let soundLifeLost;

  //Typography
  let font;


//Sprites
let player;
let bullets;
let bulletWallTop;
let bulletWallBottom;
let enemyGrid;
let activeEnemies;
let enemyBullets;


//Other Global variables
let curLabel, curFrame, lastFrame;
let curScore, highScore;
let curStage = 0;
let curLoad = 0;
let curEnemy = 0;
let lives = 2;
let frameBulletFired;
let frameGap;
let firstFrame = true;
let gameScreenRight, gameScreenLeft;
let playerTag;
let counter;
let stageShowing;
let stageCount;
let canvas;
let gameWidth = 500;


//DOMs
let curScoreValue;
let highScoreValue;
let oneLifeLeft, twoLivesLeft;
let playerTagInput;
let pausePlayButton;
let stageDiv;
let pauseP;
let lbCell11, lbCell21, lbCell31, lbCell41, lbCell51;
let lbCell12, lbCell22, lbCell32, lbCell42, lbCell52;










/* *****************  Setup *****************
********************************************* */



function preload () {
  font = loadFont('./assets/TurretRoad-Regular.ttf');
  stages = loadJSON("./stages.json");
  leaderboard = loadJSON("./leaderboard.json");
  galaga_spritesheet = loadImage("./img/galaga_spritesheet.png");
  soundBullet = loadSound("./sound/laser-shot.wav");
  soundExplosion = loadSound("./sound/explosion.wav");
  soundButton = loadSound("./sound/button-click.wav");
  bgMusic = loadSound("./sound/bg-music.wav");
  soundGameOver = loadSound("./sound/game-over.wav");
  soundGameComplete = loadSound("./sound/game-complete.mp3");
  soundLifeLost = loadSound("./sound/life-lost.wav");
}

function setup () {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style("vertical-align: top"); //hide scrollbars in full screen
    textFont(font);

    //Inital variables
    curScore = 0;
    highScore = 30000;
    gameScreenRight = width/2 + gameWidth/2;
    gameScreenLeft = width/2 - gameWidth/2;
    highScore = leaderboard.scores[0].score;
    counter = 180;

    //Background
    starsX = new Array(starsN);
    starsY = new Array(starsN);
    let x, y;
    for (let i = 0; i < starsN; i++) {
      x = random(gameScreenLeft, gameScreenRight);
      y = random(0, height);
      starsX[i] = x;
      starsY[i] = y;
    }

    //Images
    imgPlayer = galaga_spritesheet.get(160, 55, 15, 16);
    imgBullet = galaga_spritesheet.get(374, 51, 3, 8);
    imgEnemyBullet = galaga_spritesheet.get(388, 220, 8, 3);
    imgEnemyBullet.scale=-1;
    imgExp01 = galaga_spritesheet.get(208, 47, 32, 32);
    imgExp02 = galaga_spritesheet.get(248, 47, 32, 32);
    imgExp03 = galaga_spritesheet.get(288, 47, 32, 32);
    imgExp04 = galaga_spritesheet.get(328, 47, 32, 32);
    imgE1_01 = galaga_spritesheet.get(161, 104, 16, 15);
    imgE1_02 = galaga_spritesheet.get(185, 104, 16, 15);
    imgE2_01 = galaga_spritesheet.get(161, 128, 16, 15);
    imgE2_02 = galaga_spritesheet.get(185, 128, 16, 15);
    imgE3_01 = galaga_spritesheet.get(161, 152, 16, 15);
    imgE3_02 = galaga_spritesheet.get(185, 152, 16, 15);
    imgE4_01 = galaga_spritesheet.get(161, 176, 16, 15);
    imgE4_02 = galaga_spritesheet.get(185, 176, 16, 15);
    imgEnExp01 = galaga_spritesheet.get(199, 191, 32, 32);
    imgEnExp02 = galaga_spritesheet.get(224, 191, 32, 32);
    imgEnExp03 = galaga_spritesheet.get(248, 191, 32, 32);
    imgEnExp04 = galaga_spritesheet.get(280, 191, 32, 32);
    imgEnExp05 = galaga_spritesheet.get(321, 191, 32, 32);

    //Create Loading Screen
    loadingScreen = createDiv();

    //Create Main Menu Screen
    mainMenuScreen = createDiv();
    mainMenuScreen.hide();

    //Create Play Screen
    playScreen = createDiv();
    playScreen.hide();

    //Create Leaderboard Screen
    leaderboardScreen = createDiv();
    leaderboardScreen.hide();

    //Create Game Over Screen
    gameOverScreen = createDiv();
    gameOverScreen.hide();

    //Create Game Complete Screen
    gameCompleteScreen = createDiv();
    gameCompleteScreen.hide();

    //Player sprite
    player = createSprite(width/2, height-50, 15, 16);
    player.addImage(imgPlayer);
    player.setCollider("circle", 0, 0, 8);
    player.mass=2;
    player.addAnimation("normal", imgPlayer);
    player.addAnimation("explode", imgExp01, imgExp02, imgExp03, imgExp04);
    player.scale=2;

    //Enemy grid and sprites
    enemyGrid = [
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*0, "y": 100}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*1, "y": 100}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*2, "y": 100}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*3, "y": 100}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*4, "y": 100}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*5, "y": 100}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*6, "y": 100}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*7, "y": 100}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*8, "y": 100}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*9, "y": 100}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*0, "y": 150}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*1, "y": 150}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*2, "y": 150}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*3, "y": 150}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*4, "y": 150}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*5, "y": 150}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*6, "y": 150}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*7, "y": 150}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*8, "y": 150}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*9, "y": 150}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*0, "y": 200}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*1, "y": 200}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*2, "y": 200}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*3, "y": 200}},
      {"taken":false, "position":{"x": gameScreenLeft+40 +40*4, "y": 200}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*5, "y": 200}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*6, "y": 200}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*7, "y": 200}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*8, "y": 200}},
      {"taken":false, "position":{"x": gameScreenLeft+60 +40*9, "y": 200}}
    ];
    activeEnemies = new Group();
    enemyBullets = new Group();

    //Bullet setup
    bullets = new Group();
    frameBulletFired = 0;
    frameGap = 0;

    bulletWallTop = createSprite(width/2, 2, gameWidth, 4);
    bulletWallTop.visible = false;
    bulletWallBottom = createSprite(width/2, height-2, gameWidth, 4);
    bulletWallBottom.visible = false;




    /* *****************  DOMs *****************
    ******************************************** */


    playerTagInput = createInput("Enter player tag...");
    playerTagInput.style("font-size", "18px");
    playerTagInput.style("color", "#808080");
    playerTagInput.style("border-color", "RED")
    playerTagInput.style("border-style", "solid");
    playerTagInput.style("font-family", "TurretRoad-Regular");
    playerTagInput.style("background-color", "#000");
    playerTagInput.style("text-align", "center");
    playerTagInput.style("padding", "1px 6px");
    playerTagInput.position(width/2- 114.65, height/2);
    playerTagInput.input(playerTagInputEvent);
    playerTagInput.parent(mainMenuScreen);

    let playButton = createButton("Play");
    playButton.id(PLAY);
    playButton.style("font-size", "18px");
    playButton.style("color", "#FFF");
    playButton.style("border-style", "solid");
    playButton.style("font-family", "TurretRoad-Regular");
    playButton.style("background-color", "#000");
    playButton.position(width/2 -25.9, height/2 + 50);
    playButton.mousePressed(changeScreenButton);
    playButton.parent(mainMenuScreen);

    let playButtonlb = createButton("Play");
    playButtonlb.id(PLAY);
    playButtonlb.style("font-size", "18px");
    playButtonlb.style("color", "#FFF");
    playButtonlb.style("border-style", "solid");
    playButtonlb.style("font-family", "TurretRoad-Regular");
    playButtonlb.style("background-color", "#000");
    playButtonlb.position(width/2, height-100);
    playButtonlb.center("horizontal");
    playButtonlb.mousePressed(changeScreenButton);
    playButtonlb.parent(leaderboardScreen);

    let leaderboardButton = createButton("Leaderboard");
    leaderboardButton.id(LEADERBOARD);
    leaderboardButton.style("font-size", "18px");
    leaderboardButton.style("color", "#FFF");
    leaderboardButton.style("border-style", "solid");
    leaderboardButton.style("font-family", "TurretRoad-Regular");
    leaderboardButton.style("background-color", "#000");
    leaderboardButton.position(width/2 -60.2, height/2 + 100);
    leaderboardButton.mousePressed(changeScreenButton);
    leaderboardButton.parent(mainMenuScreen);

    let menuButton = createButton("Main Menu");
    menuButton.id(MAIN_MENU);
    menuButton.style("font-size", "18px");
    menuButton.style("color", "#FFF");
    menuButton.style("border-style", "solid");
    menuButton.style("font-family", "TurretRoad-Regular");
    menuButton.style("background-color", "#000");
    menuButton.position(width/2, height - 50);
    menuButton.center("horizontal");
    menuButton.mousePressed(changeScreenButton);
    menuButton.parent(leaderboardScreen);

    let menuButtonP = createButton("Main Menu");
    menuButtonP.id(MAIN_MENU);
    menuButtonP.style("font-size", "18px");
    menuButtonP.style("color", "#FFF");
    menuButtonP.style("border-style", "solid");
    menuButtonP.style("font-family", "TurretRoad-Regular");
    menuButtonP.style("background-color", "#000");
    menuButtonP.position(width/2 - 400, height - 70);
    menuButtonP.mousePressed(changeScreenButton);
    menuButtonP.parent(playScreen);

    pausePlayButton = createButton("Pause Game");
    pausePlayButton.style("font-size", "18px");
    pausePlayButton.style("color", "#FFF");
    pausePlayButton.style("border-style", "solid");
    pausePlayButton.style("font-family", "TurretRoad-Regular");
    pausePlayButton.style("background-color", "#000");
    pausePlayButton.position(width/2 - 400, height - 120);
    pausePlayButton.mousePressed(pausePlay);
    pausePlayButton.parent(playScreen);

    const scoreDiv = createDiv();
    scoreDiv.style("border-style", "hidden");
    scoreDiv.style("font-family", "TurretRoad-Regular");
    scoreDiv.style("background-color", "#000");
    scoreDiv.style("align-items", "center");
    scoreDiv.style("text-align", "center");
    scoreDiv.style("text-align-last", "center");
    scoreDiv.position(gameScreenRight, height/2);
    scoreDiv.size(150, 200);
    scoreDiv.parent(playScreen);

    const scoreDivh1 = createP("HIGH SCORE");
    scoreDivh1.parent(scoreDiv);
    scoreDivh1.style("font-size", "14px");
    scoreDivh1.style("color", "RED");
    scoreDivh1.style("display", "inline-block");
    scoreDivh1.style("padding", "10px 10px");
    scoreDivh1.style("position", "relative");

    highScoreValue = createP(highScore.toString());
    highScoreValue.parent(scoreDiv);
    highScoreValue.style("font-size", "14px");
    highScoreValue.style("color", "#FFF");
    highScoreValue.style("display", "inline-block");
    highScoreValue.style("padding-top", "10px 10px");
    highScoreValue.style("position", "relative");

    curScoreValue = createP(curScore.toString());
    curScoreValue.parent(scoreDiv);
    curScoreValue.style("font-size", "14px");
    curScoreValue.style("color", "#FFF");
    curScoreValue.style("display", "inline-block");
    curScoreValue.style("padding", "50px 20px");
    curScoreValue.style("position", "relative");

    oneLifeLeft = createImg("./img/onelife.png");
    oneLifeLeft.size(32,32);
    oneLifeLeft.parent(playScreen);
    oneLifeLeft.position(gameScreenRight+50, height-67);
    oneLifeLeft.hide();

    twoLivesLeft = createImg("./img/twolives.png");
    twoLivesLeft.size(64,32);
    twoLivesLeft.parent(playScreen);
    twoLivesLeft.position(gameScreenRight+50, height-67);

    stageDiv = createDiv();
    stageDiv.position(width/2 -24, height/2);
    stageDiv.style("font-size", "14px");
    stageDiv.style("color", "CYAN");
    stageDiv.style("border-style", "hidden");
    stageDiv.style("font-family", "TurretRoad-Regular");
    stageDiv.parent(playScreen);

    pauseP = createP("GAME PAUSED");
    pauseP.style("font-family", "TurretRoad-Regular");
    pauseP.style("font-size", "24px");
    pauseP.style("color", "#FFF");
    pauseP.position(width/2 -84.65, height/2);
    pauseP.parent(playScreen);
    pauseP.hide();

    let lbTable = createDiv();
    lbTable.style("display", "table");
    lbTable.style("font-family", "TurretRoad-Regular");
    lbTable.style("color", "#FFF");
    lbTable.position(width/2-115, 200);
    lbTable.size(230, 300);
    lbTable.parent(leaderboardScreen);

    let lbCol1 = createDiv();
    lbCol1.style("display", "table-column");
    lbCol1.style("white-space", "pre");
    lbCol1.parent(lbTable);

    let lbCol2 = createDiv();
    lbCol2.style("display", "table-column");
    lbCol2.size(50, 300);
    lbCol2.parent(lbTable);

    let lbRow1 = createDiv();
    lbRow1.style("display", "table-row");
    lbRow1.parent(lbTable);

      lbCell11 = createDiv();
      lbCell11.style("display", "table-cell");
      lbCell11.parent(lbRow1);

      lbCell12 = createDiv();
      lbCell12.style("display", "table-cell");
      lbCell12.parent(lbRow1);

    let lbRow2 = createDiv();
    lbRow2.style("display", "table-row");
    lbRow2.parent(lbTable);

      lbCell21 = createDiv();
      lbCell21.style("display", "table-cell");
      lbCell21.parent(lbRow2);

      lbCell22 = createDiv();
      lbCell22.style("display", "table-cell");
      lbCell22.parent(lbRow2);

    let lbRow3 = createDiv();
    lbRow3.style("display", "table-row");
    lbRow3.parent(lbTable);

      lbCell31 = createDiv();
      lbCell31.style("display", "table-cell");
      lbCell31.parent(lbRow3);

      lbCell32 = createDiv();
      lbCell32.style("display", "table-cell");
      lbCell32.parent(lbRow3);

    let lbRow4 = createDiv();
    lbRow4.style("display", "table-row");
    lbRow4.parent(lbTable);

      lbCell41 = createDiv();
      lbCell41.style("display", "table-cell");
      lbCell41.parent(lbRow4);

      lbCell42 = createDiv();
      lbCell42.style("display", "table-cell");
      lbCell42.parent(lbRow4);

    let lbRow5 = createDiv();
    lbRow5.style("display", "table-row");
    lbRow5.parent(lbTable);

      lbCell51 = createDiv();
      lbCell51.style("display", "table-cell");
      lbCell51.parent(lbRow5);

      lbCell52 = createDiv();
      lbCell52.style("display", "table-cell");
      lbCell52.parent(lbRow5);

      updateLeaderboard();

}










/* *****************  EVENT HANDLERS *****************
****************************************************** */



//Switch Screen on Button Press
function changeScreenButton () {
  soundButton.setVolume(0.5);
  soundButton.play();
  changeScreen(this.id());
}


//Switch Screen and State call function
function changeScreen (nextState) {
  if (nextState == MAIN_MENU){
    if (currentState == LOADING) {
      loadingScreen.hide();
      mainMenuScreen.show();
    }
    else if (currentState == LEADERBOARD) {
      leaderboardScreen.hide();
      mainMenuScreen.show();
    }
    else if (currentState == PLAY) {
      //if game is paused, loop() and reset pause/play button
      if (pausePlayButton.html() == "Resume Game") {
        loop();
        pauseP.hide();
        pausePlayButton.html("Pause Game");
      }
      //stop music
      bgMusic.stop();
      playScreen.hide();
      mainMenuScreen.show();
      updateLeaderboard();
    }
    currentState = MAIN_MENU;
  }

  else if (nextState == PLAY) {
    resetGame();
    //music
    bgMusic.setVolume(0.5);
    bgMusic.play();
    bgMusic.setLoop(true);
    //stageDisplay
    displayStage();

    if (currentState == MAIN_MENU){
      mainMenuScreen.hide();
      playScreen.show();
    }
    else if (currentState == LEADERBOARD){
      leaderboardScreen.hide();
      playScreen.show();
    }
    currentState = PLAY;
  }

  else if (nextState == LEADERBOARD) {
    if (currentState == MAIN_MENU){
      mainMenuScreen.hide();
      leaderboardScreen.show();
    }
    else if (currentState == PLAY) {
      playScreen.hide();
      leaderboardScreen.show();
    }
    else if (currentState == GAME_OVER) {
      gameOverScreen.hide();
      leaderboardScreen.show();
    }
    else if (currentState == GAME_COMPLETE) {
      gameCompleteScreen.hide();
      leaderboardScreen.show();
    }
    currentState = LEADERBOARD;
  }

  else if (nextState == GAME_OVER) {
    bgMusic.stop();
    if (currentState == PLAY){
      playScreen.hide();
      gameOverScreen.show();
    }
    currentState = GAME_OVER;
  }

  else if (nextState == GAME_COMPLETE) {
    bgMusic.stop();
    if (currentState == PLAY){
      playScreen.hide();
      gameCompleteScreen.show();
    }
    currentState = GAME_COMPLETE;
  }
}


function playerTagInputEvent () {
  playerTag = this.value();
  this.html(this.value());
  this.style("color", "#FFF");
  this.style("border-color", "#FFF")
}


function pausePlay () {
  soundButton.setVolume(1);
  soundButton.play();
  if(this.html() == "Pause Game") {
    this.html("Resume Game");
    bgMusic.pause();
    pauseP.show();
    noLoop();
  } else {
    this.html("Pause Game");
    bgMusic.play();
    pauseP.hide();
    loop();
  }
}










/* *****************  DRAW *****************
******************************************** */



function draw() {
  drawBackground();
  switch (currentState) {
    case LOADING:
      drawLoadingScreen();
      break;
    case MAIN_MENU:
      drawMainMenuScreen();
      break;
    case PLAY:
      drawPlayScreen();
      break;
    case LEADERBOARD:
      drawLeaderboardScreen();
      break;
    case GAME_OVER:
      drawGameOverScreen();
      break;
    case GAME_COMPLETE:
      drawGameCompleteScreen();
      break;
    default:
      drawLoadingScreen();
  }
}


// Loading Screen

function drawLoadingScreen() {
  noStroke(); textSize(36); textAlign(CENTER, CENTER); fill(255); text("Loading Game", width/2, 200);
  textAlign(LEFT, CENTER);
  let n = frameCount%60;
  if (n < 10) {
    text("", width/2 + 100, 200);
  }
  else if (n < 20) {
    text("  .", width/2 + 100, 200);
  }
  else if (n < 30) {
    text("  . .", width/2 + 100, 200);
  }
  else if (n < 40) {
    text("  . . .", width/2 + 100, 200);
  }
  else {
    text("  . . . .", width/2 + 100, 200);
  }
  if (frameCount == 60) {
    changeScreen(MAIN_MENU);
  }
}


// Main Menu

function drawMainMenuScreen() {
  noStroke(); textSize(36); textAlign(CENTER, CENTER); fill(255); text("MAIN MENU", width/2, 150);
}


// Play

function drawPlayScreen() {
  curLabel = player.getAnimationLabel();
  curFrame = player.animation.getFrame();
  lastFrame = player.animation.getLastFrame();

  if (stageShowing) {
    stageCount--;
    if (stageCount == 0) {
      stageDiv.hide();
      stageShowing = false;
    }
  }
  collisionDetection();
  drawSprites();
  editEnemies();
  editPlayer();
  updateScore();
}


// Leaderboard

function drawLeaderboardScreen() {
  noStroke(); textSize(36); textAlign(CENTER, CENTER); fill(255); text("LEADERBOARD", width/2, 150);
}


// Game Over

function drawGameOverScreen() {
  noStroke(); textSize(50); textAlign(CENTER, CENTER); fill("RED"); text("GAME OVER", width/2, height/2);
  counter--;
  if (counter == 0) {
    changeScreen(LEADERBOARD);
  }
}


// Game Complete

function drawGameCompleteScreen() {
  noStroke(); textSize(50); textAlign(CENTER, CENTER); fill("#FFF"); text("GAME COMPLETED", width/2, height/2);
  textSize(16); fill("RED"); text("Score  ",width/2 -50, height/2 +100); fill("#FFF"); text(curScore, width/2 +50, height/2 +100);
  counter--;
  if (counter == 0) {
    changeScreen(LEADERBOARD);
  }
}


// Background

function drawBackground() {
  background(0);
  strokeWeight(1);
  stroke(255);
  for (let i = 0; i < starsN; i++) {
    point(starsX[i], starsY[i], 2);
    starsY[i] += bgSpeed;
    if (starsY[i] > height) {
      starsY[i] = 0;
    }
  }
}










/* *****************  PLAY FUNCTIONS *****************
***************************************************** */



function updateScore () {
  //update current score
  curScoreValue.html(curScore);
  highScoreValue.html(highScore.toString());

  //update high score
  if (curScore > highScore) {
    highScore = curScore;
  }
}


function displayStage() {
  stageShowing = true;
  stageCount = 120;
  stageDiv.html("Stage " + int(curStage+1).toString());
  stageDiv.show();
}


function editEnemies () {
  let x2 = player.position.x;
  let y2 = player.position.y;

  for (let i = 0; i < activeEnemies.length; i++) {
    let spr = activeEnemies.get(i);
    //check end of explosion and remove sprite
    if (spr.getAnimationLabel() == "explode" && spr.animation.getFrame() == spr.animation.getLastFrame()){
      spr.remove();
    }

    //move enemies back and forth
    if (frameCount%120 == 0) {
      if (spr.getDirection() == 180) {
        spr.setVelocity(enemySpeed, 0);
      } else if (spr.getDirection() == 0) {
        spr.setVelocity(-1 * enemySpeed, 0);
      }
    }

    //move down
    if (i%6 == 0) {
      spr.friction=0.5;
      spr.attractionPoint(1, x2, y2);
    }
  }

  //if more stages in WaveCollection
  if (curStage < stages.totalStages && !stageShowing) {
    //if more enemies in stage
    if (curEnemy < stages.stages[curStage].totalLoads * 5){
      if (curEnemy > 4 && curEnemy%5 == 0) {curLoad++; console.log("curLoad: " + curLoad);}
      let sprEnemy = createSprite(enemyGrid[curEnemy].position.x, enemyGrid[curEnemy].position.y, 30, 32);
      switch (stages.stages[curStage].loads[curLoad].type){
        case "e1":
          sprEnemy.addAnimation("e1", imgE1_01, imgE1_02);
          break;
        case "e2":
          sprEnemy.addAnimation("e2", imgE2_01, imgE2_02);
          break;
        case "e3":
          sprEnemy.addAnimation("e3", imgE3_01, imgE3_02);
          break;
        case "e4":
          sprEnemy.addAnimation("e4", imgE4_01, imgE4_02);
          break;
        default:
          sprEnemy.addAnimation("e", imgE1_01, imgE1_02);
      }
      sprEnemy.setCollider("circle", 0, 0, 8);
      sprEnemy.addAnimation("explode", imgEnExp01, imgEnExp02, imgEnExp03, imgEnExp04, imgEnExp05);
      sprEnemy.setVelocity(enemySpeed, 0);
      sprEnemy.scale=2;
      sprEnemy.animation.frameDelay = 8;
      activeEnemies.add(sprEnemy);
      curEnemy++;
    } else {
      //no more enemies in stage. If all enemies are dead, empty screen and show stageDisplay
      //if stageShowing = false, go next stage
      if (activeEnemies.size() == 0) {
        curLoad = 0;
        curEnemy = 0;
        bullets.removeSprites();
        enemyBullets.removeSprites();
        if (stageShowing == false) {
          curStage++;
          displayStage();
        }
      }
    }
  } else {
    //no more stages. If all enemies are dead, game complete
    if (activeEnemies.size() == 0 && curStage == stages.totalStages) {
      updateLeaderboard();
      soundGameComplete.setVolume(0.7);
      soundGameComplete.play();
      changeScreen(GAME_COMPLETE);
    }
  }

  //Enemy bullets
  let scale = map(curStage, 0, stages.totalStages, 150, 30);
  if ((frameCount%scale == 0 || frameCount%(scale+20) == 0) && !stageShowing) {
    let x = width/2;
    let y = 0;
    let sprEnemyBullet = createSprite(x, y, 3, 8);
    sprEnemyBullet.addImage(imgEnemyBullet);
    sprEnemyBullet.rotateToDirection = true;
    sprEnemyBullet.setVelocity((player.position.x - x)/180, (player.position.y - y) /180);
    sprEnemyBullet.scale=2;
    enemyBullets.add(sprEnemyBullet);
  }
}


function editPlayer () {

  //check end of explosion and reset player
  if (curLabel == "explode" && curFrame == lastFrame) {
    player.changeAnimation("normal");
    player.animation.looping = true;
  }

  //check arrow keys and move player
  if (keyIsDown(RIGHT_ARROW) && player.position.x < gameScreenRight) {
    console.log("->");
    player.setVelocity(playerSpeed,0);
  }
  else if (keyIsDown(LEFT_ARROW) && player.position.x > gameScreenLeft) {
    console.log("<-");
    player.setVelocity(playerSpeed * -1,0);
  } else {
    player.setVelocity(0,0);
  }

  //fire
  frameGap = frameCount - frameBulletFired;
  if (keyIsDown(CONTROL) && curLabel == "normal" && frameGap > map(fireFq, 1, 10, 60, 6)) {
    frameBulletFired = frameCount;
    let sprBullet = createSprite(player.position.x, player.position.y-30, 3, 8);
    sprBullet.setSpeed(bulletSpeed, 270);
    sprBullet.addImage(imgBullet);
    sprBullet.scale=2;
    soundBullet.setVolume(0.25);
    soundBullet.play();
    bullets.add(sprBullet);
  }
}










/* *****************  COLLISSION DETECTION AND EXECUTION *****************
************************************************************************** */



function collisionDetection () {
  //only detect collision if label is normal (e.g. not during explode)
  if (curLabel == "normal") {
    //check bullet hit on enemy group. If hit: explode and remove enemy sprite from group
    activeEnemies.collide(bullets, enemyDie);

    //if bullet his end of canvas, remove bullet sprite from group
    bullets.collide(bulletWallTop, bulletMiss);

    //if enemy bullet his end of canvas, remove bullet sprite from group
    enemyBullets.collide(bulletWallBottom, bulletMiss);

    //check enemy hit on player sprite. If hit: explode, lose 1 life, respawn if more lives.
    activeEnemies.collide(player, playerCrash);
    enemyBullets.collide(player, playerCrash);
  }
}

function enemyDie (spriteA, spriteB) {
  //decide score points based on type of enemy
  switch (spriteA.getAnimationLabel()){
    case "e1":
      curScore += 100;
      break;
    case "e2":
      curScore += 150;
      break;
    case "e3":
      curScore += 200;
      break;
    case "e4":
      curScore += 250;
      break;
    default:
      curScore += 100;
      break;
  }
  spriteA.changeAnimation("explode");
  spriteA.animation.frameDelay = 4;
  spriteA.animation.looping = false;
  spriteB.remove();
}


function bulletMiss (spriteA, spriteB) {
  spriteA.remove();
}


function playerCrash (spriteA, spriteB) {
  //spriteA.explode
  spriteA.remove();
  spriteB.changeAnimation("explode");
  soundExplosion.setVolume(0.25);
  soundExplosion.play();
  spriteB.animation.frameDelay = 16;
  spriteB.animation.looping = false;

  lives--;
  switch (lives) {
    case 0:
      //GAME OVER
      updateLeaderboard();
      soundGameOver.setVolume(0.7);
      soundGameOver.play();
      changeScreen(GAME_OVER);
      break;
    case 1:
      twoLivesLeft.hide();
      oneLifeLeft.show();
      break;
    default:
  }
}










/* *****************  LEADERBOARD UPDATE *****************
********************************************************** */



function updateLeaderboard () {
  //check and update leaderboard
  let thisScore = curScore;
  let thisTag = playerTag;
  let nextTag;
  let nextScore;
  for (let i = 0; i < leaderboard.totalScores; i++) {
    //if current score is better than current position's high score
    //replace high score + tag and pivot rest down
    nextTag = leaderboard.scores[i].tag;
    nextScore = leaderboard.scores[i].score;
    if (thisScore > nextScore) {
      //change to new values
      leaderboard.scores[i].tag = thisTag;
      leaderboard.scores[i].score = thisScore;
      thisScore = nextScore;
      thisTag = nextTag;
    }
  }

  lbCell11.html("1.   " + leaderboard.scores[0].tag);
  lbCell21.html("2.   " + leaderboard.scores[1].tag);
  lbCell31.html("3.   " + leaderboard.scores[2].tag);
  lbCell41.html("4.   " + leaderboard.scores[3].tag);
  lbCell51.html("5.   " + leaderboard.scores[4].tag);

  lbCell12.html(leaderboard.scores[0].score);
  lbCell22.html(leaderboard.scores[1].score);
  lbCell32.html(leaderboard.scores[2].score);
  lbCell42.html(leaderboard.scores[3].score);
  lbCell52.html(leaderboard.scores[4].score);
}










/* *****************  RESET GAME *****************
************************************************** */



function resetGame () {
  //reset counter for Game Over and Game Complete Screen
  counter = 180;

  //reset game score
  curScore = 0;
  lives = 2;
  highScore = leaderboard.scores[0].score;

  //empty Groups
  activeEnemies.removeSprites();
  bullets.removeSprites();
  enemyBullets.removeSprites();

  //reset current enemy and stage status
  curStage = 0;
  curLoad = 0;
  curEnemy = 0;

  //reset player tag
  playerTagInput.html("enter player tag...");
  playerTagInput.style("color", "#808080");
  playerTagInput.style("border-color", "#FFF")

  //remove and reinstate player sprite
  player.remove();
  player = createSprite(width/2, height-50, 15, 16);
  player.addImage(imgPlayer);
  player.addAnimation("normal", imgPlayer);
  player.addAnimation("explode", imgExp01, imgExp02, imgExp03, imgExp04);
  player.scale=2;

  //reset images showing lives
  oneLifeLeft.hide();
  twoLivesLeft.show();
}
