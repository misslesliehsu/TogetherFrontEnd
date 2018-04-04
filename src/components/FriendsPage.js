import React, { Component } from 'react'
import FriendItem from './FriendItem'
import { connect } from 'react-redux'
import {URL_ROOT_API} from '../URL'


class FriendsPage extends Component {

  state = {
    input: '',
    results: []
  }

  handleRemoveFriend = (f) => {
    fetch(`${URL_ROOT_API}friendships/${this.props.user_id}/${f.id}`, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(this.props.removeFriend(f))
  }

  handleAddFriend = (f) => {
    fetch(`${URL_ROOT_API}users/${this.props.user_id}/friendships`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            friend_id: f.id
          })
        }).then(this.props.addFriend(f))
  }


  handleChange = (e) => {
    this.setState({input: e.target.value}, () => this.setState({results: this.props.nonFriends.filter(nF => nF.first_name.includes(this.state.input) || nF.last_name.includes(this.state.input))}))
  }


  render() {
    console.log(this.state.input)
    let withoutSelfResults = this.state.results.filter( f => f.id !==this.props.user_id)
    let withoutSelfAll = this.props.nonFriends.filter( f => f.id !==this.props.user_id)

    return (
      <div>
        <h1>Your Friends</h1>
        <div className='friendArea' style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
            {this.props.friends[0] !=='start' && this.props.friends.map(f => <FriendItem key={f.id} label='Remove' buttonAction={this.handleRemoveFriend} friend={f}/>)}
        </div>


        <div className='searchBar'>
          <br></br>

          <h1>Search for more Friends:</h1>
          <div>
            <input type="text" value={this.props.input} onChange={this.handleChange} tabindex="0" autoComplete="off" />
            <i aria-hidden="true" className="search icon"></i>
          </div>
            <br></br><br></br><br></br><br></br>
          <div style={{display:'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
            {this.state.input === '' ?
                    withoutSelfAll.map(f => <FriendItem key={f.id} buttonAction={this.handleAddFriend} label='Add Friend' friend={f}/>)
                    :
                    withoutSelfResults.map(f => <FriendItem key={f.id} buttonAction={this.handleAddFriend} label='Add Friend' friend={f}/>)
                  }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    friends: state.friends, nonFriends: state.nonFriends,
    user_id: state.user.id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addFriend: (f) => dispatch({type: 'ADD_FRIEND', friend: f}),
    removeFriend: (f) => dispatch({type: 'REMOVE_FRIEND', friend: f})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsPage)
