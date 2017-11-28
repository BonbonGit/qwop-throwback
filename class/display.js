import {Game} from '../main.js';

class Score {
  constructor(x = 0, y = 0, text = 'Score : ', color, font = '30px Arial' ) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.score = 0;
    this.color = color;
    this.font = font;
    this.fontHeight = parseInt(font.substr(0, font.indexOf('p')));
  }
  updateScore(newScore){
    this.score = newScore;
  }
  render(){
    Game.ctx.fillStyle = this.color;
    Game.ctx.font = this.font;
    Game.ctx.fillText(this.text + this.score, this.x,  this.y + this.fontHeight);

  }
}
class Menu {
  constructor(x=20, y=20, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
  render(){
    Game.ctx.globalAlpha = 0.6;
    Game.ctx.fillStyle = 'black';
    Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.ctx.save();
      Game.ctx.lineWidth = "8";
      Game.ctx.strokeStyle = this.color;
      Game.ctx.fillStyle = this.color;
      Game.ctx.strokeRect(this.x, this.y, Game.canvas.width - this.x*2 , Game.canvas.height - this.y*2);
      Game.ctx.globalAlpha = 1;
      Game.ctx.fillStyle = 'white';
      Game.ctx.fillRect(this.x, this.y, Game.canvas.width - this.x*2 , Game.canvas.height - this.y*2);

      Game.ctx.translate(this.x, this.y);
      Game.menuScore.render();
    Game.ctx.restore();


  }
}
export {Score, Menu}
