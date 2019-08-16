export default class Card {
  constructor(rank, suit, img_pos_x, img_pos_y, revealed) {
    this.suit = suit;
    this.rank = rank;
    this.img_pos_x = img_pos_x;
    this.img_pos_y = img_pos_y;
    this.revealed = revealed;
  }

  render(ele_name){
    let element = $(ele_name);
    // element.style.background-position-x = `${this.img_pos_x}`;
    // element.style.background-position-y = `${this.img_pos_y}`;
    // element.style.color = 'blue';
  }

  show() {
    return `${this.rank}${this.suit}`
  }
}