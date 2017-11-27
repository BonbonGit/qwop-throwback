import {StaticGO, GO, ColorGO, ImageGO, ArmGO} from './class/gameobjects.js';
import {Score, Menu} from './class/display.js';
import {Sound} from './class/sound.js';

export var Game = {

  now: 0,
  then: 0,
  tSLF:0,//time since last frame

  areaX:0,
  areaY:0,

  pause: false,
  menu: new Menu(),
  score: new Score(10,10,undefined,'grey'),

  ctx: null,
  canvas: null,

  gravity:120, //gravitational acceleration in px/sec

  //blueSquare: new ColorGO(20, 20, 200, 50, Math.PI/4, 'blue'),
  //greenSquare: new ColorGO(20, 20, 1000, 40, Math.PI/4, 'green'),
  ground: null,
  can: null,
  releaseCan: null,
  arm: null,
  sounds: null,

  update: function(){

    this.collisions();

    this.arm.accelerate(this.shoulderAcc, this.elbowAcc);
    this.arm.move();
    if(this.releaseCan){
      this.can.accelerate(0, 0, 0);
      this.can.updatePos();
      this.score.updateScore(Math.round(this.can.x/10)-this.arm.x/10);
      if (Math.abs(this.can.ySpeed) < 5 && this.can.y > this.ground.y - this.can.hitBox) {
        Game.pause = true;
      }
    }
    if(this.pause){
      this.menu.render();
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
    this.score.render();

  },
  collisions: function(){

    if(this.can.y+this.can.hitBox >= this.ground.y){
      let startX = (this.can.x > this.canvas.width/2)?this.canvas.width/2:this.can.x;
      startX -= this.can.hitBox;// + this.areaY;
      let pixelData = this.ctx.getImageData(startX, Math.floor(this.ground.y - 1), this.can.hitBox*2, 1);
      let pixelCollision = false;

      for (let i = 3; i < pixelData.data.length; i+=4) {
        pixelCollision = (pixelData.data[i] != 0);
        if (pixelCollision) {
          break;
        }
      }
      if (pixelCollision) {
        if(!this.mobile){
          this.sounds[Math.floor(Math.random()*3)].play();
        }

        this.can.ySpeed = -0.9*this.can.ySpeed;
        this.can.y = this.can.y - 1;
        //console.log(this.can.angle);
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
    }
    //this.collision(this.blueSquare, this.greenSquare);
  },
  collision: function(a, b){
    let xDist = a.x-b.x;
    let yDist = b.y-a.y;
    let xDistP2 = Math.pow(xDist,2);
    let yDistP2 = Math.pow(yDist,2);

    if(Math.sqrt(xDistP2+yDistP2) <= a.hitBox+b.hitBox){
      a.xSpeed = a.xSpeed - ((a.xSpeed-b.xSpeed)*xDist+(a.ySpeed-b.ySpeed)*yDist)/(xDistP2+yDistP2)*xDist
      a.ySpeed = a.ySpeed - ((a.xSpeed-b.xSpeed)*xDist+(a.ySpeed-b.ySpeed)*yDist)/(xDistP2+yDistP2)*yDist
      xDist = -xDist;
      yDist = -yDist;
      b.xSpeed = ((b.xSpeed-a.xSpeed)*xDist+(b.ySpeed-a.ySpeed)*yDist)/(xDistP2+yDistP2)*xDist - b.xSpeed;
      b.ySpeed = b.ySpeed - ((b.xSpeed-a.xSpeed)*xDist+(b.ySpeed-a.ySpeed)*yDist)/(xDistP2+yDistP2)*yDist;
    }
  },
  calculateCanSpeed: function(){

    let shoulderInduced = this.arm.shoulderSpeed*this.arm.height;
    let elbowInduced = this.arm.elbowSpeed*this.arm.height;
    let thetaS = Math.PI-this.arm.shoulderAng;
    let thetaE = Math.PI-this.arm.elbowAng+thetaS;

    let sIx = shoulderInduced*Math.cos(thetaS);
    let sIy = -shoulderInduced*Math.sin(thetaS);
    let eIx = -elbowInduced*Math.cos(thetaE);
    let eIy = elbowInduced*Math.sin(thetaE);
    this.can.xSpeed = 40*(sIx+eIx);
    this.can.ySpeed = 40*(sIy+eIy);
    this.can.x = this.arm.x - Math.sin(this.arm.shoulderAng)*this.arm.height - Math.sin(this.arm.elbowAng+this.arm.shoulderAng)*(this.arm.height+this.can.height/2);
    this.can.y = this.arm.y + Math.cos(this.arm.shoulderAng)*this.arm.height + Math.cos(this.arm.elbowAng+this.arm.shoulderAng)*(this.arm.height+this.can.height/2);
    this.can.angle = this.arm.shoulderAng+this.arm.elbowAng;
    this.can.rotSpeed = -Math.sqrt(Math.pow(sIx+eIx,2)+Math.pow(sIy+eIy,2));
  },
  updateGameArea: function(){
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.save();
    if(this.can.x > this.canvas.width/2){
      this.areaX = -this.can.x+this.canvas.width/2;
      this.ctx.translate(this.areaX, 0);
      this.ground.x = this.can.x - this.ground.width/2;
    }
    if(this.can.y < this.canvas.height/2){
      this.areaY = -this.can.y+this.canvas.height/2;
      this.ctx.translate(0, this.areaY);
    }
  },
  init: function(){

    this.events();
    this.shoulderAcc = 0;
    this.elbowAcc = 0;
    this.canvas = document.getElementById('gameArea');

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true;
      document.getElementById('mobileCommands').style.display = 'block';
      document.getElementById('mobileCommands').style.width = '100%';
      this.canvas.height = 400;
      this.canvas.style.height = "400px";
    } else{
      this.canvas.width = (window.innerWidth < 900)?window.innerWidth-16:900;
      this.canvas.height = (window.innerHeight < 600)?window.innerHeight-86:600;
      this.canvas.style.width = (window.innerWidth < 900)?window.innerWidth-16 + "px":900 + "px";
      this.canvas.style.height = (window.innerHeight < 600)?window.innerHeight-86 + "px":600 + "px";
    }

    this.ctx = this.canvas.getContext('2d');
    this.then = performance.now();

    this.ground = new StaticGO(1400, 40, 0, this.canvas.height - 40);
    this.can = new ImageGO(20, 40, 0, 600, 0, "images/can.png");
    this.releaseCan = false;
    this.arm = new ArmGO();
    this.sounds = [new Sound("audio/metallic_hit_2.flac"),new Sound("audio/metallic_hit_6.flac"),new Sound("audio/metallic_hit_7.flac")];
    main();
  },
  events: function(){
    document.addEventListener('keydown', function(e) {

      switch(e.key){
        case 'q':
          Game.shoulderAcc=0.002;
          break;
        case 'w':
          Game.shoulderAcc=-0.002;
          break;
        case 'o':
          Game.elbowAcc=-0.002;
          break;
        case 'p':
          Game.elbowAcc=+0.002;
          break;
        case ' ':
          if(!Game.releaseCan){
           Game.calculateCanSpeed();
           Game.releaseCan = true;
          }
          break;
        case 'e':
          Game.pause = !Game.pause;
          break;
      }
    });
    document.addEventListener('keyup', function(e){

      switch(e.key){
        case 'q':
          Game.shoulderAcc -= Game.shoulderAcc;
          break;
        case 'w':
          Game.shoulderAcc -= Game.shoulderAcc;
          break;
        case 'o':
          Game.elbowAcc -= Game.elbowAcc;
          break;
        case 'p':
          Game.elbowAcc -= Game.elbowAcc;
          break;
      }
    });
    window.onblur = function(){ Game.pause = true; }
    window.onfocus = function(){ Game.pause = false; }
  }
}
function main(){
  window.requestAnimationFrame(main);
  //time at loop start
  Game.now = performance.now();
  Game.tSLF = (Game.now - Game.then)/1000;

  if(Game.tSLF > 16/1000){ //Aprox 60FPS
    //console.log(1/Game.tSLF);
    if (!Game.pause) {
      Game.update();
      Game.render();
    }

    Game.then = Game.now;
  }
}
