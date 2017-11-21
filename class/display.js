import {Game} from '../main.js';

class Score {
  constructor(x = 0, y = 0, text = 'Score : ', color, font = '30px Arial' ) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.score = 0;
    this.color = color;
    this.font = font;
    this.fontHeight = font.substr(0, font.indexOf('p'));
  }
  updateScore(newScore){
    this.score = newScore;
  }
  render(){
    Game.ctx.fillStyle = this.color;
    Game.ctx.font = this.font;
    Game.ctx.save();
      Game.ctx.translate(this.x - Game.areaX, this.y - Game.areaY);
      Game.ctx.fillText(this.text + this.score, 0, this.fontHeight);
    Game.ctx.restore();

  }
}
class Menu {
  constructor() {

  }
  render(){

  }
}
export {Score, Menu}
