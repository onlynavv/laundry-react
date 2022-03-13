import React from 'react'
import { useHistory } from 'react-router-dom'
import { useGlobalContext } from './context'
import "./OrdersList.css"

const OrdersList = ({item, getUserOrders}) => {
    const {_id, pickupDetails, orderStatus, orderUpdatedAt, grandTotal, orderedAt} = item
    const {pickupDate, pickupTime, expectedDelivery} = pickupDetails[0]
    const newUpdatedDate = new Date(orderUpdatedAt)
    const newOrderedAt = new Date(orderedAt)

    const history = useHistory()

    const {user} = useGlobalContext()

    const handleCancelRequest = async(orderId) => {
        try{
            const resp = await fetch(`https://laundry-node-app.herokuapp.com/laundry/order/cancelRequest/${orderId}`, {
            method:'DELETE',
            headers: { "Content-Type": "application/json", "x-auth-token":user.token}
                })

        const data = await resp.json()

        if(resp.ok){
            getUserOrders()
        }else{
            throw new Error(data.msg)
        }

        }

        catch(error){
            console.warn(error.toString())
        }
    }

  return (
    <div className='orderslist'>
        <div className='orderlist-header'>
            <p>Order ID: <b>#{_id}</b> . {newOrderedAt.toLocaleDateString()}</p>
            <p><b>₹ {grandTotal}</b></p>
        </div>
        <div className='order-currentStatus'>
            <p>Current Status:</p>
            <p className='current-status'>{orderStatus}</p>
            <p className='current-status-update'>{newUpdatedDate.toLocaleDateString()} . {newUpdatedDate.toLocaleTimeString()}</p>
        </div>
        <div className='order-footer'>
            <div className='dates-div'>
                <div className='pickup-date-div'>
                    <p>Pickup:</p>
                    <p>{new Date(parseInt(pickupDate)*1000).toLocaleDateString()} . {pickupTime}</p>
                </div>
                <div className='delivery-date-div'>
                    <p>Expected Delivery:</p>
                    <p>{expectedDelivery}</p>
                </div>
            </div>
            <div className='order-view-details'>
                <button className="laundry-Viewbtn" onClick={()=>history.push(`/orderDetails/${item._id}`)}>View Details</button>
                {orderStatus === "pickup requested" && <button className='laundry-cancelBtn' onClick={()=>handleCancelRequest(item._id)}>Cancel Request</button>}
            </div>
        </div>
    </div>
  )
}

export default OrdersList