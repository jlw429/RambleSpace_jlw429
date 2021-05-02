/* eslint-disable import/no-anonymous-default-export */
import {
  SET_RAMBLES,
  LIKE_RAMBLE,
  UNLIKE_RAMBLE,
  LOADING_DATA,
  DELETE_RAMBLE,
  POST_RAMBLE,
  SET_RAMBLE,
  SUBMIT_COMMENT,
} from '../types';

const initialState = {
  rambles: [],
  ramble: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_RAMBLES:
      return {
        ...state,
        rambles: action.payload,
        loading: false,
      };
    case SET_RAMBLE:
      return {
        ...state,
        ramble: action.payload,
      };
    case LIKE_RAMBLE:
    case UNLIKE_RAMBLE:
      let index = state.rambles.findIndex(
        (ramble) => ramble.rambleId === action.payload.rambleId
      );
      let updatedRambles = state.rambles;
      updatedRambles[index] = action.payload;
      if (state.ramble.rambleId === action.payload.rambleId) {
        state.ramble = action.payload;
      }
      return { ...state, rambles: updatedRambles };

    case DELETE_RAMBLE:
      let newRambles = state.rambles.filter(
        (ramble) => ramble.rambleId !== action.payload
      );
      return { ...state, rambles: newRambles };
    case POST_RAMBLE:
      return {
        ...state,
        rambles: [action.payload, ...state.rambles],
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        ramble: {
          ...state.ramble,
          comments: [action.payload, ...state.ramble.comments],
        },
      };
    default:
      return state;
  }
}
