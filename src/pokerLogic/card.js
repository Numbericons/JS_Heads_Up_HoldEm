// DISP_SUITS = ["\u2660", "\u2661", "\u2662", "\u2663"]
export default class Card {
  constructor(rank, suit, img_pos_x, img_pos_y, revealed) {
    this.suit = suit;
    this.rank = rank;
    this.img_pos_x = img_pos_x;
    this.img_pos_y = img_pos_y;
    this.revealed = revealed;
  }

  render(element, width, height){
    element.style.backgroundPositionX = `${this.img_pos_x}px`;
    element.style.backgroundPositionY = `${this.img_pos_y}px`;
    element.style.width = width; //40%    .1143  .57 * 140 px   80%
    element.style.height = height; //80%  .16
    element.style.backgroundImage = 'url("./image/deck400.png")';
    element.style.borderRadius = "7px";
  }

  show() {
    return `${this.rank}${this.suit}`
  }
}