import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import { useGlobalContext } from './context';
import "./UserLogin.css"

const UserLogin = () => {

    const [singleUser,setSingleUser] = useState({email:'',password:''})

    const {user, isUserAuthenticated, isUserLoggedIn, userDispatch} = useGlobalContext()

    useEffect(() => {
        if(!isUserAuthenticated){
            isUserLoggedIn()
        }
    }, [])

    const history = useHistory()

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setSingleUser({...singleUser, [name]:value})
    }

    const setUser = (userFromDB) => {
    userDispatch({type:"SET_USER", payload:{userFromDB}})
    }

    const handleLogin = async() => {
        try{
            const resp = await fetch('https://laundry-node-app.herokuapp.com/laundry/user/login', {
            method:'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(singleUser)
                })

        const data = await resp.json()
        
        setSingleUser(data.userFromDB.username)
        console.log(singleUser)
        console.log(data)

        if(resp.ok){
            const {userFromDB} = data
            console.log(userFromDB)
            localStorage.setItem("usertoken", JSON.stringify(data.userFromDB.token))
            localStorage.setItem("user", JSON.stringify(data.userFromDB))
            setUser(userFromDB)
            history.push("/")
            setSingleUser({email:'',password:''})
            console.log("login success")
        }else{
            throw new Error(data.msg)
        }

        }

        catch(error){
            console.warn(error.toString())
        }
    }

    console.log(user)

  return (
    <section className='userLogin-section'>
        <div className='container userLogin-wrapper'>
            <Card className="form-card">
                <CardContent className="form-cardContent">
                    <h3>User Login</h3>
                    <form className="form-wrapper">
                        <div className='form-control'>
                            <TextField className="userInput" type="email" placeholder="enter your email address" value={singleUser.email} onChange={handleChange} id="email" name="email" multiline variant="standard" />
                        </div>
                        <div className='form-control'>
                            <TextField className="userInput" type="password" placeholder="enter your password" value={singleUser.password} onChange={handleChange} id="password" name="password" multiline variant="standard" />
                        </div>
                        <Button className="submitBtn" variant="contained" size="medium" onClick={handleLogin}>login</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </section>
  )
}

export default UserLogin