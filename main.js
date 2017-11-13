import {staticGO, GO, ColorGO, armGO} from './class/gameobjects.js';

export var Game = {

  now: 0,
  then: 0,
  tSLF:0,//time since last frame

  ctx: null,
  canvas: null,

  gravity:120, //gravitational acceleration in px/sec

  //blueSquare: new ColorGO(20, 20, 200, 50, Math.PI/4, 'blue'),
  //greenSquare: new ColorGO(20, 20, 1000, 40, Math.PI/4, 'green'),
  ground: new staticGO(1400, 40, 0, 560),
  can: new ColorGO(20, 40, 400, 400, 0, 'green'),
  releaseCan: false,
  arm: new armGO(),
  update: function(){

    this.collisions();
    this.arm.accelerate(this.shoulderAcc, this.elbowAcc);
    this.arm.move();
    if(this.releaseCan){
      this.can.accelerate(0, 10, 0.002);
      this.can.updatePos();
    }

    /*this.blueSquare.accelerate(0, 0, 0);
    this.blueSquare.updatePos();
    this.greenSquare.accelerate(0, 0, 0);
    this.greenSquare.updatePos();*/

  },
  render: function(){
    this.updateGameArea();
    //this.blueSquare.render();
    //this.greenSquare.render();
    this.arm.render();
    this.ground.render();
    if(this.releaseCan){
      this.can.render();
    }
  },
  collisions: function(){
    if(this.can.y+this.can.hitBox >= this.ground.y){
      this.can.ySpeed = -0.9*this.can.ySpeed;
      this.can.y = this.ground.y - this.can.hitBox;
      console.log(this.can.angle);
      if(this.can.angle <= -Math.PI/2 && this.can.angle >= -Math.PI){
        this.can.rotSpeed = -0.9*this.can.rotSpeed;
        if(this.can.xSpeed <= 0){
          this.can.xSpeed = -this.can.xSpeed;
        }
      } else if(this.can.angle >= Math.PI/2 && this.can.angle <= Math.PI){
        this.can.rotSpeed = -0.9*this.can.rotSpeed;
        if(this.can.xSpeed >= 0){
          this.can.xSpeed = -this.can.xSpeed;
        }
      }
    }
    //this.collision(this.blueSquare, this.greenSquare);
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
  calculateCanSpeed: function(){
    // COMPLETE DIS BITCH

    let shoulderInduced = this.arm.shoulderSpeed*this.arm.height;
    let elbowInduced = this.arm.elbowSpeed*this.arm.height;
    let thetaS = Math.PI-this.arm.shoulderAng;
    let thetaE = Math.PI-this.arm.elbowAng+thetaS;
    let sIx = shoulderInduced*Math.cos(thetaS);
    let sIy = -shoulderInduced*Math.sin(thetaS);
    let eIx = -elbowInduced*Math.cos(thetaE);
    let eIy = elbowInduced*Math.sin(thetaE);
    this.can.xSpeed = 80*(sIx+eIx);
    this.can.ySpeed = 80*(sIy+eIy);
    this.can.x = this.arm.x - Math.sin(this.arm.shoulderAng)*this.arm.height - Math.sin(this.arm.elbowAng+this.arm.shoulderAng)*(this.arm.height+this.can.height/2);
    this.can.y = this.arm.y + Math.cos(this.arm.shoulderAng)*this.arm.height + Math.cos(this.arm.elbowAng+this.arm.shoulderAng)*(this.arm.height+this.can.height/2);
    this.can.angle = this.arm.shoulderAng+this.arm.elbowAng;
    this.can.rotSpeed = -Math.sqrt(Math.pow(sIx+eIx,2)+Math.pow(sIy+eIy,2));
  },
  updateGameArea: function(){
    this.ctx.restore();
    this.ctx.clearRect(0, 0, 1400, 600)
    this.ctx.save();
    if(this.can.y < this.canvas.height/2){
      this.ctx.translate(0, -this.can.y+this.canvas.height/2);
    }
    if(this.can.x > this.canvas.width/2){
      this.ctx.translate(-this.can.x+this.canvas.width/2, 0);
      this.ground.x = this.can.x - this.ground.width/2;
    }
    console.log(this.can.x);
  },
  init: function(){
    events();
    this.shoulderAcc = 0;
    this.elbowAcc = 0;
    this.canvas = document.getElementById('gameArea');
    this.canvas.width = 1400;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext('2d');
    this.then = performance.now();
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
        Game.shoulderAcc=0.002;
        break;
      case 87:
        Game.shoulderAcc=-0.002;
        break;
      case 79:
        Game.elbowAcc=-0.002;
        break;
      case 80:
        Game.elbowAcc=+0.002;
        break;
      case 32:
        if(!Game.releaseCan){
         Game.calculateCanSpeed();
         Game.releaseCan = true;
        }
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
