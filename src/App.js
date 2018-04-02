import React, { Component } from 'react';
import './App.css';
import './DateTime.css'
import Header from './components/Header'
import Main from './components/Main'
import URL_ROOT from './URL'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getCurrentUser, loadData } from './actions'


class App extends Component {

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.getCurrentUser()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user_id === 'start' && nextProps.user_id != 'start') {
      this.props.loadData(nextProps.user_id)
    }
  }

  render() {
    return (
      <div className="App">
        {this.props.user_id !== 'start' &&
            <Header history={this.props.history}/>
         }
        <Main/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user_id:  state.user.id
  }
}

export default withRouter(connect(mapStateToProps, {getCurrentUser, loadData})(App))
