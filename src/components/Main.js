import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Switch, Route, withRouter } from 'react-router-dom'
import Dashboard from './Dashboard'
import Ideas from './Ideas'
import FriendsPage from './FriendsPage'
import LoginSignup from './LoginSignup'
import Profile from './Profile'
import EventCard from './EventCard'
import authorize from '../AuthHOC'
import IdeaSchedule from './IdeaSchedule'


class Main extends Component {

  render() {
    const AuthDashboard = authorize(Dashboard)
    const AuthIdeas = authorize(Ideas)
    const AuthFriendsPage = authorize(FriendsPage)
    const AuthProfile = authorize(Profile)
    const AuthEventCard = authorize(EventCard)
    const AuthIdeaSchedule = authorize(IdeaSchedule)

    return(
      <div>
        <Switch>
          <Route exact path='/login' component={LoginSignup}/>
          <Route exact path='/dashboard' component={AuthDashboard}/>
          <Route path='/ideas' component={AuthIdeas}/>
          <Route exact path='/friends' component={AuthFriendsPage}/>
          <Route exact path='/profile' component={AuthProfile}/>
          <Route exact path='/events/:id/schedule' component={AuthIdeaSchedule}/>
          <Route path='/events/:id' component={AuthEventCard}/>
          <Redirect to='/login'/>
        </Switch>
      </div>
    )
  }
}


export default withRouter(connect(null, null)(Main))
