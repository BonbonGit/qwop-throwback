import {Game} from '../main.js';

class staticGO {
  constructor(width=10, height=10, x=0, y=0) {
    this.type = staticGO;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.xHitBox = this.width/2
    this.yHitBox = this.height/2
  }
  render(){
    Game.ctx.fillStyle = this.color;

    Game.ctx.save();
      Game.ctx.translate(this.x, this.y);
      Game.ctx.fillRect(0, 0, this.width, this.height);
    Game.ctx.restore();

  }
}
class GO{
  constructor(width=10, height=10, x=0, y=0, angle=0){
    this.type = GO;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.angle = angle;
    //The object max width/height (due to angle) define a circular hitBox limit.
    this.hitBox = Math.sqrt(Math.pow(this.width/2,2)+Math.pow(this.height/2,2));
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.rotSpeed = 0;
  }
  accelerate(xAcc, yAcc, rotAcc){
    this.xSpeed += xAcc * Game.tSLF;
    this.ySpeed += (yAcc + Game.gravity) * Game.tSLF;
    this.rotSpeed += rotAcc * Game.tSLF;
  }
  updatePos(){
    this.x += this.xSpeed * Game.tSLF;
    this.y += this.ySpeed * Game.tSLF ;
    this.angle = (this.angle + this.rotSpeed * Game.tSLF)%(Math.PI*2);
  }

}
class ColorGO extends GO{
  constructor(width=10, height=10, x=0, y=0, angle=0, color='red'){
    super(width, height, x, y, angle)
    this.color = color;
  }
  render(){
    //if(!(this.x > Game.canvas.width+this.hitBox || this.x < -this.hitBox || this.y > Game.canvas.height+this.hitBox || this.y < -this.hitBox)){

      Game.ctx.fillStyle = this.color;

      Game.ctx.save();
        Game.ctx.translate(this.x, this.y);
        Game.ctx.rotate(this.angle);
        Game.ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
      Game.ctx.restore();
    //}
  }
}
class ImageGO extends GO{
  constructor(width=10, height=10, x=0, y=0, angle=0, imageSrc){
    super(width, height, x, y, angle)
    this.image = new Image();
    this.image.src = imageSrc;
  }
  render(){
    //if(!(this.x > Game.canvas.width+this.hitBox || this.x < -this.hitBox || this.y > Game.canvas.height+this.hitBox || this.y < -this.hitBox)){

      Game.ctx.fillStyle = this.color;

      Game.ctx.save();
        Game.ctx.translate(this.x, this.y);
        Game.ctx.rotate(this.angle);
        Game.ctx.drawImage(this.image, -this.width/2, -this.height/2);
      Game.ctx.restore();
    //}
  }
}
class armGO{
  constructor(){
    this.x = 200;
    this.y = 450;
    this.width = 15;
    this.height = 60;
    this.shoulderAng = Math.PI/2;
    this.shoulderSpeed = 0;
    this.elbowAng = Math.PI/4;
    this.elbowSpeed = 0;
  }
  accelerate(shoulderAcc, elbowAcc){

    this.shoulderSpeed += shoulderAcc;
    this.elbowSpeed += elbowAcc+shoulderAcc*0.25;

  }
  move(){
    if(this.shoulderAng + this.shoulderSpeed > -Math.PI/2 && this.shoulderAng + this.shoulderSpeed < Math.PI){
      this.shoulderAng += this.shoulderSpeed;
    } else {
      this.shoulderSpeed = 0;
    }
    if(this.elbowAng + this.elbowSpeed > 0 && this.elbowAng + this.elbowSpeed < Math.PI){
      this.elbowAng += this.elbowSpeed;
    } else {
      this.elbowSpeed = 0;
    }
    //console.log(this.shoulderSpeed);
  }
  render(){
    if(!(this.x > Game.canvas.width || this.x < 0 || this.y > Game.canvas.height || this.y < 0)){

      Game.ctx.fillStyle = "black";

      Game.ctx.save();
        Game.ctx.translate(this.x, this.y);
        Game.ctx.rotate(this.shoulderAng);
        Game.ctx.fillRect(-this.width/2, 0, this.width, this.height);
        Game.ctx.translate(0, this.height);
        Game.ctx.rotate(this.elbowAng);
        Game.ctx.fillRect(-this.width/2, 0, this.width, this.height);
        if(!Game.releaseCan){
          Game.ctx.translate(0, this.height);
          Game.ctx.drawImage(Game.can.image, -Game.can.width/2, 0);
        }
      Game.ctx.restore();
    }
  }
}
export {staticGO, GO, ColorGO, armGO, ImageGO}
