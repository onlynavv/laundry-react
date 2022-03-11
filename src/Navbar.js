import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom';
import { useGlobalContext } from './context';
import './Navbar.css'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

const Navbar = () => {

    const history = useHistory()

    const [cartCount,setCartCount] = useState(0)

    const {user, cart, isUserAuthenticated, userDispatch} = useGlobalContext()

    const userLogout = () => {
        localStorage.clear()
        userDispatch({type:"LOGOUT_USER"})
        history.push("/")
    }

    console.log(user)

    useEffect(()=>{
        let count = 0
        cart.forEach(item => {
         count = count + parseInt(item.qty)
        });

        setCartCount(count)
    },[cart,cartCount])
    
  return (
            <nav className='navbar'>
                <div className='nav-center'>
                    <h3 onClick={()=>{history.push('/')}} className="logo">Laundry Clean</h3>
                    <div className='nav-container'>
                        <Link to='/'>Home</Link>
                        {(!user || !isUserAuthenticated) && <Link to="/register">User Register</Link>}
                        {isUserAuthenticated ? <p onClick={userLogout}>User Logout</p> : <Link to="/login">User Login</Link>}
                        <Link to="/myLaundry">My Laundry</Link>
                        {user.role === "admin" && <Link to="/services">Products</Link>}
                        {user.role === "admin" && <Link to="/orders">Orders</Link>}
                        <Link to="/cart" className='navbar-cart'><ShoppingBagOutlinedIcon /> {cartCount}</Link>
                    </div>
                </div>
            </nav>
  )
}

export default Navbar