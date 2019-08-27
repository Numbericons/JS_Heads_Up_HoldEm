import Card from './card';
export default class Deck {
  constructor(){
    this.cards_drawn = 0;
    this.cards = this.newDeck();
    this.shuffle = new Audio('./audio/shuffle2.mp3');
  }

  shuffle(array){
    let counter = array.length;

    while (counter > 0) {
      let index = Math.floor(Math.random() * counter);
      counter--;
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // async shuffleSound(){
  //   await this.sleep(2000);
  //   this.shuffle.play();
  // }

  newDeck(){
    let suits = ["s", "h", "d", "c"];
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
    let deck = [];
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < values.length; j++) {
        let pos_x = j * -78 - 6;
        const pos_y = i * -114 - 8;
        deck.push(new Card(values[j], suits[i], pos_x, pos_y, true));
      }
    }
    return this.shuffle(deck);
  }

  draw(){
    if (this.cards_drawn > 0 && this.cards_drawn % 52 == 0) {
      this.cards = this.shuffle(this.cards);
    }
    this.cards_drawn += 1;
    return this.cards.pop();
  }

  returnCard(card){
    this.cards.unshift(card);
  }
}