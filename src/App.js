import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Cart from "./Cart";
import CheckoutPage from "./CheckoutPage";
import Error from "./Error";
import LaundryHome from "./LaundryHome";
import MyLaundry from "./MyLaundry";
import Navbar from "./Navbar";
import OrderDetails from "./OrderDetails";
import OrderSuccessPage from "./OrderSuccessPage";
import Services from "./Services";
import SchedulePickup from "./SchedulePickup";
import SingleService from "./SingleService";
import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";
import Categories from "./Categories";
import Products from "./Products";
import EditProduct from "./EditProduct";
import Orders from "./Orders";
import ViewOrders from "./ViewOrders";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <LaundryHome />
          </Route>
          <Route path="/singleService/:id">
            <SingleService />
          </Route>
          <Route path="/schedulePickup">
            <SchedulePickup />
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="/register">
            <UserRegister />
          </Route>
          <Route path="/login">
            <UserLogin />
          </Route>
          <Route path="/checkout">
            <CheckoutPage />
          </Route>
          <Route path="/services">
            <Services />
          </Route>
          <Route path="/categories/:id">
            <Categories />
          </Route>
          <Route path="/products/:id">
            <Products />
          </Route>
          <Route path="/editProducts/:id">
            <EditProduct />
          </Route>
          <Route path="/orderSuccess/:id">
            <OrderSuccessPage />
          </Route>
          <Route path="/myLaundry">
            <MyLaundry />
          </Route>
          <Route path="/orders">
            <Orders />
          </Route>
          <Route path="/viewOrder/:id">
            <ViewOrders />
          </Route>
          <Route path="/orderDetails/:id">
            <OrderDetails />
          </Route>
          <Route path='**'>
            <Error />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
