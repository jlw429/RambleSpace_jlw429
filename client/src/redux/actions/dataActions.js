import {
  SET_RAMBLES,
  LOADING_DATA,
  LIKE_RAMBLE,
  UNLIKE_RAMBLE,
  DELETE_RAMBLE,
  LOADING_UI,
  SET_ERRORS,
  CLEAR_ERRORS,
  POST_RAMBLE,
  SET_RAMBLE,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
} from '../types';
import axios from 'axios';

//Get all rambles
export const getRambles = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get('/rambles')
    .then((res) => {
      dispatch({
        type: SET_RAMBLES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_RAMBLES,
        payload: [],
      });
    });
};
//Get a ramble
export const getRamble = (rambleId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/rambles/${rambleId}`)
    .then((res) => {
      dispatch({
        type: SET_RAMBLE,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};

//Post Ramble
export const postRamble = (newRamble) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/ramble', newRamble)
    .then((res) => {
      dispatch({
        type: POST_RAMBLE,
        payload: res.data.ramble,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Like a Scream

export const likeRamble = (rambleId) => (dispatch) => {
  if (!rambleId) {
    return;
  }
  axios
    .get(`/rambles/${rambleId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_RAMBLE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

//Unlike

export const unlikeRamble = (rambleId) => (dispatch) => {
  axios
    .get(`/rambles/${rambleId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_RAMBLE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

//Submit a comment
export const submitComment = (rambleId, commentData) => (dispatch) => {
  axios
    .post(`/rambles/${rambleId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const deleteRamble = (rambleId) => (dispatch) => {
  axios
    .delete(`/ramble/${rambleId}`)
    .then(() => {
      dispatch({ type: DELETE_RAMBLE, payload: rambleId });
    })
    .catch((err) => console.log(err));
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

export const getUserData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      dispatch({
        type: SET_RAMBLES,
        payload: res.data.rambles,
      });
    })
    .catch(() => {
      dispatch({
        type: SET_RAMBLES,
        payload: null,
      });
    });
};
