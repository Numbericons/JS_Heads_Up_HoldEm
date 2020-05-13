import "babel-polyfill";
import Board from "./board.js";
import HumanPlayer from "../playerLogic/humanplayer";
import ComputerPlayer from "../playerLogic/computerplayer";

class Table {
  constructor($el, initialChipstack = 50000, sb = 500, bb = 1000, cardDims = ["72px", "68px"]){
    this.players = [new HumanPlayer("sb", initialChipstack, cardDims, true), new ComputerPlayer("bb", initialChipstack, cardDims, false)];
    this.board = new Board($el, this.players, sb, bb, this)
    this.handNum = 1;
    this.initialChipstack = initialChipstack;

    this.sound = true;
    this.delay = true;
    this.win1 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/win1.wav');
    this.win2 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/win2.wav');
    this.win3 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/win3.mp3');
    this.loss1 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/loss1.wav');
    this.loss2 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/loss2.wav');
    this.loss3 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/loss3.wav');
    this.bindMuteBtn();
    this.bindDelayBtn();
  }

  resetPlayerVars() {
    this.players[0].resetVars();
    this.players[1].resetVars();
  }

  togglePlayers() {
    this.board.players.push(this.board.players.shift());
    this.board.players[0].position = 'sb';
    this.board.players[1].position = 'bb';
  }

  winSound(rng){
    if (!this.sound) return;
    if (rng < .333) {
      this.win1.play();
    } else if (rng < .666) {
      this.win2.play();
    } else {
      this.win3.play();
    }
  }
  
  lossSound(rng){
    if (!this.sound) return;
    if (rng < .333) {
      this.loss1.play();
    } else if (rng < .666) {
      this.loss2.play();
    } else {
      this.loss3.play();
    }
  }
  
  sampleWinLoss(){
    if (!this.sound) return;
    let rng = Math.random();
    if (this.board.currentPlayer().chipstack === 0) {
      if (this.board.currentPlayer().comp){
        this.winSound(rng);
      } else {
        this.lossSound(rng);
      }
    } else {
      if (this.board.currentPlayer().comp) {
        this.lossSound(rng);
      } else {
        this.winSound(rng);
      }
    }
  }

  async resultSound(){
    if (!this.sound) return;
    if (this.delay) await this.sleep(3000);
    this.sampleWinLoss();
  }

  setup(){
    this.modal();
    this.board.renderDealerPlayers();
    this.board.button.bindPlayGame(this);
  }

  newGame(){
    location.reload();
  }

  result(){
    this.removeButtons();
    this.resultSound();
    this.board.button.bindNewGame(this);
  }

  handOver(){
    if (this.board.currentPlayer().chipstack === 0) {
      this.board.otherPlayer().promptText(`${this.board.otherPlayer().name} has won the match!`);
      this.result();
    } else if (this.board.otherPlayer().chipstack === 0) {
      this.board.currentPlayer().promptText(`${this.board.currentPlayer().name} has won the match!`);
      this.result();
    } else {
      this.nextHand();
    }
  }

  removeButtons(){
    this.board.button.$el.empty();
  }

  playHand(){
    this.board.playHand();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async nextHand(){
    if (this.delay && this.handNum > 0) await this.sleep(3000);
    this.togglePlayers();
    this.resetPlayerVars();
    this.board.clearBoard();
    this.board.resetVars();
    this.handNum += 1;
    this.playHand();
  }

  modal(){
    const modalTriggers = document.querySelectorAll('.popup-trigger')
    const modalCloseTrigger = document.querySelector('.popup-modal__close')
    const bodyBlackout = document.querySelector('.body-blackout')

    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const { popupTrigger } = trigger.dataset
        const popupModal = document.querySelector(`[data-popup-modal="${popupTrigger}"]`)

        popupModal.classList.add('is--visible')
        bodyBlackout.classList.add('is-blacked-out')

        popupModal.querySelector('.popup-modal__close').addEventListener('click', () => {
          popupModal.classList.remove('is--visible')
          bodyBlackout.classList.remove('is-blacked-out')
        })

        bodyBlackout.addEventListener('click', () => {
          // TODO: Turn into a function to close modal
          popupModal.classList.remove('is--visible')
          bodyBlackout.classList.remove('is-blacked-out')
        })
      })
    })
  }

  toggleSound() {
    let volume = $("#volume-btn").removeClass()
    this.board.sound = this.board.sound ? false : true;
    this.sound = this.sound ? false : true;
    this.sound ? volume.addClass("fas fa-volume-up") : volume.addClass("fas fa-volume-mute");
    this.players[0].sound = this.players[0].sound ? false : true;
    this.players[1].sound = this.players[1].sound ? false : true;
  }

  toggleDelay() {
    let delay = $("#delay-btn").removeClass();
    this.board.delay = this.board.delay ? false : true;
    this.delay = this.delay ? false : true;
    this.delay ? delay.addClass("fas fa-fast-forward") : delay.addClass("fas fa-play");
  }

  bindMuteBtn() {
    $("#volume-btn").click(this.toggleSound.bind(this));
  }

  bindDelayBtn() {
    $("#delay-btn").click(this.toggleDelay.bind(this));
  }
}
export default Table;