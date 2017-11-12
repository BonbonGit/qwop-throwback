import {staticGO, GO, ColorGO, armGO} from './class/gameobjects.js';

export var Game = {

  now: 0,
  then: 0,
  tSLF:0,//time since last frame

  ctx: null,
  canvas: null,

  gravity:10, //gravitational acceleration in px/sec
  q:false,
  w:false,
  o:false,
  p:false,

  blueSquare: new ColorGO(20, 20, 200, 750, Math.PI/4, 'blue'),
  greenSquare: new ColorGO(20, 20, 1000, 740, Math.PI/4, 'green'),

  arm: new armGO(),
  update: function(){
    this.contact();
    this.arm.accelerate(this.shoulderAcc, this.elbowAcc);
    this.arm.move();
    this.blueSquare.accelerate(0, 0, 0);
    this.blueSquare.updatePos();
    this.greenSquare.accelerate(0, 0, 0);
    this.greenSquare.updatePos();

  },
  render: function(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.blueSquare.render();
    this.greenSquare.render();
    this.arm.render();
  },
  contact: function(){

    this.collision(this.blueSquare, this.greenSquare);
  },
  collision: function(a, b){
    let xDist = a.x-b.x;
    let yDist = b.y-a.y;
    let xDistP2 = Math.pow(xDist,2);
    let yDistP2 = Math.pow(yDist,2);

    if(Math.sqrt(xDistP2+yDistP2) <= a.hitBox+b.hitBox){
      console.log(Math.sqrt(xDistP2+yDistP2));
      a.xSpeed = a.xSpeed - ((a.xSpeed-b.xSpeed)*xDist+(a.ySpeed-b.ySpeed)*yDist)/(xDistP2+yDistP2)*xDist
      a.ySpeed = a.ySpeed - ((a.xSpeed-b.xSpeed)*xDist+(a.ySpeed-b.ySpeed)*yDist)/(xDistP2+yDistP2)*yDist
      xDist = -xDist;
      yDist = -yDist;
      b.xSpeed = ((b.xSpeed-a.xSpeed)*xDist+(b.ySpeed-a.ySpeed)*yDist)/(xDistP2+yDistP2)*xDist - b.xSpeed;
      b.ySpeed = b.ySpeed - ((b.xSpeed-a.xSpeed)*xDist+(b.ySpeed-a.ySpeed)*yDist)/(xDistP2+yDistP2)*yDist;
    }
  },
  init: function(){
    events();
    this.shoulderAcc = 0;
    this.elbowAcc = 0;
    this.canvas = document.getElementById('gameArea');
    this.ctx = this.canvas.getContext('2d');
    this.then = performance.now();
    this.blueSquare.xSpeed = 100;
    this.blueSquare.ySpeed = -100;
    this.greenSquare.xSpeed = -100;
    this.greenSquare.ySpeed = -100;
    main();
  }
}
function main(){
  window.requestAnimationFrame(main);
  //time at loop start
  Game.now = performance.now();
  Game.tSLF = (Game.now - Game.then)/1000;

  if(Game.tSLF > 16/1000){ //Aprox 60FPS
    //console.log(1/this.tSLF);
    Game.update();
    Game.render();
    Game.then = Game.now;
  }
}
function events(){
  window.addEventListener('keydown', function(e) {

    switch(e.keyCode){
      case 81:
        Game.shoulderAcc=0.001;
        break;
      case 87:
        Game.shoulderAcc=-0.001;
        break;
      case 79:
        Game.elbowAcc=-0.001;
        break;
      case 80:
        Game.elbowAcc=+0.001;
        break;
    }
  });
  window.addEventListener('keyup', function(e){

    switch(e.keyCode){
      case 81:
        Game.shoulderAcc -= Game.shoulderAcc;
        break;
      case 87:
        Game.shoulderAcc -= Game.shoulderAcc;
        break;
      case 79:
        Game.elbowAcc -= Game.elbowAcc;
        break;
      case 80:
        Game.elbowAcc -= Game.elbowAcc;
        break;
    }
  });
}
