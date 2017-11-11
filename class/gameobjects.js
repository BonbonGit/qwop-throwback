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
}
class GO{
  constructor(width=10, height=10, x=0, y=0, angle=0){
    this.type = GO;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.angle = angle;
    //The object max width/height (due to angle) define both hitBox limits. We keep (max width/height)² because we compare it to another "²" value during collisions checks
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
    this.y += this.ySpeed * Game.tSLF;
    this.angle += this.rotSpeed * Game.tSLF;
  }

}
class ColorGO extends GO{
  constructor(width=10, height=10, x=0, y=0, angle=0, color='red'){
    super(width, height, x, y, angle)
    this.color = color;
  }
  render(){
    if(!(this.x > Game.canvas.width+this.hitBox || this.x < -this.hitBox || this.y > Game.canvas.height+this.hitBox || this.y < -this.hitBox)){

      Game.ctx.fillStyle = this.color;

      Game.ctx.save();
        Game.ctx.translate(this.x, this.y);
        Game.ctx.rotate(this.angle);
        Game.ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
      Game.ctx.restore();
    }
  }
}
export {staticGO, GO, ColorGO}
