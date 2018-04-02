import React, { Component } from 'react'
import { Form, Segment} from 'semantic-ui-react'
import { connect } from 'react-redux'
import {URL_ROOT_API} from '../URL'


class ProfilePage extends Component {

  state = {
    editting: false,
    button: "Edit Profile",
    first_name: '',
    last_name: '',
    email: ''
  }

  handleClick = (e) => {
    e.preventDefault()
    if (this.state.editting === true) {
      const payload =
      {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email
      }
      this.setState({editting: false, button: "Edit Profile"})
      fetch(`${URL_ROOT_API}users/${this.props.user.id}`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
              payload
            )
          })
      this.props.updateUser(payload)
    }
    else {
      this.setState({editting: true, button: "Save Changes", first_name: this.props.user.first_name, last_name: this.props.user.last_name, email: this.props.user.email})
    }
  }

  handleChange = (e) => {
    this.setState(
      {[e.target.name]: e.target.value}
    )
  }

  render() {
    return (
      <div>
        <br></br><br></br>
        {this.state.editting === false ?

          <div style={{fontSize: '30px'}} className='Profile'>
            <p>First name: {this.props.user.first_name}</p>
            <p>Last name: {this.props.user.last_name}</p>
            <p>Email address: {this.props.user.email}</p>
          </div>
          :
            <div style={{width: '600px',fontSize:'30px', margin:'0 auto'}}>
              <input style={{height:'50px'}} value={this.state.first_name} name='first_name'onChange={this.handleChange} placeholder='First Name'/>
              <br></br>
              <input style={{height:'50px'}} value={this.state.last_name} name='last_name'onChange={this.handleChange} placeholder='Last Name'/>
              <br></br>
              <input style={{height:'50px'}} value={this.state.email} name='email' onChange={this.handleChange} placeholder='Email'/>
              <br></br>
            </div>

      }
      <br></br><br></br>
      <button onClick={this.handleClick}>{this.state.button}</button><br></br>
      {this.state.editting === true  && <button onClick={this.handleClick}>Go Back</button>}
      </div>
    )
  }

}


const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (d) => dispatch({type: 'UPDATE_USER',  first_name: d.first_name, last_name: d.last_name, email: d.email })
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
