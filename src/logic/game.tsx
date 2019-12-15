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
    )
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

export function stateFinishRound(state: State): State {
  let toBeDeducted: number[];
  switch (state.game.auctionType) {
    case AuctionType.Senior:
      if (state.players.length <= 2) {
        toBeDeducted = state.game.bids.map((_, i) => i);
        break;
      }
      let best = [-1, -1];
      let best2 = [-1, -1];
      for (let i = 0; i < state.players.length; i++) {
        const bid = state.game.bids[i];
        if (bid > best[0]) {
          best2 = best;
          best = [bid, i];
        } else if (bid > best2[0]) {
          best2 = [bid, i];
        }
      }
      toBeDeducted = [best[1], best2[1]];
      break;
    case AuctionType.AllPay:
      toBeDeducted = state.game.bids.map((_, i) => i);
      break;
    default:
      toBeDeducted = [state.game.bids.indexOf(Math.max(...state.game.bids))];
      break;
  }
  const newPlayers = state.players.map((player, i) => {
    if (toBeDeducted.includes(i)) {
      return {
        ...player,
        balance: player.balance - state.game.bids[i]
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
            currentPoints: p.currentPoints + p.allPoints[state.game.round]
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
    auctionType: optionInputs.auctionType
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
