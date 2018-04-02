import React, { Component } from 'react'
import { connect } from 'react-redux'
import {URL_ROOT_API} from '../URL'

class EventListing extends Component {


  handleEventClick = (e) => {
    if (e.target.id != 'removeListing') {
      this.props.history.push(`/events/${this.props.e.id}`)
    }
  }


  handleRemoveListing = () => {
    const invite = this.props.invitations.find( i => i.idea_id == this.props.e.id)
    fetch(`${URL_ROOT_API}invitations/${this.props.e.id}/${this.props.user_id}`, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(this.props.removeIdeaFromStore(this.props.e.id))
          .then(this.props.removeInvitationFromStore(invite.id))
  }


  calcRSVP = () => {
    if (this.props.invitations) {
      if (this.props.invitations[0] !== 'start' && this.props.e !=='start') {
    const invite = this.props.invitations.find( i => i.idea_id == this.props.e.id && i.invitee_id == this.props.user_id)
    if (this.props.e.owner_id == this.props.user_id) {
      return (
        <img className='eventListingStar' src={require ('../star.png')}></img>
      )
    }
      if (invite) {
        switch (invite.accepted) {
          case true:
            return (
              <button className="RSVPbuttonIn">
                IN
              </button>
              )
          case false:
            return (
              <div>
                <button className="RSVPbuttonOut">
                  OUT
                </button>
                <button style={{fontSize:'8px', margin:'0'}} id="removeListing" className='XEventListing'onClick={this.handleRemoveListing}>X</button>
              </div>
              )
          case null:
            return (
              <button className="RSVPbutton">
                RSVP
              </button>
            )
          default:
            return (<div></div>)
        }
      }
    else {
      return <div></div>
    }
  }
}
}

  shortenedDate = () => {
    let x = new Date(this.props.e.scheduled_date)
    x = x.toString()
    return x.substring(0,10)
  }


    render() {
      return (
        <div onClick={this.handleEventClick} style={{display:'grid', gridTemplateColumns:'0.5fr 2fr 4fr 1.5fr'}}>
          <div>
            <img src={require('../calendar.png')} style={{height: '20px', marginTop:'10px', marginRight:'0'}}/>
          </div>
          <div style={{margin: 'auto', fontSize:'15px', marginRight:'10px'}}>
            {this.shortenedDate()}
          </div>
          <div className='eventCaption' style={{marginLeft:'10px'}}>
            {this.props.e.name}
          </div>
          <div>
            {this.calcRSVP()}
          </div>
          <span><hr></hr></span>
          <span><hr></hr></span>
          <span><hr></hr></span>
        </div>
      )
    }
}


const mapStateToProps = (state) => {
  return {
    invitations: state.invitations,
    user_id: state.user.id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeIdeaFromStore: (i_id) => dispatch({type: 'REMOVE_IDEA_FROM_STORE', idea_id: (i_id)}),
    removeInvitationFromStore: (invite_id) => dispatch({type: 'REMOVE_INVITATION_FROM_STORE', invite_id: (invite_id)})
  }

}


export default connect(mapStateToProps, mapDispatchToProps)(EventListing)
