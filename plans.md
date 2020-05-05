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
Straight possible / 3+ to a flush
PromptResonse
  Adjust to .5 (not fold) and .8 (bet/raise)

Pair
  if board makes a pair and we dont beat board...

General Danger factors to board to know how strong hands need to be
  Thought: Dry: No pairs, 3 straights, 3 flushes, trips, 2 pairs
    Can use rank of the board cards help classify
  If have pair, fear all of the factors
  if have 2 pair, fear less but similar to pair but pair on board obv. treated differently
  if have trips, dont fear a pair on the board
  If have straight, pair on board diminishes value but less so, fear 3+ flush cards
  Flush - dont fear flush cards
  Full House, don't fear flush cards, pair, trips the same way
  Quads, straight flushes don't have fears (simpler implementation)

  


Flop
  Check If board is a pair or trips
  Check If board is 3 to flush
  If hand val is pair or trips, check if 1st, 2nd or 3rd
  

Kicker function
  calc nut kicker
  doesnt bluff if it's kicker is the board and it doesnt have a quad card in hand 
  if card in hand better than best card not included in pair/trips

Full house, doesnt bluff is full house on board, if board is a house and hand beats board, return infinity


Weaknesses:
Always call on fullhouse if not beating board
Computerplayer promptresponse static values
if auto is call and its put all in it folds