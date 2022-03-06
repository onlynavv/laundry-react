import React,{useState, useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useGlobalContext } from './context';
import "./ViewOrder.css"
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useFormik } from 'formik'
import * as yup from 'yup';
import { FormHelperText } from '@mui/material';
import Button from '@mui/material/Button';

const validateFormSchema = yup.object({
    stage: yup.string().required('Please choose the Order Status'),
})

const ViewOrders = () => {

    const {id} = useParams()

    const history = useHistory()

    const {user, isUserAuthenticated, isUserLoggedIn} = useGlobalContext()

    const [singleUserOrder, setSingleUserOrder] = useState()

    useEffect(() => {
        if(!isUserAuthenticated){
            isUserLoggedIn()
        }
    }, [])

    const adminGetUserOrder = () => {
        fetch(`https://laundry-node-app.herokuapp.com/laundry/order/adminGetOrderDetail/${id}`, {
            method:'GET',
            headers: { "Content-Type": "application/json", "x-auth-token":user.token}
                })
        .then((data)=> data.json())
        .then((details)=> setSingleUserOrder(details))
    }

    useEffect(()=>{
        adminGetUserOrder()
    },[user])

    console.log(singleUserOrder, "lineno: 35")

    const {handleBlur, handleChange, handleSubmit, errors, values, touched} = useFormik(
        {
            initialValues:{stage:""},
            validationSchema: validateFormSchema,
            onSubmit: (values) => {
                changeStatus(values)
            }
        }
    )

    const changeStatus = async(values) => {
        console.log(values)
        try{
            const resp = await fetch(`https://laundry-node-app.herokuapp.com/laundry/order/updateOrderStatus/${id}`, {
            method:'PUT',
            headers: { "Content-Type": "application/json", "x-auth-token":user.token},
            body: JSON.stringify(values)
                })

        const data = await resp.json()

        if(resp.ok){
            history.goBack()
        }else{
            throw new Error(data.msg)
        }

        }

        catch(error){
            console.warn(error.toString())
        }
    }

  return (
    <section className='viewOrder-section'>
        <button onClick={()=>{history.goBack()}} className="goBack-btn"><ArrowBackIosIcon /> Back </button>
        <div className='container viewOrder-wrapper'>
            <div className='viewOrder-left'>
                <div className='viewOrder-heading'>
                    <p>Order Id: <b>#{singleUserOrder?._id}</b></p>
                </div>
                <div className='orderSuccess-products-wrapper'>
                    <h3>Order Details</h3>
                    <p>Total Amount Paid: ₹ {singleUserOrder?.grandTotal}</p>
                    <p>Order Status: {singleUserOrder?.orderStatus}</p>
                    <p>Delivery Method: {singleUserOrder?.deliveryMethod}</p>
                    <p>Email Id: {singleUserOrder?.userEmail}</p>
                    <div className='order-cart-div'>
                        <h3>Laundry Details</h3>
                        {singleUserOrder && singleUserOrder?.cart?.map((item)=>{
                            const {qty} = item
                            return(
                                <div key={item._id} className='subtotal-item'>
                                    <p>{item.serviceName && item.serviceName} . {item.catName && item.catName}</p>
                                    <div className='product-rate-div'>
                                    <h4>{item.name} * {qty}</h4>
                                    <p>₹ {item.rate * qty}</p>
                                    </div>
                                    <p>₹ {item.rate} / pc</p>
                                    
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
                    </div>
                    <div className='checkout-pickup'>
                    <h3>Address Details</h3>
                    <div className='checkout-pickup-wrapper'>
                        {singleUserOrder?.pickupDetails?.map((item, index)=>{
                            return(
                                <div key={index}>
                                    {(singleUserOrder?.orderStatus !== "delivered" && singleUserOrder?.orderStatus !== "on progress" && singleUserOrder?.orderStatus !== "completed" )&& <p><b>Pickup Date:</b> {new Date(parseInt(item.pickupDate)*1000).toLocaleDateString()}</p>}
                                    {(singleUserOrder?.orderStatus !== "delivered" && singleUserOrder?.orderStatus !== "on progress" && singleUserOrder?.orderStatus !== "completed" ) && <p><b>Pickup Time:</b> {item.pickupTime}</p>}
                                    
                                    <div className='checkout-address'>
                                        <h4>Address:</h4>
                                        <p>{item.address1}</p>
                                        <p>{item.address2}</p>
                                        <p>{item.fullAddress}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                </div>
            </div>
            <div className='viewOrder-right'>
                <div className='change-orderStatus'>
                    <h3>Change Order Status</h3>
                    <form className="form-wrapper" onSubmit={handleSubmit}>
                        <div className="form-control pizza-form-div">
                            <InputLabel id="demo-simple-select-standard-label" className="userInput">Change Order Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="stage"
                                name="stage"
                                label="Order Status"
                                value={values.stage}
                                onChange={handleChange}
                                error={errors.stage && touched.stage}
                                onBlur={handleBlur}
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {singleUserOrder?.statusArray?.map((item, index)=>{    
                                    if(item.isCompleted === "false"){
                                        return <MenuItem value={item.stage} key={index}>{item.stage}</MenuItem>
                                        }else{
                                            return null
                                        }
                                })}
                                </Select>
                                <FormHelperText>{errors.stage && touched.stage && errors.stage}</FormHelperText>
                            </div>
                            <Button className="submitBtn" variant="contained" size="medium"  type="submit">Change Status</Button>
                    </form>
                </div>
            </div>
        </div>
    </section>
  )
}

export default ViewOrders