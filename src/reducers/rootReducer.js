// import { combineReducers } from 'redux'

// const rootReducer = combineReducers({
//   ideas: ideasReducer,
//   other: anotherideasReducer
// })




const ideasReducer = (state = {ideas: ["start"], events: ['start'], friends: ["start"], user:{id:"start"}, nonFriends: ['start']}, action) => {
  switch (action.type) {
    case "LOAD_NONFRIENDS":
      return {...state, nonFriends: action.nonFriends}
    case "LOAD_FRIENDS":
      return {...state, friends: action.friends}
    case "LOAD_IDEAS":
      return {...state, ideas: action.ideas}
    case "LOAD_INVITATIONS":
      return {...state, invitations: action.invitations}
    case "ADD_FRIEND":
      var updatedNonFriends = state.nonFriends.filter( nF => nF.id !== action.friend.id)
      return {...state, nonFriends: updatedNonFriends, friends: [...state.friends, action.friend]}
    case "REMOVE_FRIEND":
      var updatedFriends = state.friends.filter( f => f.id !== action.friend.id)
      return {...state, friends: updatedFriends, nonFriends: [...state.nonFriends, action.friend]}
    case "ADD_IDEA":
      return {...state, ideas: [...state.ideas, action.idea]}
    case "UPDATE_IDEA":
      var updatedIdeas = state.ideas.map( i => {
        if (i.id == action.idea.id) {
          return action.idea
        }
        else {
          return i
        }
      })
      return {...state, ideas: updatedIdeas}
    case "ADD_VOTE":
      var updatedIdeas = state.ideas.map( i => {
        if (i.id == action.i_id) {
          return {...i, date_suggestions:
            i.date_suggestions.map( ds => {
              if (ds.id == action.ds_id) {
                return {...ds, voters: [...ds.voters, state.user]}
              }
              else {
                return ds
              }
            })
          }
        }
        else {
          return i
        }
      }
      )
      return {...state, ideas: updatedIdeas}
    case "REMOVE_VOTE":
      var updatedIdeas = state.ideas.map( i => {
        if (i.id == action.i_id) {
          return {...i,date_suggestions:
            i.date_suggestions.map( ds => {
              if (ds.id == action.ds_id) {
                const i = ds.voters.findIndex(v => v.id == state.user.id)
                let updatedVoters = ds.voters
                updatedVoters.splice(i, 1)
                return {...ds, voters: updatedVoters}
              }
              else {
                return ds
              }
            })
          }
        }
        else {
          return i
        }
      }
      )
      return {...state, ideas: updatedIdeas}
    case "REMOVE_IDEA_FROM_STORE":
      var updatedIdeas = state.ideas.filter( i => i.id != action.idea_id)
      return {...state, ideas: updatedIdeas}
    case "REMOVE_INVITATION_FROM_STORE":
      var updatedInvitations = state.invitations.filter(i => i.id != action.invite_id)
      return {...state, invitations: updatedInvitations}
    case "LOGIN":
      return {...state, user: action.user}
    case "LOGOUT":
      return {ideas: ["start"], events: ['start'], friends: ["start"], user:{id:"start"}, nonFriends: ['start']}
    case "UPDATE_USER":
      return {...state, user: {...state.user, first_name: action.first_name, last_name: action.last_name, email: action.email}}
    case "UPDATE_RSVP":
          const updatedInvitations = state.invitations.map(i => {
            if (i.idea_id == action.idea_id && i.invitee_id == state.user.id) {
              return {...i, accepted: action.response}
            }
            else {
              return i
            }
          })
          return {...state, invitations: updatedInvitations}
    default: return state
  }
}



export default ideasReducer
