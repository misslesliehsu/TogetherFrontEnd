import React, { Component } from 'react'
import { connect } from 'react-redux'
import FriendItem from './FriendItem'
import URL_ROOT from '../URL.js'
import { withRouter } from 'react-router-dom'
import DateSuggestionItem from './DateSuggestionItem'
import { Card } from 'semantic-ui-react'
import Datetime from 'react-datetime'


class IdeaScheduleForm extends Component {

  state = {
      name: '',
      location: '',
      description: '',
      date_suggestions: [{date: '', friendly_date: '', id: null, voters: [] }],
      invitees: [],
      owner_id: '',
      scheduled_date_friendly: '',
      scheduled_date: '',
      custom: ''
  }


  //for existing ideas; clicked 'schedule' from show page
  componentDidMount() {
    if (this.props.ideas[0] !== "start") {
      const ideaToSchedule = this.props.ideas.find(i => i.id == this.props.match.params.id)
      this.setState(ideaToSchedule)
    }
  }

  //for existing ideas; navigated directly to 'schedule' page (i.e. maybe no props avail yet)
  componentWillReceiveProps(nextProps) {
    if (nextProps.ideas[0] !== "start") {
      const ideaToSchedule = nextProps.ideas.find(i => i.id == this.props.match.params.id)
      this.setState(ideaToSchedule)
    }
  }
  //NOTES: I had to use both componentWillReceiveProps and componentWillMount because 1) used componentWillReceiveProps to indicate a direct attempt to visit the edit page for an existing item.  in this case, the store ideas may not be available to the component yet, as props, during componentDidMount - therefore need to catch when they DO come down the pike, and are complete (i.e. have ideas that are not in initial state 'start').  2) used componentDidMount for cases when someone is on Show page, then clicks 'edit'.  in this case, the props are already there -- no new influx will trigger a componentWillReceiveProps - thus state should be set during mount, with the ideas which are already available as props

  handleAddInvitee = (friend) => {
    this.setState({invitees: [...this.state.invitees, friend]})
  }

  handleRemoveInvitee = (friend) => {
    const i = this.state.invitees.findIndex( f => f.id === friend.id)
    const update = this.state.invitees
    update.splice(i, 1)
    this.setState({invitees: update})
  }

  calcNoninvitees = () => {
    return this.props.friends.filter(f => !this.state.invitees.includes(f))
  }

  handleChange = (e) => {
    this.setState(
      {[e.target.name]: e.target.value}
    )
  }

  handleSetFinalDate = (e) => {
    let scheduled_date = e.format() //RC3339
    let scheduled_date_friendly = e.format("dddd, MMMM Do YYYY, h:mm A")
    this.setState({scheduled_date, scheduled_date_friendly})
  }

  handleSchedule = (e) => {
    e.preventDefault()
    if (this.state.scheduled_date === '') {
      window.alert("Must have a Final Date!")
    }
    else {
      fetch(`${URL_ROOT}users/${this.props.user_id}/ideas/${this.props.match.params.id}`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
              {
                idea:{
                  name: this.state.name,
                  location: this.state.location,
                  owner_id: this.state.user_id,
                  description: this.state.description,
                  scheduled_date: this.state.scheduled_date,
                  scheduled_date_friendly: this.state.scheduled_date_friendly
                },
                date_suggestions: this.state.date_suggestions,
                invitees: this.state.invitees
              }
            )
          }).then(res=> res.json())
          .then(res => {this.props.updateIdea({...this.state, id: this.props.match.params.id}); return res})
          .then(res=>this.props.history.push(`/events/${this.props.match.params.id}`))
      }
  }
  // what do i do with the errors here - should not save & should not go to show page


//none of the drag/drop is used
  handleDrop = (e) => {
    const invitee = JSON.parse(e.dataTransfer.getData('friend'))
    this.props.addInvitee(invitee)
  }

  dragOver = (e) => {
    e.preventDefault()
  }

  dragEnd = (e) => {
    e.preventDefault()
  }

  handleDelete = () => {
    fetch(`${URL_ROOT}users/${this.props.user_id}/ideas/${this.props.match.params.id}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(this.props.removeIdea(this.props.match.params.id))
    .then(this.props.history.push('/dashboard'))
  }

  renderSuggestions = () => {
    const ideaToSchedule = (this.props.ideas[0] !== "start") ? this.props.ideas.find(i => i.id == this.props.match.params.id) : {date_suggestions: []}

    return (
      ideaToSchedule.date_suggestions.length > 0 ?
        <div>
          {ideaToSchedule.date_suggestions.map(d =>
            <div style={{display:'grid', gridTemplateColumns:'50px auto'}}>
            <button style={{fontSize:'15px', padding:'0', height:'30px'}} onClick={() => {this.setState({scheduled_date: d.date, scheduled_date_friendly: d.friendly_date, custom:true})}}>pick date</button>
            <DateSuggestionItem key={d.id} d={d} ideaId={ideaToSchedule.id} ownerId={ideaToSchedule.owner_id}/>
            <br></br>
            </div>)}
        </div>
     :
     <div style={{fontSize: '20px'}}>There are no date suggestions yet.</div>

    )
  }

  render() {
    const ideaToSchedule = (this.props.ideas[0] !== "start") ? this.props.ideas.find(i => i.id == this.props.match.params.id) : {date_suggestions: []}
    return(
      <div>
        <div className='ideaForm' draggable='true' onDrop={this.handleDrop} onDragOver={this.dragOver} onDragEnd={this.dragEnd}>
          EVENT DETAILS
          <br></br><br></br>
          <form className='ideaFormForm'>
            <div style={{display: 'grid', gridTemplateColumns:'1fr 5fr'}}>
              <div style={{paddingTop: '5px', float:'right', lineHeight:'52px'}}>
                Name:
                <br></br>
                Description:
                <br></br>
                Location:
                <br></br>
              </div>
              <div>
                <input type='text' name='name' value={this.state.name} onChange={this.handleChange}></input>
                <br></br><br></br>
                <input type='textArea' name='description'value={this.state.description} onChange={this.handleChange}></input>
                <br></br><br></br>
                <input style={{marginBottom: '10px'}} type='text' name='location' value={this.state.location} onChange={this.handleChange}></input>
                <br></br><br></br>
              </div>
            </div>
          </form>
          <div style={{textAlign: 'left', marginLeft: '12px'}}>Date Suggestions: </div>

          <br></br><br></br><br></br>
          {this.renderSuggestions()}
          <br></br><br></br>

          <div>
            <div style={{float: 'left', marginTop: '25px', marginLeft:'60px'}}>Final Date:</div>
            <div  style={{marginLeft: '233px'}}>
              <div style={{float:'left', fontSize:'20px'}}>
                {this.state.custom === true ?
                  <div style={{width:'600px'}}>
                    <div style={{marginTop:'25px', fontSize:'25px', float:'left'}}>{this.state.scheduled_date_friendly}</div>
                    <button style={{marginTop:'20px'}} onClick={() => {this.setState({custom:false})}}>...or select a new date</button>
                  </div>
                  :
                  <Datetime inputProps={{className: "dateInputField", placeholder: 'Click to pick a date & time'}}
                  onChange={this.handleSetFinalDate}/>

                }

              </div>
            </div>
          </div>

          <br></br><br></br>
          <br></br><br></br>


          <br></br>
          <hr></hr>
          Invited:
          <br></br><br></br>
            {this.state.invitees.length === 0 && <div style={{textAlign:'center', fontSize:'20px'}}>There are no invitees yet!<br></br><br></br></div>}
            <Card.Group>
              {this.state.invitees.map( i => <FriendItem buttonAction={this.handleRemoveInvitee} key={i.id} friend={i}/>)}
          </Card.Group>
          <br></br><br></br>
          <hr></hr>
          <br></br>
          <button onClick={this.handleSchedule}>Book It!</button><br></br>
          <button style={{fontSize:'12px'}} onClick={this.handleDelete}>Delete Idea</button>

        </div>
        <div className='addMoreFriends'>
          <h1>Invite More Friends</h1>
            <Card.Group>
              {this.calcNoninvitees().map( nI => <FriendItem key={nI.id} buttonAction={this.handleAddInvitee} friend={nI}/>)}
            </Card.Group>
        </div>
      </div>













    //   <div>
    //     <div className='ideaForm' draggable='true' onDrop={this.handleDrop} onDragOver={this.dragOver} onDragEnd={this.dragEnd}>
    //
    //       EVENT DETAILS
    //       <br></br><br></br>
    //       <form className='ideaFormForm' >
    //         Name: <input type='text' name='name' placeholder='Idea Name' value={this.state.name} onChange={this.handleChange}></input>
    //       <br></br><br></br>
    //         Location: <input type='text' name='location' placeholder='Location' value={this.state.location} onChange={this.handleChange}></input>
    //         <br></br><br></br>
    //         Description: <input type='textArea' name='description' placeholder='Description' value={this.state.description} onChange={this.handleChange}></input>
    //         <br></br><br></br>
    //       </form>
    //       <p style={{float:'left'}}>Date Suggestions:</p>
    //       <br></br>
    //         {ideaToSchedule.date_suggestions.length > 0 ?
    //           <div style={{marginLeft: '20px'}}>
    //           {ideaToSchedule.date_suggestions.map(d => <DateSuggestionItem key={d.id} d={d} ideaId={ideaToSchedule.id} ownerId={ideaToSchedule.owner_id}/>)}
    //           </div>
    //        :
    //        <div style={{fontSize: '20px'}}>There are no date suggestions yet.</div>
    //         }
    //         <br></br><br></br><br></br><br></br>
    //         <div style={{float: 'left'}}>Final Date:</div>
    //       <input style={{float: 'left'}} type='date' className='dateInputField' onChange={this.handleChange} name={'scheduled_date_friendly'} value={this.state.scheduled_date_friendly}></input>
    //       <br></br><br></br>
    //         <br></br><br></br>
    //
    //       Invited:
    //       <br></br><br></br>
    //       <Card.Group>
    //         {this.state.invitees.map( i => <FriendItem buttonAction={this.handleRemoveInvitee} key={i.id} friend={i}/>)}
    //     </Card.Group>
    //     <br></br><br></br><br></br>
    //     <button onClick={this.handleSchedule}>Book It!</button>
    //     </div>
    //   <div className='addMoreFriends'>
    //     <h1>Invite More Friends</h1>
    //       <Card.Group>
    //         {this.calcNoninvitees().map( nI => <FriendItem key={nI.id} buttonAction={this.handleAddInvitee} friend={nI}/>)}
    //       </Card.Group>
    //   </div>
    // </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return ({
    addIdea: (i) => dispatch({type: 'ADD_IDEA', idea: i}),
    updateIdea: (i) => dispatch({type: 'UPDATE_IDEA', idea: i}),
    removeIdea: (id) => dispatch({type:'REMOVE_IDEA_FROM_STORE', idea_id: id})
  })
}

const mapStateToProps = (state) => {
  return {
    user_id: state.user.id,
    friends: state.friends,
    ideas: state.ideas
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IdeaScheduleForm))
