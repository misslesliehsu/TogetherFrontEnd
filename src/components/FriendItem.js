import React from 'react'

const friendItem = (props) => {

  const dragstart = (e) => {
    const friend = JSON.stringify(props.friend)
    e.dataTransfer.setData('friend', friend)
  }

  return (
    <div style={{float:'center', marginLeft:'60px'}}>
      {props.buttonAction ?
      <div className='friendCard' onClick={() => props.buttonAction(props.friend)}>
        <img className='profilePic' src={props.friend.profile_pic}></img><br></br>
        {props.friend.first_name + " " + props.friend.last_name}
      </div>
      :
      <div className='friendCard'>
        {props.friend.profile_pic && <img className='profilePic' src={props.friend.profile_pic} style={{marginLeft:'35px'}}></img>}
          <div style={{lineHeight:'25px', margin:'0 auto'}}>
            {props.friend.first_name + " " + props.friend.last_name}
          </div>
      </div>
    }
    </div>
  )
}

export default friendItem
//
// <div className='friendItem' draggable='true' onDragStart={dragstart}>
// </div>
