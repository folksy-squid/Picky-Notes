/*jshint esversion: 6 */

export default (state = {}, action) => {

  if (action.type === 'CREATE_ROOM'){
    // ajax call passing in action.data and then setting state in the success

    // $.ajax({
    //   method: 'POST',
    //   url: '/api/rooms',
    //   data: action.data,
    //   success: function(res, status){
    //     console.log('the response: ', res);
    //     // state.roomInfo = res
    //   },
    //   error: function( res, status ){
    //     console.log(res);
    //   }
    // });
    // console.log('data:', action.data);
  }


  return state;
};