export default class Chip {
  constructor(amount, $el){
    this.amount = amount;
    this.$el = $el;
  }

  getChips(amount) {
    let denominations = [1, 10, 25, 50, 100];
    let result = [];
    while (amount > 0) {
      let coin = denominations.pop(); // Get next greatest coin
      let count = Math.floor(amount / coin); // See how many times I need that coin
      amount -= count * coin; // Reduce the amount with that number of coins
      if (count) result.push([coin, count]); // Store count & coin
    }
    return result;
  }

  stackEmUp(chipArr){
    for(let i = 1;i < chipArr[1];i++) {
      // let $midImg = $("<img>");
      //this.$el.append($midImg);
    }
  }

  renderChipStack(chipArr){
    let $chipImg = $("<img>");
    if (chipArr[1] === 1) {
      //append single chip
    } else {
      //render bottom img
      stackEmUp(chipArr);
      //render top img
    }
    // this.$el.append($chipImg);
  }

  render(){
    this.$el.empty();
    let chips = this.getChips(this.amount);
    chips.forEach(chip => {
      this.renderChipStack(chip);
    })
  }
}