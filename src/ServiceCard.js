import React from 'react'
import "./ServiceCard.css"
import { useHistory } from 'react-router-dom'

const ServiceCard = ({_id, img, name}) => {

  const history = useHistory()

  return (
    <div className='service-container'>
        <div className='service-img'>
            <img src={img} alt={name}></img>
        </div>
        <div className='service-type'>
            <h4>{name}</h4>
        </div>
        <div className='service-btn'>
            <button onClick={()=>{history.push(`/singleService/${_id}`)}}>Select Service</button>
        </div>
    </div>
  )
}

export default ServiceCard