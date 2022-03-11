import React, { useState, useEffect } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useHistory } from 'react-router-dom';
import "./SchedulePickup.css"
import SubTotal from './SubTotal';
import InputLabel from '@mui/material/InputLabel';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment'
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik'
import * as yup from 'yup';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useGlobalContext } from './context';
import { useSnackbar } from 'notistack';


const validateFormSchema = yup.object({
    address1: yup.string().required('Please fill the House No / Flat Name / Room No'),
    address2: yup.string().required('Please fill the Street Name / Area Name'),
    fullAddress: yup.string().required('Please fill full address'),
})

const SchedulePickup = () => {

    const history = useHistory()

    const { enqueueSnackbar } = useSnackbar();

    const {cart, cartDispatch, pickupDetails, user, isUserAuthenticated, isUserLoggedIn} = useGlobalContext()

    useEffect(() => {
        if(!isUserAuthenticated){
            isUserLoggedIn()
        }
    }, [])

    console.log(user)

    const [dateValue, setDateValue] = useState(new Date())
    const [timeValue, setTimeValue] = useState("07:30")
    const [deliveryMethod, setDeliveryMethod] = useState([])
    const [deliverySelected, setDeliverySelected] = useState()

    const handleDateChange = (e) => {
        setDateValue(e.target.value)
    }

    const handleTimeChange = (e) => {
        setTimeValue(e.target.value)
    }

    console.log(moment(timeValue,["HH:mm"]).format("hh:mm a"))
    console.log(moment(dateValue).format('dddd, MMMM Do YYYY'))
    console.log(dateValue)

    const getDeliveryMethod = () => {
        fetch("https://laundry-node-app.herokuapp.com/services/getDeliveryMethods")
        .then((data)=> data.json())
        .then((details)=> setDeliveryMethod(details))
    }

    useEffect(()=>{
        getDeliveryMethod()
    },[])

    console.log(deliveryMethod)

    const handleDeliveryChange = (e) => {
        console.log(e.target.value)
        const data = deliveryMethod.find((item)=>{
            return item.method === e.target.value
        })
        setDeliverySelected(data)
    }

    console.log(deliverySelected)

    let deliveryDays = 0

    if(deliverySelected?.deliveryIn === "24"){
        deliveryDays = 1
    }else if(deliverySelected?.deliveryIn === "48"){
        deliveryDays = 2
    }else if(deliverySelected?.deliveryIn === "72"){
        deliveryDays = 3
    }

    console.log(deliveryDays)
    console.log(moment(dateValue).add(deliveryDays, "day").format('dddd, MMMM Do YYYY'))

    const handleDisabledBtn = (e) => {
        e.preventDefault()
        enqueueSnackbar("Login to proceed");
    }

    const {handleBlur, handleChange, handleSubmit, errors, values, touched} = useFormik(
        {
            initialValues:{address1:"", address2:"", fullAddress:""},
            validationSchema: validateFormSchema,
            onSubmit: (values) => {
                schedulePickUpFunc(values)
            }
        }
    )

    const schedulePickUpFunc = (values) => {
        console.log(JSON.stringify({...values, pickupDate: moment(dateValue).unix(), pickupTime: moment(timeValue,["HH:mm"]).format("hh:mm a"), deliveryMethod: deliverySelected, expectedDelivery: moment(dateValue).add(deliveryDays, "day").format('dddd, MMMM Do YYYY')}))

        const pickUpData = ({...values, pickupDate: moment(dateValue).unix(), pickupTime: moment(timeValue,["HH:mm"]).format("hh:mm a"), deliveryMethod: deliverySelected, expectedDelivery: moment(dateValue).add(deliveryDays, "day").format('dddd, MMMM Do YYYY')})

        cartDispatch({type:"ADD_PICKUP", payload:pickUpData})
        history.push("/checkout")
    }

    console.log(pickupDetails, "100")

  return (
    <section className='schedulePickup-section'>
        <button onClick={()=>{history.goBack()}} className="goBack-btn"><ArrowBackIosIcon /> Back </button>
        <div className='container schedulePickup-wrapper'>
            <div className='schedulePickup-left'>
                <div className='schedulePickup-heading'>
                    <h2>Schedule Pickup & Delivery</h2>
                </div>
                <form className='form-wrapper' onSubmit={handleSubmit}>
                    <div className='form-control'>
                        <h3>Pickup Date</h3>  
                        {/* <Calendar value={dateValue} minDate={new Date()} name="date" onChange={handleDateChange}/> */}
                        <div className='form-input'>
                            <TextField
                            id="date"
                            type="date"
                            sx={{ width: 220 }}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            value={dateValue} minDate={new Date()} name="date" onChange={handleDateChange}
                        />
                            <label style={{marginTop:"10px"}}>Your laundry will be picked up at:  <b className='schedulePickup-highlighter'>{moment(dateValue).format('dddd, MMMM Do YYYY')}</b></label>
                        </div>
                    </div>
                    <div className='form-control'>
                        <h3>Pickup Time</h3>
                        <TextField
                            id="time"
                            type="time"
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                            sx={{ width: 150 }}
                            value={timeValue}
                            onChange={handleTimeChange}
                        />
                    </div>
                    <h3 style={{marginBottom:"15px"}}>Pickup & Delivery Location</h3>
                    <div className='form-control'>
                        <InputLabel id="demo-simple-select-standard-label" className="userInput">Address line 1</InputLabel>
                        <TextField className="userInput" label='House No / Room No / Flat Name' placeholder='Enter House No / Flat Name / Room No' id="address1" name="address1" value={values.address1} error={errors.address1 && touched.address1} helperText={errors.address1 && touched.address1 && errors.address1} onChange={handleChange} onBlur={handleBlur}  multiline variant="standard" />
                    </div>
                    <div className='form-control'>
                        <InputLabel id="demo-simple-select-standard-label" className="userInput">Address line 2</InputLabel>
                        <TextField className="userInput" label='Street Name / Area Name' placeholder='Enter Street Name / Area Name' id="address2" name="address2" value={values.address2} error={errors.address2 && touched.address2} helperText={errors.address2 && touched.address2 && errors.address2} onChange={handleChange} onBlur={handleBlur}  multiline variant="standard" />
                    </div>
                    <div className='form-control' style={{display:"flex",flexDirection:"column"}}>
                        <InputLabel id="demo-simple-select-standard-label" className="userInput">Full Address</InputLabel>
                        <TextareaAutosize
                            aria-label="empty textarea"
                            placeholder="Enter Full Address"
                            className="userInput"
                            minRows={5}
                            id="fullAddress" name="fullAddress" value={values.fullAddress} error={errors.fullAddress && touched.fullAddress} helperText={errors.fullAddress && touched.fullAddress && errors.fullAddress} onChange={handleChange} onBlur={handleBlur}
                            />
                        <p style={{color:"#d32f2f"}}>{errors.fullAddress && touched.fullAddress && errors.fullAddress}</p>
                    </div>
                    <div className='form-control'>
                        <h3>Type of Delivery Methods</h3>
                        {deliveryMethod.map((item)=>{
                            return(
                                <div key={item._id} className="delivery-methods">
                                      <input type="radio" id={item.method} name="deliveryMethod" value={item.method} onChange={handleDeliveryChange} />
                                      <label for={item.method}><b className='schedulePickup-highlighter'>{item.method}</b></label>
                                      <p>delivery within <b className='schedulePickup-highlighter'>{item.deliveryIn} hrs</b></p>
                                      <p>delivery charges: <b className='schedulePickup-highlighter'>₹ {item.rate}</b></p>
                                </div>
                            )
                        })}
                    </div>
                    <div className='expected-delivery'>
                        {deliveryDays !== 0 && (
                            <div>
                                <p>Expected Delivery:</p>
                                <p><b className='schedulePickup-highlighter'>{moment(dateValue).add(deliveryDays, "day").format('dddd, MMMM Do YYYY')}</b></p>
                            </div>
                        )}
                    </div>
                    <div className='form-control'>
                        {isUserAuthenticated && <button className='pickupBtn'><ShoppingBagOutlinedIcon /> Proceed to Checkout</button>}
                    </div>
                </form>
                {!isUserAuthenticated && <button onClick={(e)=>{handleDisabledBtn(e)}} className='pickupBtn disabledPickupBtn'><ShoppingBagOutlinedIcon /> Proceed to Checkout</button>}
            </div>
            <div className='schedulePickup-right'>
                <div className='subtotal-div'>
                    
                </div>
            </div>
        </div>
    </section>
  )
}

export default SchedulePickup