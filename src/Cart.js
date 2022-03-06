import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import "./Cart.css"
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { useGlobalContext } from './context';
import SubTotal from './SubTotal';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SanitizerOutlinedIcon from '@mui/icons-material/SanitizerOutlined';
import DryCleaningOutlinedIcon from '@mui/icons-material/DryCleaningOutlined';

const Cart = () => {

    const history = useHistory()

    const {cart, cartDispatch, user, isUserAuthenticated, isUserLoggedIn} = useGlobalContext()

    useEffect(() => {
        if(!isUserAuthenticated){
            isUserLoggedIn()
        }
    }, [])

    console.log(user)

    const handleQty = (e, _id) => {
        console.log(_id, e.target.value)
        cartDispatch({type:"ADJUST_QTY", payload:{id:_id, qty:parseInt(e.target.value)}})
    }

    const removeCartItem = (_id) => {
        cartDispatch({type:"REMOVE_FROM_CART", payload:_id})
    }

    console.log(cart)

  return (
    <section className='cart-section'>
        <button onClick={()=>{history.goBack()}} className="goBack-btn"><ArrowBackIosIcon /> Back </button>
        <div className='container cart-wrapper'>
            <div className='cart-left'>
                <div className='cart-heading'>
                    <h2>Laundry Items</h2>
                </div>
                <h3>Your Clothes</h3>
                <div className='cart-products-wrapper'>
                    {cart.map((item)=>{
                        const {_id, name, rate, qty} = item
                        return(
                            <div key={_id} className="product-info">
                                <p>{item.serviceName && item.serviceName} . {item.catName && item.catName}</p>
                                <h3 style={{display:"flex", alignItems:"center", gap:"10px"}}><DryCleaningOutlinedIcon /> {name}</h3>
                                <div className='product-rate-div'>
                                    <p>₹ {rate} / pc</p>
                                    <button className='remove-product' onClick={()=>removeCartItem(_id)}>Remove</button>
                                </div>
                                
                                    {item.extrasSelected.length > 0 && (
                                        <div className='extras-cart'>
                                            <p><b>Add-ons</b> selected:</p>
                                            <ul>
                                            {item.extrasSelected.map((item)=>{
                                                return(
                                                    <li key={item._id} className="extras-list">
                                                        <SanitizerOutlinedIcon /> <p>{item.name} . ₹ {item.rate} / pc</p>
                                                    </li>
                                                )
                                            })}
                                            </ul>
                                        </div>
                                    ) }
                                
                                <div className='quantity-container'>
                                    <label>Quantity:</label>
                                    <input type='number' value={qty} min='1' onChange={(e)=>handleQty(e, _id)}></input>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='cart-right'>
                <div className='schedule-btn-div'>
                    <button className='pickupBtn' onClick={()=>{history.push("/schedulePickup")}}><AccessTimeOutlinedIcon /> Schedule Pickup</button>
                </div>
                <div className='subtotal-div'>
                    <SubTotal />
                </div>
            </div>
        </div>
    </section>
  )
}

export default Cart