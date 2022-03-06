import React, { useEffect, useState } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useHistory } from 'react-router-dom';
import { useGlobalContext } from './context';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import "./Orders.css"

const Orders = () => {

    const history = useHistory()

    const {user, isUserAuthenticated, isUserLoggedIn} = useGlobalContext()

    useEffect(() => {
        if(!isUserAuthenticated){
            isUserLoggedIn()
        }
    }, [])

    const [userNewOrders, setNewOrders] = useState([])
    const [userOnProgressOrders, setUserOnProgressOrders] = useState([])
    const [userCompletedOrders, setUserCompletedOrders] = useState([])
    const [tabValue, setTabValue] = useState("1")

    const handleTabChange = (event, newValue) => {
      setTabValue(newValue)
    }

    const getAdminNewOrders = async() => {
        fetch("https://laundry-node-app.herokuapp.com/laundry/order/adminGetNewOrders", {
            method:'GET',
            headers: { "Content-Type": "application/json", "x-auth-token":user.token}
                })
        .then((data)=> data.json())
        .then((details)=> setNewOrders(details))
    }

    useEffect(()=>{
        getAdminNewOrders()
    }, [user])

    console.log(userNewOrders, "39")

    const getAdminOnProgressOrders = async() => {
        fetch("https://laundry-node-app.herokuapp.com/laundry/order/adminGetOnProgressOrders", {
            method:'GET',
            headers: { "Content-Type": "application/json", "x-auth-token":user.token}
                })
        .then((data)=> data.json())
        .then((details)=> setUserOnProgressOrders(details))
    }

    useEffect(()=>{
        getAdminOnProgressOrders()
    }, [user])

    console.log(userOnProgressOrders, "54")

    const getAdminCompletedOrders = async() => {
        fetch("https://laundry-node-app.herokuapp.com/laundry/order/adminGetCompletedOrders", {
            method:'GET',
            headers: { "Content-Type": "application/json", "x-auth-token":user.token}
                })
        .then((data)=> data.json())
        .then((details)=> setUserCompletedOrders(details))
    }

    useEffect(()=>{
        getAdminCompletedOrders()
    }, [user])

    console.log(userCompletedOrders, "70")

  return (
    <section className='orders-section'>
        <button onClick={()=>{history.goBack()}} className="goBack-btn"><ArrowBackIosIcon /> Back </button>
        <div className='container orders-wrapper'>
            <div className='mylaundry-heading'>
                <h2>Orders</h2>
            </div>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tabValue}>
                    <Box>
                        <TabList onChange={handleTabChange} aria-label="lab API tabs example" centered>
                            <Tab label="New Orders" value="1" />
                            <Tab label="On Pregress" value="2" />
                            <Tab label="Completed" value="3" />
                        </TabList>
                    </Box>        
                    <TabPanel value="1">
                        <h3>New Orders</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order Id</th>
                                        <th>Email</th>
                                        <th>Pickup Date</th>
                                        <th>Pickup Time</th>
                                        <th>Ordered At</th>
                                        <th>Status</th>
                                        <th>Delivery Method</th>
                                        <th>Total</th>
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userNewOrders?.length > 0 && userNewOrders.map((item)=>{
                                        const {userEmail, pickupDate, orderedAt, orderStatus, grandTotal, deliveryMethod, pickupDetails} = item
                                        const {pickupTime} = pickupDetails[0]
                                        const newPickupDate = new Date(pickupDate)
                                        const newOrderedAt = new Date(orderedAt)
                                        return(
                                            <tr key={item._id}>
                                                <td>#{item._id}</td>
                                                <td>{userEmail}</td>
                                                <td>{newPickupDate.toLocaleDateString()}</td>
                                                <td>{pickupTime}</td>
                                                <td>{newOrderedAt.toLocaleDateString()}</td>
                                                <td>{orderStatus}</td>
                                                <td>{deliveryMethod}</td>
                                                <td>₹ {grandTotal}</td>
                                                <td><button onClick={()=>{history.push(`/viewOrder/${item._id}`)}}>View Order</button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                    </TabPanel>
                    <TabPanel value="2">
                        <h3>On Progress</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order Id</th>
                                        <th>Email</th>
                                        <th>Pickup Date</th>
                                        <th>Pickup Time</th>
                                        <th>Ordered At</th>
                                        <th>Status</th>
                                        <th>Delivery Method</th>
                                        <th>Total</th>
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userOnProgressOrders?.length > 0 && userOnProgressOrders.map((item)=>{
                                        const {userEmail, pickupDate, orderedAt, orderStatus, grandTotal, deliveryMethod, pickupDetails} = item
                                        const {pickupTime} = pickupDetails[0]
                                        const newPickupDate = new Date(pickupDate)
                                        const newOrderedAt = new Date(orderedAt)
                                        return(
                                            <tr key={item._id}>
                                                <td>#{item._id}</td>
                                                <td>{userEmail}</td>
                                                <td>{newPickupDate.toLocaleDateString()}</td>
                                                <td>{pickupTime}</td>
                                                <td>{newOrderedAt.toLocaleDateString()}</td>
                                                <td>{orderStatus}</td>
                                                <td>{deliveryMethod}</td>
                                                <td>₹ {grandTotal}</td>
                                                <td><button onClick={()=>{history.push(`/viewOrder/${item._id}`)}}>View Order</button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                    </TabPanel>
                    <TabPanel value="3">
                        <h3>Completed</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order Id</th>
                                        <th>Email</th>
                                        <th>Pickup Date</th>
                                        <th>Pickup Time</th>
                                        <th>Ordered At</th>
                                        <th>Status</th>
                                        <th>Delivery Method</th>
                                        <th>Total</th>
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userCompletedOrders?.length > 0 && userCompletedOrders.map((item)=>{
                                        const {userEmail, pickupDate, orderedAt, orderStatus, grandTotal, deliveryMethod, pickupDetails} = item
                                        const {pickupTime} = pickupDetails[0]
                                        const newPickupDate = new Date(pickupDate)
                                        const newOrderedAt = new Date(orderedAt)
                                        return(
                                            <tr key={item._id}>
                                                <td>#{item._id}</td>
                                                <td>{userEmail}</td>
                                                <td>{newPickupDate.toLocaleDateString()}</td>
                                                <td>{pickupTime}</td>
                                                <td>{newOrderedAt.toLocaleDateString()}</td>
                                                <td>{orderStatus}</td>
                                                <td>{deliveryMethod}</td>
                                                <td>₹ {grandTotal}</td>
                                                <td><button onClick={()=>{history.push(`/viewOrder/${item._id}`)}}>View Order</button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                    </TabPanel>    
                </TabContext>
            </Box>
        </div>
    </section>
  )
}

export default Orders