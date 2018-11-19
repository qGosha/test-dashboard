import { INITIATE_PLAYER } from './types';

// export const isSignedIn = (user) => async dispatch => {
//   if(user) {
//     dispatch({
//       payload: user,
//       type: UPLOAD_VIDEO
//     });
//   }
//     };

    export const initiatePlayer = (videoId) => dispatch => {
      if(videoId) {
        dispatch({
          payload: videoId,
          type: INITIATE_PLAYER
        });
      }
        };
