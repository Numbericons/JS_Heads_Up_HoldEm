export default class MyCard {
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }

  show = () => {
    return `${this.value}${this.suit}`
  }
}