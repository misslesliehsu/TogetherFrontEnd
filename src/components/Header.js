import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'


//If we were to create links using anchor elements, clicking on them would cause the whole page to reload. React Router provides a <Link> component to prevent that from happening. When clicking a <Link>, the URL will be updated and the rendered content will change without reloading the page.

const header = (props) => {

  const handleLogOut = () => {
    localStorage.removeItem('token')
    props.logout()
    props.history.push('/login')
  }

  return (
    <div>
        <h1 className='togetherLogo'>TOGETHER</h1>
        {props.user_id !== 'start' &&
        <Menu class="menu" size='large' pointing secondary>
          <Menu.Item className='menuItem'><Link className='menuItem' style={{fontSize:'30px', color:'white'}}class='item' to='/dashboard'>Dashboard</Link></Menu.Item>
          <Menu.Item><Link className='menuItem'style={{fontSize:'30px', color: 'white'}}class='item' to='/Profile'>Profile</Link></Menu.Item>
          <Menu.Item><Link className='menuItem'style={{fontSize:'30px', color: 'white'}}class='item' to='/Friends'>Friends</Link></Menu.Item>
            {props.user_id !== 'start' &&
              <Menu.Menu position='right'>
                <Menu.Item style={{fontSize:'30px', color:'yellow', marginBottom:'12px'}}>Hi {props.name}!</Menu.Item>
                <Menu.Item onClick={handleLogOut} style={{fontSize:'30px', color:'white', marginBottom: '10px', marginRight: '40px'}}>Log Out</Menu.Item>
              </Menu.Menu>
            }
        </Menu>
        }
    </div>



  )
}


const mapDispatchToProps = (dispatch) => {
  return ({
    logout: () => dispatch({type:'LOGOUT'})
  })
}

const mapStateToProps = (state) => {
  return {
    user_id: state.user.id,
    name: state.user.first_name
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(header)
