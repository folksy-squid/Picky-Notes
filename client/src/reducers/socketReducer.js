export const createSocket = () => {
  return {
    type: 'SOCKET_CREATE'
  }
}

export const deleteSocket = () => {
  return {
    type: 'SOCKET_DELETE'
  }
}

export default function(state = {}, action) {
  switch (action.type) {

    case 'SOCKET_CREATE':
      {
        return {
          ...state,
          socket: io()
        }
      }
    case: 'SOCKET_DELETE':
      {
        return {
          ...state,
          socket: null
        }
      }

    default:
      return state;
  }
}
