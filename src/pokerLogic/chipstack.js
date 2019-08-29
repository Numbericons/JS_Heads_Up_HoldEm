export default class Chipstack {
  constructor(amount, $el){
    this.amount = amount;
    this.$el = $el;
    this.$div = $('<div>');
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

  colorConverter(chipType){
    switch (chipType) {
      case 1:
        return 'white';
      case 100:
        return 'black';
      default:
        return 'blue';
    }
  }

  stackEmUp($div, count, color){
    for(let i = 1;i < count;i++) {
      let $midChip = $("<img>");
      $midChip.attr("src", `./image/chips/${color}/middle.png`);
      $midChip.addClass("chips-image")
      $div.append($midChip);
    }
  }

  singleChip(color){
    let $chipImg = $("<img>");
    $chipImg.addClass("chips-image")
    $chipImg.attr("src", `./image/chips/${color}/single.png`)
    this.$el.append($chipImg);
  }
  
  renderChipStack(chipArr){
    let $div = $("<div>");
    $div.addClass("chips")
    let color = this.colorConverter(chipArr[0]);
    let $topImg = $("<img>");
    $topImg.attr("src", `./image/chips/${color}/top.png`)
    $topImg.addClass("chips-image")
    $div.append($topImg);
    this.stackEmUp($div, chipArr[1] - 1, color);
    let $bottomImg = $("<img>");
    $bottomImg.addClass("chips-image")
    $bottomImg.attr("src", `./image/chips/${color}/bottom.png`)
    $div.append($bottomImg);
    this.$el.append($div);
  }

  render(){
    this.$el.empty();
    // $el.addClass("chips")
    let chips = this.getChips(this.amount);
    chips.forEach(chip => {
      this.renderChipStack(chip);
    })
  }
}