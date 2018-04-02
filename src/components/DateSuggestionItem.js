import React, {Component} from 'react'
import {URL_ROOT_API} from '../URL'
import { connect } from 'react-redux'

class DateSuggestionItem extends Component {


  handleVoteOrUnvote = () => {
      const {voters, id} = this.props.d
      const {user_id, ideaId, ownerId, addVote, removeVote} = this.props
      //HOW COME I CANT USE PROPS WITHIN THE IF BLOCKS BELOW? HAD TO DECONSTRUCT & DEFINE ABOVE


    // if this person is already in the invitees, delete the vote with a fetch delete
    if (voters.some( v => v.id == user_id)) {
      fetch(`${URL_ROOT_API}votes/${id}/${user_id}`, {
            method: 'delete',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(removeVote(ideaId, id))
    }
    else {
      //otherwise, add them as a voter
      fetch(`${URL_ROOT_API}votes/${id}/${user_id}`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
            )
          }).then(addVote(ideaId, id))
    }
  }

  buttonText = () => {
    if (this.props.d.voters.some( v => v.id == this.props.user_id)) {
      return true
    }
    else {
      return false
    }
  }

  render() {
    return (
      <div style={{display:'grid', width: '1200px', gridTemplateColumns:'1fr 5fr 15fr'}}>
        {this.props.ownerId !== this.props.user_id ?
          <div>
          <input className='voteCheckbox' type='checkbox' style={{fontSize:'2px'}} checked={this.buttonText()} onClick={this.handleVoteOrUnvote}></input>
          </div>
          :
          <div></div>
        }
        <div style={{fontSize:'20px', marginTop:'10px'}}>
          {this.props.d.friendly_date}:
        </div>
        <div style={{textAlign:'left'}}>
              {this.props.d.voters.length > 0 ?
                  this.props.d.voters.map( v =>
                    <div className='voterName'>
                      &nbsp;{v.first_name}&nbsp;
                    </div>
                  )
                 :
                 <div style={{fontSize:'20px', marginLeft: '20px',marginTop:'10px'}}>No voters yet.</div>
                }
        </div>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    addVote: (i_id, ds_id) => dispatch({type: 'ADD_VOTE', i_id, ds_id}),
    removeVote: (i_id, ds_id) => dispatch({type: 'REMOVE_VOTE', i_id, ds_id})
  }
}


const mapStateToProps = (state) => {
  return {user_id: state.user.id}
}

export default connect(mapStateToProps, mapDispatchToProps)(DateSuggestionItem)
