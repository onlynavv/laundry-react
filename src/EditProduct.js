import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useHistory, useParams } from 'react-router-dom';
import { useGlobalContext } from './context';
import "./EditProduct.css"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const EditProduct = () => {

    const {id} = useParams()

    const [singleProduct,setSingleProduct] = useState({name:'',rate:''})

    const {user, isUserAuthenticated, isUserLoggedIn} = useGlobalContext()

    useEffect(() => {
        if(!isUserAuthenticated){
            isUserLoggedIn()
        }
    }, [])

    const history = useHistory()

    const adminGetSingleProduct = () => {
      fetch(`https://laundry-node-app.herokuapp.com/services/adminGetProductById/${id}`, {
          method:'GET',
          headers: { "Content-Type": "application/json", "x-auth-token":user.token}
              })
      .then((data)=> data.json())
      .then((details)=> setSingleProduct(details))
    }

    useEffect(()=>{
          adminGetSingleProduct()
    },[user])

    console.log(singleProduct, "singleProduct")

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setSingleProduct({...singleProduct, [name]:value})
    }

    const handleEditProduct = async() => {
        try{
            const resp = await fetch(`https://laundry-node-app.herokuapp.com/services/adminUpdateProductById/${id}`, {
            method:'PUT',
            headers: { "Content-Type": "application/json", "x-auth-token":user.token},
            body: JSON.stringify(singleProduct)
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

    console.log(user)


  return (
    <section className='editProduct-section'>
        <button onClick={()=>{history.goBack()}} className="goBack-btn"><ArrowBackIosIcon /> Back </button>
        <div className='container editProduct-wrapper'>
            <Card className="form-card">
                <CardContent className="form-cardContent">
                    <h3>Edit Products</h3>
                    <div className='prodCat-heading'>
                        {singleProduct && <p>{singleProduct.serviceName} . {singleProduct.catName} . {singleProduct.name}</p>}
                    </div>
                    <form className="form-wrapper">
                        <div className='form-control'>
                            <TextField className="userInput" type="name" placeholder="enter your name address" value={singleProduct.name} onChange={handleChange} id="name" name="name" multiline variant="standard" />
                        </div>
                        <div className='form-control'>
                            <TextField className="userInput" type="rate" placeholder="enter your rate" value={singleProduct.rate} onChange={handleChange} id="rate" name="rate" multiline variant="standard" />
                        </div>
                        <Button className="submitBtn" variant="contained" size="medium" onClick={handleEditProduct}>Edit</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </section>
  )
}

export default EditProduct