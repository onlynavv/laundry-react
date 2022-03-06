import React,{useState, useEffect} from 'react'
import { useGlobalContext } from './context'
import "./LaundryHome.css"
import ServiceCard from './ServiceCard'

const LaundryHome = () => {

    const [laundryServices, setLaundryServices] = useState([])

    const {user, isUserAuthenticated, isUserLoggedIn} = useGlobalContext()

    useEffect(() => {
        if(!isUserAuthenticated){
            isUserLoggedIn()
        }
    }, [])

    console.log(user)

    const getLaundryServices = () => {
        fetch("https://laundry-node-app.herokuapp.com/services/getAllServices")
        .then((data)=> data.json())
        .then((services)=> setLaundryServices(services))
    }

    useEffect(()=>{
        getLaundryServices()
    },[])

    console.log(laundryServices)

  return (
    <section className='laundryhome-section'>
        <div className='container laundryhome-wrapper'>
            {laundryServices?.map((item)=>{
                const {_id} = item
                return <ServiceCard key={_id} {...item} />
            })}
        </div>
    </section>
  )
}

export default LaundryHome