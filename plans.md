//Computer Player

//Postflop

first define things like if the board is a certain hand based on the rank of the board cards
  also check if board is 3 to a suit, 3 to a straight etc.

second step is to check for best hands on down for return value
  straight flush plus returns Infinity

Ideas:
slowplay a certain % 
  flop only?
never fold option but no bets/raises
  Get teir function returns an array of 2 elements
    first is the number used for calculations
    second is one of: foldChk, callChk, betRaise
straight draw
  iterate through cards and see if adding one would make the hand into a straight
    if 2 cards would do the trick, then we know we have a double belly buster
      do need to determine if we have the sucker end draw vs. nut etc.
        could we do this by seeing where the cards we are playing fall within the cards?
          playing 1 card at bottom, 2 cards at bottom, vs 1 at top, 2 at top
Pair
  if board makes a pair and we dont beat board...

Kicker function
  calc nut kicker
  doesnt bluff if it's kicker is the board and it doesnt have a quad card in hand 

Full house, doesnt bluff is full house on board, if board is a house and hand beats board, return infinity