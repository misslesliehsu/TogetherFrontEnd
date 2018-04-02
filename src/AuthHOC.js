import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

const authorize = ProtectedComponent => {
  return (props) => {
    return (props.user_id == "start") ?
      <Redirect to="/login" {...props}/>
      :
      <ProtectedComponent {...props}/>
  }
}

export default authorize
