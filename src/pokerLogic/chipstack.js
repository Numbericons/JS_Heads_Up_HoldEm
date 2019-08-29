export default class Chipstack {
  constructor(amount, $tableEl){
    this.amount = amount;
    this.$tableEl = $tableEl;
    this.$stackDiv = $('<div>');
    this.$stackDiv.addClass("chips");
  }

  getChips(amount) {
    let denominations = [1, 10, 25, 100, 1000];
    let result = [];
    while (amount > 0) {
      let coin = denominations.pop();
      let count = Math.floor(amount / coin);
      amount -= count * coin;
      if (count) result.push([coin, count]);
    }
    return result;
  }

  colorConverter(chipType){
    switch (chipType) {
      case 1000:
        return 'green';
      case 100:
        return 'black';
      case 25:
        return 'blue';
      case 10:
        return 'red'
      case 1:
        return 'white';
    }
  }

  stackEmUp(stack,count, color){
    for(let i = 1;i < count;i++) {
      this.addChipImg(stack, color, "middle");
    }
  }
  
  addChipImg(stack, color, imgType){
    let $chipImg = $("<img>");
    $chipImg.addClass("chips-stack-image")
    $chipImg.attr("src", `./image/chips/${color}/${imgType}.png`)
    stack.append($chipImg);
  }
  
  renderChipStack(chipArr){
    let $stack = $("<div>");
    $stack.addClass("chips-stack")
    let color = this.colorConverter(chipArr[0]);
    if (chipArr[1] === 1) {
      this.addChipImg($stack, color, "single");
    } else {
      this.addChipImg($stack, color, "top");
      this.stackEmUp($stack ,chipArr[1] - 1, color);
      this.addChipImg($stack, color, "bottom");
    }
    this.appendTableEl($stack);
  }

  appendTableEl(stack){
    this.$stackDiv.append(stack);
    this.$tableEl.append(this.$stackDiv);
  }

  renderText(){
    let $h5 = $("<h5>");
    $h5.addClass("chips-text");
    $h5.text(`$${this.amount}`)
    this.$tableEl.append($h5);
  }

  render(){
    this.$tableEl.empty();
    let chips = this.getChips(this.amount);
    chips.forEach(chip => {
      this.renderChipStack(chip);
    })
    this.renderText()
  }
}