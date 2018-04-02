import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import IdeaForm from './IdeaForm'
import IdeaCard from './IdeaCard'
import IdeaSchedule from './IdeaSchedule'

const ideas = () => {
  return (
    <div>
      <Switch>
        <Route exact path='/ideas/new' render={ (routeProps) => <IdeaForm purpose={'new'} {...routeProps}/>}/>
        <Route exact path='/ideas/:id' render={ (routeProps) => <IdeaCard purpose={'show'} {...routeProps}/>}/>
        <Route exact path='/ideas/:id/edit' render={ (routeProps) => <IdeaForm purpose={'edit'} {...routeProps}/>}/>
        <Route exact path='/ideas/:id/schedule' component={IdeaSchedule}/>
      </Switch>
    </div>


  )
}

export default withRouter(ideas)
