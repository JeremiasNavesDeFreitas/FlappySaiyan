import Phaser from 'phaser';
import backgroundImg from './assets/background.png';
import birdImg from './assets/bird.png';
//import pipeImg from './assets/pipe.png';

const config = {
  type: Phaser.AUTO,
  width: 288,
  height: 512,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      enableBody: true,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);

let bird;
let pipes;
let score = 0;
let scoreText;

function preload() {
  this.load.image('background', backgroundImg);
  this.load.image('bird', birdImg);
  //this.load.image('pipe', pipeImg);
}

function create() {
  this.add.image(0, 0, 'background').setOrigin(0, 0);

  bird = this.physics.add.sprite(50, 250, 'bird');
  bird.setCollideWorldBounds(true);
  bird.setBounce(0.2);

  pipes = this.physics.add.group({
    immovable: true,
    allowGravity: false,
  });

  this.input.on('pointerdown', flap);

  this.time.addEvent({
    delay: 1500,
    callback: createPipe,
    callbackScope: this,
    loop: true,
  });

  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#000',
  });
}

function update() {
  if (bird.y > game.config.height - bird.height / 2) {
    restartGame();
    return;
  }

  this.physics.world.overlap(bird, pipes, hitPipe, null, this);
}

function flap() {
  bird.setVelocityY(-400);
}

function createPipe() {
  const gap = 150;
  const position = Math.floor(Math.random() * (game.config.height - gap)) + gap / 2;

  const pipeTop = pipes.create(game.config.width, position - gap / 2, 'pipe').setOrigin(0, 1);
  const pipeBottom = pipes.create(game.config.width, position + gap / 2, 'pipe').setOrigin(0, 0);

  pipeTop.setVelocityX(-200);
  pipeBottom.setVelocityX(-200);

  pipeTop.body.allowGravity = false;
  pipeBottom.body.allowGravity = false;

  pipeTop.scored = false;

  pipeTop.body.setSize(pipeTop.width, pipeTop.height - 20);
  pipeBottom.body.setSize(pipeBottom.width, pipeBottom.height - 20);
}

function hitPipe() {
  restartGame();
}

function restartGame() {
  score = 0;
  scoreText.setText(`Score: ${score}`);
  bird.setPosition(50, 250);
  bird.setVelocity(0);
  pipes.clear(true, true);
}