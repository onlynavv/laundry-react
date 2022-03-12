import React, { useEffect, useState } from 'react'
import { useGlobalContext } from './context'
import "./SubTotal.css"
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import { useHistory } from 'react-router-dom';

const SubTotal = () => {

  const {cart, pickupDetails, user, cartDispatch} = useGlobalContext()

  const history = useHistory()

  const {deliveryMethod, pickupDate} = pickupDetails.length > 0 && pickupDetails[0]
  console.log(deliveryMethod && deliveryMethod)

  const [subTotal,setSubTotal] = useState(0)
  const [totalItems,setTotalItems] = useState(0)
  const [payment, setPayment] = useState(false)
  const [paymentOrderId, setPaymentOrderId] = useState("")
  const [paymentId, setPaymentId] = useState("")
  const [signature, setSignature] = useState("")
  const [cardNum, setCardNum] = useState("4111 1111 1111 1111")
  const [cvv, setCVV] = useState("123")
  const [showCred, setShowCred] = useState(true)

  let deliveryCharge = 0

  deliveryCharge = deliveryMethod?.rate ? deliveryMethod.rate : 0

  const grandTotal = deliveryCharge + subTotal

  useEffect(()=>{

        let items = 0
        let rate = 0

        cart.forEach(item => {
            items += item.qty
            rate += item.qty * item.rate

            item.extrasSelected.length > 0 && item.extrasSelected.forEach((extraItem)=>{
              rate += extraItem.rate * item.qty
            })
        });

        setSubTotal(rate)
        setTotalItems(items)
    },[cart,subTotal, totalItems])

    console.log(cart)
    console.log(pickupDetails)

    const makePayment = async() =>{
      const resp = await fetch(`https://laundry-node-app.herokuapp.com/laundry/order/createOrder/${grandTotal}`, {
        method:"GET",
        headers:{"Content-Type": "application/json", "x-auth-token":user.token}
      })

      const data = await resp.json()
      console.log(data)

      if(resp.ok){
        const options = {
            "key": "rzp_test_5ndz0S2JkbmF1B",
            "amount": data.amount,
            "currency": data.currency,
            "name": "Laundry Hub",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": data.id,
            "handler": function (response){
                setPaymentOrderId(response.razorpay_order_id)
                setPaymentId(response.razorpay_payment_id)
                setSignature(response.razorpay_signature)
                setPayment(true)
            },
            "prefill": {
                "name": user.username,
                "email": user.email
            }
        };
        var rzp1 = new window.Razorpay(options);

        rzp1.open()

        rzp1.on('payment.failed', function (response){
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);
        });
      }
    }

    console.log({"paymentId":paymentId})
    console.log({"paymentOrderId":paymentOrderId})
    console.log({"signature":signature})

    const placeOrder = async(cart, pickupDetails,userId, userEmail, grandTotal, subTotal, deliveryCharge, deliveryMethod, pickupDate) => {
      const orderDetails = {cart, pickupDetails,userId, userEmail, grandTotal, subTotal, deliveryCharge, deliveryMethod, pickupDate, paymentId, paymentOrderId}
      console.log(JSON.stringify(orderDetails))
      const resp = await fetch('https://laundry-node-app.herokuapp.com/laundry/order/placeOrder', {
            method:'POST',
            headers: { "Content-Type": "application/json", "x-auth-token":user.token},
            body: JSON.stringify({orderDetails})
                })
            
            const data = await resp.json()

            console.log(data)

            if(resp.ok){
                console.log(data)
                const {insertedId, acknowledged} = data
                if(acknowledged){
                  cartDispatch({type:"CLEAR_CART"})
                  history.push(`/orderSuccess/${insertedId}`)
                }
            }else{
                localStorage.setItem("cart", JSON.stringify({orderDetails}));
            }
            console.log("Order Items:", {orderDetails});
    }

    useEffect(()=>{
      if(payment){
        placeOrder(cart, pickupDetails, user._id, user.email, grandTotal, subTotal, deliveryCharge, deliveryMethod?.method, pickupDate)
      }
    },[payment])

  return (
    <div className='subtotal-wrapper'>
      <h2>Bag Overview</h2>
      <p><b>Total Items:</b> {totalItems}</p>
      {cart.map((item)=>{
        const {_id, name, qty, rate} = item
        return(
          <div key={_id} className='subtotal-item'>
            <p>{item.serviceName && item.serviceName} . {item.catName && item.catName}</p>
            <div className='product-rate-div'>
              <h4>{name} * {qty}</h4>
              <p>₹ {rate * qty}</p>
            </div>
            <p>₹ {rate} / pc</p>
            
              {item.extrasSelected.length > 0 && item.extrasSelected.map((item)=>{
                return(
                  <div className='extras-cartRate-div' key={item._id}>
                    <div className='extras-product'>
                      <h4>{item.name} * {qty}</h4>
                      <p>₹ {item.rate * qty}</p>
                    </div>
                    <p>₹ {item.rate} / pc</p>
                  </div>
                )
              })}
      
          </div>
        )
      })}
      <div className='subtotal-value'>
        <p>Subtotal:</p>
        <p>₹ {subTotal}</p>
      </div>
      <div className='delivery-charge'>
        <p>Delivery Charge:</p>
        <p>₹ {deliveryCharge}</p>
      </div>
      {pickupDetails.length > 0 && (
        <div className='checkout-delivery-method'>
          <p>Delivery Method choosed:</p>
          <div>
            <p>{deliveryMethod?.method}</p>
            <p>delivery in: {deliveryMethod?.deliveryIn} hr</p>
          </div>
        </div>
      )}
      <div className='total-value'>
        <p>Grand Total:</p>
        <p>₹ {grandTotal}</p>
      </div>
      {pickupDetails.length > 0 && (
        <div className='placeorder-btn-div'>
          {/* <button className='pickupBtn' onClick={()=>{placeOrder(cart, pickupDetails, user._id, user.email, grandTotal, subTotal, deliveryCharge, deliveryMethod?.method, pickupDate)}}><ShoppingCartCheckoutOutlinedIcon /> Place Order</button> */}
          <button className='pickupBtn' onClick={()=>{makePayment()}}><ShoppingCartCheckoutOutlinedIcon /> Place Order</button>
        </div>
      )}
      {pickupDetails.length > 0 && (
        <div className='test-cred' style={{marginTop:"20px"}}>
          <h3>Test Payment Credentials</h3>
          <div className='test-cred-info'>
            <div className='cred-left'>
              <p>Card Number</p>
              <input type={showCred === false ? "text" : "password"} value={cardNum} readOnly></input>
            </div>
            <div className='cred-right'>
              <p>CVV</p>
              <input type={showCred === false ? "text" : "password"} value={cvv} readOnly></input>
            </div>
          </div>
          <button onClick={()=>setShowCred(!showCred)} className="show-cred">Show</button>
        </div>
      )}
    </div>
  )
}

export default SubTotal