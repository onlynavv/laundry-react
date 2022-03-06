import React,{useState, useEffect} from 'react'
import "./Categories.css"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useGlobalContext } from './context';
import { useHistory, useParams } from 'react-router-dom';

const Categories = () => {

    const {user, isUserAuthenticated, isUserLoggedIn} = useGlobalContext()

    const history = useHistory()

    const {id} = useParams()

    useEffect(() => {
        if(!isUserAuthenticated){
            isUserLoggedIn()
        }
    }, [])

    const [categories, setCategories] = useState([])

    const adminGetCategories = () => {
        fetch(`https://laundry-node-app.herokuapp.com/services/adminGetAllCategoriesForService/${id}`, {
            method:'GET',
            headers: { "Content-Type": "application/json", "x-auth-token":user.token}
                })
        .then((data)=> data.json())
        .then((details)=> setCategories(details))
    }

    useEffect(()=>{
        adminGetCategories()
    },[user])

    console.log(categories, "categories")

  return (
    <section className='categories-section'>
        <button onClick={()=>{history.goBack()}} className="goBack-btn"><ArrowBackIosIcon /> Back </button>
        <div className='container categories-wrapper'>
            <div className='products-heading'>
                <h1>Products</h1>
            </div>
            <div className='prodCat-heading'>
                <h3>categories . {categories.length > 0 && categories[0].serviceName}</h3>
            </div>
            <div className='categories-div'>
                {categories.map((item)=>{
                    return(
                        <div key={item._id} className="single-services-div">
                            <p>{item.name}</p>
                            <button className="view-details" onClick={()=>{history.push(`/products/${item._id}`)}}>view products</button>
                        </div>
                    )
                })}
            </div>
        </div>
    </section>
  )
}

export default Categories