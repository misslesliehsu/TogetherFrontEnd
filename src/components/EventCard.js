import React, {Component} from 'react'
import URL_ROOT from '../URL'
import { connect } from 'react-redux'
import FriendItem from './FriendItem'
import DateSuggestionItem from './DateSuggestionItem'
import { CardGroup } from 'semantic-ui-react'
import GoogleOAuth from './GoogleOAuth'



class eventCard extends Component {

  state = {
    accepted: null,
  }

  handleEdit = () => {
    this.props.history.push(`/events/${this.props.match.params.id}/schedule`)
  }

  showRSVPs = () => {
    const all_people = this.props.friends.concat(this.props.nonFriends)
    const invites = this.props.invitations.filter(i => i.idea_id == this.props.match.params.id)
    const yes = invites.filter(i => i.accepted == true)
    const no = invites.filter(i=> i.accepted == false)
    const tbd = invites.filter(i => !yes.includes(i) && !no.includes(i))
    const yes_people = yes.map(y => all_people.find(x => x.id == y.invitee_id))
    const no_people = no.map(n => all_people.find(x=> x.id == n.invitee_id))
    const tbd_people = tbd.map(t => all_people.find(x => x.id == t.invitee_id))
    return (
    <div style={{display:'grid', gridAutoRows: 'minmax(200px, auto)', marginLeft:'35px'}}>

      <div style={{display:'grid', gridTemplateColumns:'20px auto'}}>
          <h1 style={{color: 'green'}}>IN:</h1>
            <CardGroup>
              {yes_people.map( x => <FriendItem friend={x}/>)}
                <hr></hr><hr></hr>
            </CardGroup>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'20px auto'}}>
          <h1 style={{color: 'red'}}>OUT:</h1>
            <CardGroup>
              {no_people.map( x => <FriendItem friend={x}/>)}
            </CardGroup>
            <hr></hr><hr></hr>

      </div>

      <div style={{display:'grid', gridTemplateColumns:'20px auto'}}>
        <h1>TBD:</h1>
          <CardGroup>
            {tbd_people.map( x => <FriendItem friend={x}/>)}
          </CardGroup>
            <hr></hr><hr></hr>
      </div>

    </div>
    )
  }

  handleRSVP = (e) => {
      if (e.target.name === 'yes') {
          this.setState({accepted: true}, () => {
            fetch(`${URL_ROOT}invitations/${this.props.match.params.id}/${this.props.user_id}`, {
                    method: 'put',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                      {
                        response: this.state.accepted
                      }
                    )
                  })
                  this.props.updateRSVP(this.props.match.params.id, this.state.accepted)
            })
      }
      else {
        this.setState({accepted: false}, () =>     {
          fetch(`${URL_ROOT}invitations/${this.props.match.params.id}/${this.props.user_id}`, {
                  method: 'put',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(
                    {
                      response: this.state.accepted
                    }
                  )
                })
          this.props.updateRSVP(this.props.match.params.id, this.state.accepted)
          })
      }
    }


  setupRSVP = () => {
    let invitation = this.props.invitations.find(i => i.idea_id == this.props.match.params.id && i.invitee_id == this.props.user_id)
    switch (invitation.accepted) {
      case null:
        return (
          <div>
            <button className='RSVP' name='yes' onClick={this.handleRSVP}>I'm In!</button>
            <button className='RSVP' name='no' onClick={this.handleRSVP}>I'm Out</button>
          </div>
        )
      case false:
        return (
          <div>
            <button className='RSVP' name='yes' onClick={this.handleRSVP}>I'm In!</button>
            <button className='RSVP Selected' name='no' onClick={this.handleRSVP}>I'm Out</button>
          </div>
        )
      case true:
        return (
          <div>
            <button className='RSVP Selected' name='yes' onClick={this.handleRSVP}>I'm In!</button>
            <button className='RSVP' name='no' onClick={this.handleRSVP}>I'm Out</button>
          </div>
        )
      }
  }

  handleEventCreation(e) {
    let to_schedule = e
     var request = window.gapi.client.request({
     'method': 'POST',
     'path': "https://www.googleapis.com/calendar/v3/calendars/primary/events",
     'headers': {
           'Content-Type': 'application/json'
         },
     'body': {
       summary: e.name,
       start: {dateTime: e.scheduled_date},
       end: {dateTime: e.scheduled_date}
     }
   })
   .then(function(response) {
   if (response.result.kind) {
     window.alert("Google Calendar event created!")
   }
   }, function(reason) {
  console.log(reason.result)
   console.log('Error: ' + reason.result.error.message)
   if (reason.result.error.message === "Login Required") {
     window.alert("Sign in first, then try again!")
     window.gapi.auth2.getAuthInstance().signIn();
      }
    else {
      window.alert("Google calendar event created!")
    }
    })

  }


  handleBackToDash = () => {
    this.props.history.push(`/dashboard`)
  }

  handleHostName = () => {
    let getIdea = this.props.ideas.find( i => i.id == this.props.match.params.id)
    let all_people = this.props.nonFriends.concat(this.props.friends)
    if (this.props.user_id !== 'start') {
      return (
        getIdea.owner_id == this.props.user_id ?
        "You" : all_people.find(f => f.id == getIdea.owner_id).first_name
      )
    }
  }

  render() {
    let eventScheduled = this.props.ideas.find( i => i.id == this.props.match.params.id)
    return (
      <div>
        <br></br><br></br>
        <img src={require('../calendar.png')} style={{height: '200px'}}/>
        {eventScheduled &&
          <div className='eventCard'>
            <button onClick={() => {this.handleEventCreation(eventScheduled)}}>Add To Google Calendar</button>
            <h1 style={{fontSize: '40px'}}>{eventScheduled.name}</h1>
            <div className='eventData'>
              <ul style={{listStyle: 'none'}}>
                <li>HOSTED BY: {this.handleHostName()}</li>
                <li>DESCRIPTION: {eventScheduled.description}</li>
                <li>WHERE: {eventScheduled.location}</li>
                <li>DATE: {eventScheduled.scheduled_date_friendly}</li>
                <li>INVITED:</li>
              </ul>
            </div>
              <br></br><br></br>
              <div>
                {this.showRSVPs()}
              </div>
              <br></br><br></br><br></br>
              {this.props.user_id === eventScheduled.owner_id && <button onClick={this.handleEdit}>Edit Idea</button>}
              <br></br><br></br>
              {this.props.user_id !== eventScheduled.owner_id &&
                this.setupRSVP()
              }
              <br></br><br></br><br></br>
            <div style={{textDecoration: 'underline', float: 'left'}} onClick={this.handleBackToDash}>Back To Dashboard</div><br></br>
          </div>
        }
        <br></br><br></br> <br></br><br></br>
        <GoogleOAuth/>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    user_id: state.user.id,
    ideas: state.ideas,
    invitations: state.invitations,
    friends: state.friends,
    nonFriends: state.nonFriends
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateRSVP: (idea_id, response) => dispatch({type: 'UPDATE_RSVP', response, idea_id})
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(eventCard)
