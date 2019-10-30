export default class Card {
  constructor(rank, suit, img_pos_x, img_pos_y, revealed) {
    this.suit = suit;
    this.rank = rank;
    this.img_pos_x = img_pos_x;
    this.img_pos_y = img_pos_y;
  }

  radius(element, player){
    if (!player) {
      element.style.borderRadius = "7px";
    } else {
      element.style.borderTopLeftRadius = "7px";
      element.style.borderTopRightRadius = "7px";
    }
  }

  display(element, width, height, player){
    element.style.backgroundImage = 'url("https://js-holdem.s3-us-west-1.amazonaws.com/deck400.png")';
    element.style.backgroundPosition = `${this.img_pos_x}px ${this.img_pos_y}px`;
    element.style.width = width;
    element.style.height = height;
    this.radius(element, player);
    element.style.marginLeft = "5px";
    element.style.backgroundSize = "";
    element.style.display = "";
  }
  
  hide(element, width, height, player){
    element.style.backgroundImage = 'url("https://js-holdem.s3-us-west-1.amazonaws.com/cardback_red_acorn2.jpg")';
    element.style.backgroundPosition = ' -2px -4px';
    element.style.width = width; 
    element.style.height = height;
    this.radius(element, player);
    element.style.marginLeft = "5px";
    element.style.backgroundSize = "75px 112px";
    element.style.display = "";
  }

  foldedCard(element){
    element.style.display = "none";
  }

  render(element, width, height, revealed, folded, player){
    if (folded) return this.foldedCard(element);
    (revealed) ? this.display(element, width, height, player) : this.hide(element, width, height, player)
  }

  unrender(element){
    element.style.backgroundPositionX = "0px";
    element.style.backgroundPositionY = "0px";
    element.style.width = "0%";
    element.style.height = "0%";
    element.style.borderRadius = "7px";
    element.style.marginLeft = "10px";
  }

  showSuit(){
    switch (this.suit) {
      case "s":
        return "\u2660"
      case "h":
        return "\u2661"
      case "d":
        return "\u2662"
      case "c":
        return "\u2663"
    }
  }
  show() {
    return `${this.rank}${this.showSuit()}`
  }
}