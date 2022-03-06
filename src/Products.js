import React,{useState, useEffect} from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useGlobalContext } from './context';
import { useHistory, useParams } from 'react-router-dom';
import "./Products.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Products = () => {

  const {user, isUserAuthenticated, isUserLoggedIn} = useGlobalContext()

  const history = useHistory()

  const {id} = useParams()

  useEffect(() => {
      if(!isUserAuthenticated){
          isUserLoggedIn()
      }
  }, [])

  const [products, setProducts] = useState([])
  const [singleProduct,setSingleProduct] = useState({name:'',rate:''})

  const adminGetProducts = () => {
      fetch(`https://laundry-node-app.herokuapp.com/services/adminGetAllProductsForCategory/${id}`, {
          method:'GET',
          headers: { "Content-Type": "application/json", "x-auth-token":user.token}
              })
      .then((data)=> data.json())
      .then((details)=> setProducts(details))
  }

  useEffect(()=>{
      adminGetProducts()
  },[user])

  console.log(products, "products")

  const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setSingleProduct({...singleProduct, [name]:value})
    }

    const handleAddProduct = async() => {
        try{
            const resp = await fetch('https://laundry-node-app.herokuapp.com/services/addProducts', {
            method:'POST',
            headers: { "Content-Type": "application/json", "x-auth-token":user.token},
            body: JSON.stringify({...singleProduct, catId: products.length > 0 && products[0].catId, catName: products.length > 0 && products[0].catName, serviceId: products.length > 0 && products[0].serviceId, serviceName: products.length > 0 && products[0].serviceName})
                })

        const data = await resp.json()

        if(resp.ok){
            adminGetProducts()
            setSingleProduct({name:'',rate:''})
        }else{
            throw new Error(data.msg)
        }

        }

        catch(error){
            console.warn(error.toString())
        }
    }

    const handleDeleteProduct = async(prodId) => {
        try{
            const resp = await fetch(`https://laundry-node-app.herokuapp.com/services/adminDeleteProduct/${prodId}`, {
            method:'DELETE',
            headers: { "Content-Type": "application/json", "x-auth-token":user.token}
                })

        const data = await resp.json()

        if(resp.ok){
            adminGetProducts()
            setSingleProduct({name:'',rate:''})
        }else{
            throw new Error(data.msg)
        }

        }

        catch(error){
            console.warn(error.toString())
        }
    }

  return (
    <section className='products-section'>
      <button onClick={()=>{history.goBack()}} className="goBack-btn"><ArrowBackIosIcon /> Back </button>
      <div className='container products-wrapper'>
            <div className='products-heading'>
                <h1>Products</h1>
            </div>
            <div className='prodCat-heading'>
                <h3>{products.length > 0 && products[0].serviceName} . {products.length > 0 && products[0].catName} . Products</h3>
            </div>
            <div className='addProducts'>
              <Card className="form-card add-formCard">
                  <CardContent className="form-cardContent">
                      <h3>Add Product</h3>
                      <form className="form-wrapper">
                          <div className='form-control'>
                              <TextField className="userInput" type="name" placeholder="enter your name address" value={singleProduct.name} onChange={handleChange} id="name" name="name" multiline variant="standard" />
                          </div>
                          <div className='form-control'>
                              <TextField className="userInput" type="rate" placeholder="enter your rate" value={singleProduct.rate} onChange={handleChange} id="rate" name="rate" multiline variant="standard" />
                          </div>
                          <Button className="submitBtn" variant="contained" size="medium" onClick={handleAddProduct}>Add</Button>
                      </form>
                  </CardContent>
              </Card>
            </div>
            <div className='products-div'>
                <h3>Products List</h3>
                <div className="single-services-div">
                  <p className='prod-name'>Name</p>
                  <p className='prod-rate'>₹ Rate</p>
                  <div className='action-div'>
                      <p>Actions</p>
                  </div>
                </div>
                {products.map((item)=>{
                    return(
                        <div key={item._id} className="single-services-div">
                            <p className='prod-name'>{item.name}</p>
                            <p className='prod-rate'>₹ {item.rate}</p>
                            <div className='action-div'>
                              <button className="edit-prod" onClick={()=>{history.push(`/editProducts/${item._id}`)}}>Edit</button>
                              <button className='delete-prod' onClick={()=>{handleDeleteProduct(item._id)}}>Delete</button>
                            </div>
                        </div>
                    )
                })}
            </div>
      </div>
    </section>
  )
}

export default Products