import {
  Options,
  AuctionType,
  Player,
  Game,
  State,
  OptionInputs
} from '../store/state';

export function generatePoints(
  max: number,
  sum: number,
  rounds: number
): number[] {
  const result = Array.from({ length: rounds }, () => 0);
  for (let i = 0; i < Math.min(sum, max * rounds); i++) {
    const ind = Math.floor(Math.random() * rounds);
    if (result[ind] < max && result[ind] + 1 <= max) {
      result[ind] += 1;
    }
  }
  return result;
}

export function generatePlayer(options: Options): Player {
  return {
    balance: options.startingBalance,
    currentPoints: 0,
    bidInput: '',
    allPoints: generatePoints(
      options.maxPointsPerRound,
      options.sumPoints,
      options.numRounds
    ),
    hiddenPoints: ''
  };
}

export function generatePlayers(options: Options): Player[] {
  return Array.from({ length: options.numPlayers }, () =>
    generatePlayer(options)
  );
}

export function generateGame(options: Options): Game {
  return {
    round: 0,
    maxRounds: options.numRounds,
    bids: Array.from({ length: options.numPlayers }, () => 0),
    auctionType: options.auctionType,
    finishedRound: false
  };
}

export function stateNewRound(game: Game): Game {
  return {
    ...game,
    round: game.round + 1,
    bids: Array.from({ length: game.bids.length }, () => 0),
    finishedRound: false
  };
}

export function findTwoBest(
  bids: number[]
): {
  first: { playerId: number; bid: number };
  second: { playerId: number; bid: number };
} {
  const result = {
    first: { playerId: -1, bid: -1 },
    second: { playerId: -1, bid: -1 }
  };
  for (let i = 0; i < bids.length; i++) {
    const bid = bids[i];
    if (bid > result.first.bid) {
      result.second = result.first;
      result.first = { playerId: i, bid };
    } else if (bid > result.second.bid) {
      result.second = { bid, playerId: i };
    }
  }
  return result;
}

export function stateFinishRound(state: State): State {
  let toBeDeducted: Array<{ playerId: number; bid: number }>;
  switch (state.game.auctionType) {
    case AuctionType.Senior:
      if (state.players.length <= 2) {
        toBeDeducted = state.game.bids.map((bid, i) => ({ playerId: i, bid }));
        break;
      }
      const twoBest = findTwoBest(state.game.bids);
      toBeDeducted = [twoBest.first, twoBest.second];
      break;
    case AuctionType.Vickrey:
      if (state.players.length === 1) {
        toBeDeducted = [{ playerId: 0, bid: state.game.bids[0] }];
      }
      const bestTwo = findTwoBest(state.game.bids);
      toBeDeducted = [
        { playerId: bestTwo.first.playerId, bid: bestTwo.second.bid }
      ];
      break;
    case AuctionType.AllPay:
      toBeDeducted = state.game.bids.map((bid, i) => ({ playerId: i, bid }));
      break;
    default:
      const maxValue = Math.max(...state.game.bids);
      toBeDeducted = [
        { playerId: state.game.bids.indexOf(maxValue), bid: maxValue }
      ];
      break;
  }
  const deductionIds = toBeDeducted.map(t => t.playerId);
  const newPlayers = state.players.map((player, i) => {
    if (deductionIds.includes(i)) {
      return {
        ...player,
        balance:
          player.balance - toBeDeducted.filter(t => i === t.playerId)[0].bid
      };
    } else {
      return player;
    }
  });
  const winner = argMax(state.game.bids);
  return {
    ...state,
    players: newPlayers.map((p, i) =>
      i === winner
        ? {
            ...p,
            currentPoints:
              p.currentPoints +
              (state.options.showPoints
                ? p.allPoints[state.game.round]
                : parseInt(p.hiddenPoints))
          }
        : p
    ),
    game: { ...state.game, finishedRound: true }
  };
}

export function isInt(s: string): boolean {
  return parseInt(s) === parseFloat(s) || isNaN(parseInt(s));
}

export function validPositiveInt(s: string): boolean {
  const i = parseInt(s);
  return !isNaN(i) && i === parseFloat(s) && i > 0;
}

export function validNonNegativeInt(s: string): boolean {
  const i = parseInt(s);
  return !isNaN(i) && i === parseFloat(s) && i >= 0;
}

export function invalidBid(
  input: string,
  balance: number,
  fee: number,
  bestBid: number
) {
  const newBid = parseInt(input);
  if (isNaN(newBid)) {
    return true; // empty input string
  } else if (newBid !== parseFloat(input)) {
    return true; // non-integer input
  } else if (newBid <= bestBid) {
    return true; // new bid has to be higher than the best so far
  } else {
    return balance - newBid - fee < 0;
  }
}

export function getFee(auctionType: AuctionType) {
  return auctionType === AuctionType.BiddingFee ? 1 : 0;
}

function argMax(array: number[]) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

export function isDone(game: Game) {
  return game.round + 1 === game.maxRounds;
}

export function optionInputsToOptions(optionInputs: OptionInputs): Options {
  return {
    maxPointsPerRound: parseInt(optionInputs.maxPointsPerRound),
    numRounds: parseInt(optionInputs.numRounds),
    numPlayers: parseInt(optionInputs.numPlayers),
    sumPoints: parseInt(optionInputs.sumPoints),
    startingBalance: parseInt(optionInputs.startingBalance),
    auctionType: optionInputs.auctionType,
    showPoints: optionInputs.showPoints
  };
}

export function validateOptionInputs(optionInputs: OptionInputs): boolean {
  return (
    validPositiveInt(optionInputs.maxPointsPerRound) &&
    validPositiveInt(optionInputs.numPlayers) &&
    validPositiveInt(optionInputs.numRounds) &&
    validPositiveInt(optionInputs.startingBalance) &&
    validPositiveInt(optionInputs.sumPoints)
  );
}

export function winnerHasPoints(state: State): boolean {
  const winner = argMax(state.game.bids);
  return validNonNegativeInt(state.players[winner].hiddenPoints);
}

export function canBeFinished(state: State): boolean {
  return (
    (state.options.showPoints && Math.max(...state.game.bids) > 0) ||
    (!state.options.showPoints && winnerHasPoints(state))
  );
}

export const auctionInfo = [
  'The most standard auction, where every bigger has to bid higher than the previous one. The highest bidder wins the item.',
  'The announcer starts at a high number and decreases the bid over time. First one to raise his/her hand gets the item.',
  'Like English auction, but every bid costs 1 additional coin to make.',
  'A sealed bid, where each participant chooses a bid secretly. After the bids are revealed, the highest bidder wins the item and pays the 2nd highest bid price.',
  'Like English auction, but the first two highest bids pay their bids. Still, only the highest bid gets the item.',
  'Like English auction, but all bidders pay their highest bid. Still, only the highest bid gets the item.'
];
