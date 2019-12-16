import { generatePlayers, generateGame } from '../logic/game';
import {
  faSleigh,
  faGift,
  faCandyCane,
  faTree,
  faHollyBerry,
  faFish,
  faBell,
  faStar,
  faMitten,
  faSnowman,
  faSnowflake,
  faCookieBite
} from '@fortawesome/free-solid-svg-icons';

export type Player = {
  balance: number;
  currentPoints: number;
  bidInput: string;
  allPoints: number[];
  hiddenPoints: string;
};

export enum View {
  AuctionView,
  SetupView
}

export enum AuctionType {
  English = 'English',
  Dutch = 'Dutch',
  BiddingFee = 'BiddingFee',
  Vickrey = 'Vickrey',
  Senior = 'Senior',
  AllPay = 'AllPay'
}

export const auctionTypes = Object.keys(AuctionType);

export type Options = {
  numPlayers: number;
  maxPointsPerRound: number;
  numRounds: number;
  sumPoints: number;
  startingBalance: number;
  auctionType: AuctionType;
  showPoints: boolean;
};

export type OptionInputs = {
  numPlayers: string;
  maxPointsPerRound: string;
  numRounds: string;
  sumPoints: string;
  startingBalance: string;
  auctionType: AuctionType;
  showPoints: boolean;
};

export type Game = {
  round: number;
  maxRounds: number;
  bids: number[];
  auctionType: AuctionType;
  finishedRound: boolean;
};

export type State = {
  view: View;
  game: Game;
  options: Options;
  optionInputs: OptionInputs;
  players: Player[];
};

export const initialOptions: Options = {
  numPlayers: 10,
  maxPointsPerRound: 10,
  numRounds: 15,
  sumPoints: 75,
  startingBalance: 50,
  auctionType: AuctionType.English,
  showPoints: true
};

export const initialOptionInputs: OptionInputs = {
  numPlayers: initialOptions.numPlayers.toString(),
  maxPointsPerRound: initialOptions.maxPointsPerRound.toString(),
  numRounds: initialOptions.numRounds.toString(),
  sumPoints: initialOptions.sumPoints.toString(),
  startingBalance: initialOptions.startingBalance.toString(),
  auctionType: initialOptions.auctionType,
  showPoints: initialOptions.showPoints
};

export const playerIcons = [
  faSleigh,
  faGift,
  faCandyCane,
  faSnowflake,
  faBell,
  faSnowman,
  faMitten,
  faTree,
  faStar,
  faHollyBerry,
  faFish,
  faCookieBite
];

export const initialState: State = {
  options: initialOptions,
  optionInputs: initialOptionInputs,
  players: generatePlayers(initialOptions),
  game: generateGame(initialOptions),
  view: View.SetupView
};
