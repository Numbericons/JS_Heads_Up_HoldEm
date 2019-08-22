// DISP_SUITS = ["\u2660", "\u2661", "\u2662", "\u2663"]
export default class Card {
  constructor(rank, suit, img_pos_x, img_pos_y, revealed) {
    this.suit = suit;
    this.rank = rank;
    this.img_pos_x = img_pos_x;
    this.img_pos_y = img_pos_y;
  }

  display(element, width, height){
    // element.empty();
    element.style.backgroundImage = 'url("./image/deck400.png")';
    element.style.backgroundPosition = `${this.img_pos_x}px ${this.img_pos_y}px`;
    element.style.width = width; //40%    .1143  .57 * 140 px   80%
    element.style.height = height; //80%  .16
    element.style.borderRadius = "7px";
    element.style.marginLeft = "10px";
    element.style.backgroundSize = "";
  }

  hide(element, width, height){
    element.style.backgroundImage = 'url("./image/cardback_red_acorn2.jpg")';
    element.style.backgroundPosition = ' -2px -4px';
    element.style.width = width; 
    element.style.height = height;
    element.style.borderRadius = "7px";
    element.style.marginLeft = "10px";
    element.style.backgroundSize = "75px 112px";
  }

  render(element, width, height, revealed){
    (revealed) ? this.display(element, width, height) : this.hide(element, width, height)
  }

  unrender(element){
    element.style.backgroundPositionX = "0px";
    element.style.backgroundPositionY = "0px";
    element.style.width = "0%";
    element.style.height = "0%";
    element.style.borderRadius = "7px";
    element.style.marginLeft = "10px";
  }

  show() {
    return `${this.rank}${this.suit}`
  }
}