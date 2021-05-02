/* eslint-disable no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_RAMBLE,
  UNLIKE_RAMBLE,
  MARK_NOTIFICATIONS_READ,
} from '../types';

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        ...state,
        authenticated: true,
        loading: false,
        ...action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case LIKE_RAMBLE:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            rambleId: action.payload.rambleId,
          },
        ],
      };
    case UNLIKE_RAMBLE:
      return {
        ...state,
        likes: state.likes.filter(
          (like) => like.rambleId !== action.payload.rambleId
        ),
      };
    case MARK_NOTIFICATIONS_READ:
      let newState = state;
      newState.notifications.forEach((not) => (not.read = true));
      return {
        ...newState,
        // loading: true,
      };
    default:
      return state;
  }
}
