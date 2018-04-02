import { URL_ROOT_API, URL_ROOT_BASE } from '../URL'

export function login(u, user_name) {
  return dispatch => {
  dispatch({type: "LOGIN", user:u, user_name: user_name})
  }
}


export function getCurrentUser() {
  return dispatch => {
    fetch(`${URL_ROOT_BASE}current_user`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    }).then(res => res.json())
    .then(res => {
      if (res) {
        dispatch({type: "LOGIN", user: res.user, user_name: res.user_name})
      }
      else {
        dispatch({type:'LOGOUT'})
      }
    })
  }
}

export function loadData(user_id) {
  return dispatch => {
    fetch(`${URL_ROOT_API}users/${user_id}/ideas`)
    .then(res => res.json())
    .then(res =>{
       dispatch({type: 'LOAD_IDEAS', ideas: res})})

    fetch(`${URL_ROOT_API}users/${user_id}/friendships`)
    .then(res=> res.json())
    .then(res => {
      dispatch({type: 'LOAD_FRIENDS', friends: res.friends})
      dispatch({type: 'LOAD_NONFRIENDS', nonFriends: res.nonFriends})
    })

    fetch(`${URL_ROOT_API}invitations/${user_id}`)
    .then(res=> res.json())
    .then(res => {
      dispatch({type: 'LOAD_INVITATIONS', invitations: res})
    })
  }
}
