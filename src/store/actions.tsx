import { createAction } from 'typesafe-actions';
import { OptionInputs } from './state';

export const START_NEW_AUCTION = 'START_NEW_AUCTION';
export const START_NEW_ROUND = 'START_NEW_ROUND';
export const FINISH_ROUND = 'FINISH_ROUND';
export const PLACE_BID = 'PLACE_BID';
export const CHANGE_BID_INPUT = 'CHANGE_BID_INPUT';
export const SWITCH_VIEW_SETUP = 'SWITCH_VIEW_SETUP';
export const SWITCH_VIEW_AUCTION = 'SWITCH_VIEW_AUCTION';
export const CHANGE_SETUP_FIELD = 'CHANGE_SETUP_FIELD';
export const CHANGE_SETUP_AUCTION = 'CHANGE_SETUP_AUCTION';

export const startNewAuction = createAction(START_NEW_AUCTION)();
export const startNewRound = createAction(START_NEW_ROUND)();
export const finishRound = createAction(FINISH_ROUND)();
export const placeBid = createAction(PLACE_BID)<{
  playerId: number;
  bid: number;
}>();
export const changeBidInput = createAction(CHANGE_BID_INPUT)<{
  newInput: string;
  playerId: number;
}>();
export const switchViewSetup = createAction(SWITCH_VIEW_SETUP)();
export const switchViewAuction = createAction(SWITCH_VIEW_AUCTION)();
export const changeSetupField = createAction(CHANGE_SETUP_FIELD)<{
  field: keyof OptionInputs;
  value: string;
}>();
export const changeSetupAuction = createAction(CHANGE_SETUP_AUCTION)<number>();
