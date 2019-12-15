import { createReducer, ActionType } from 'typesafe-actions';
import { initialState, State, View, auctionTypes, AuctionType } from './state';
import * as actions from './actions';
import {
  generatePlayers,
  generateGame,
  stateNewRound,
  stateFinishRound,
  getFee,
  isInt,
  optionInputsToOptions
} from '../logic/game';

export type RootAction = ActionType<typeof actions>;

export const appReducer = createReducer<State, RootAction>(initialState, {
  [actions.START_NEW_AUCTION]: state => {
    const options = optionInputsToOptions(state.optionInputs);
    return {
      options,
      players: generatePlayers(options),
      game: generateGame(options),
      optionInputs: state.optionInputs,
      view: View.AuctionView
    };
  },
  [actions.START_NEW_ROUND]: state => ({
    ...state,
    game: stateNewRound(state.game),
    players: state.players.map(p => ({ ...p, hiddenPoints: '' }))
  }),
  [actions.FINISH_ROUND]: state => stateFinishRound(state),
  [actions.PLACE_BID]: (state, action) => {
    return {
      ...state,
      game: {
        ...state.game,
        bids: state.game.bids.map((bid, i) =>
          i === action.payload.playerId ? action.payload.bid : bid
        )
      },
      players: state.players.map((p, i) =>
        i !== action.payload.playerId
          ? p
          : {
              ...p,
              bidInput: '',
              balance: p.balance - getFee(state.game.auctionType)
            }
      )
    };
  },
  [actions.CHANGE_BID_INPUT]: (state, action) => {
    return {
      ...state,
      players: state.players.map((p, i) =>
        i !== action.payload.playerId
          ? p
          : { ...p, bidInput: action.payload.newInput }
      )
    };
  },
  [actions.SWITCH_VIEW_AUCTION]: state => ({
    ...state,
    view: View.AuctionView
  }),
  [actions.SWITCH_VIEW_SETUP]: state => ({
    ...state,
    view: View.SetupView
  }),
  [actions.CHANGE_SETUP_FIELD]: (state, action) => ({
    ...state,
    optionInputs: {
      ...state.optionInputs,
      [action.payload.field]: isInt(action.payload.value)
        ? action.payload.value
        : state.optionInputs[action.payload.field]
    }
  }),
  [actions.CHANGE_SETUP_AUCTION]: (state, action) => ({
    ...state,
    optionInputs: {
      ...state.optionInputs,
      auctionType: auctionTypes[action.payload] as AuctionType
    }
  }),
  [actions.CHANGE_SETUP_SHOW_POINTS]: (state, action) => ({
    ...state,
    optionInputs: {
      ...state.optionInputs,
      showPoints: action.payload
    }
  }),
  [actions.CHANGE_HIDDEN_POINTS]: (state, action) => ({
    ...state,
    players: state.players.map((p, i) =>
      i !== action.payload.playerId
        ? p
        : {
            ...p,
            hiddenPoints: isInt(action.payload.newPoints)
              ? action.payload.newPoints
              : p.hiddenPoints
          }
    )
  })
});
