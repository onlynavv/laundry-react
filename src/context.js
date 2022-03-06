import React , {useContext,useReducer} from 'react'
import { cartInitialState } from './cartInitialState'
import { cartReducer } from './cartReducer'
import { UserInitialState } from './UserInitialState'
import { UserReducer } from './UserReducer'

const AppContext = React.createContext()

const AppProvider = ({children}) => {

    // user actions

    const isUserLoggedIn = () => {
        const token = JSON.parse(localStorage.getItem("usertoken"))
        if(token){
            const userFromDB = JSON.parse(localStorage.getItem("user"))
            userDispatch({type:"SET_USER", payload:{userFromDB}})
        }
    }

    // cart useReducer
    const [cartState, cartDispatch] = useReducer(cartReducer, cartInitialState)

    // user useReducer
    const [userState, userDispatch] = useReducer(UserReducer, UserInitialState)

    return(
        <AppContext.Provider value={{...cartState, cartDispatch, ...userState, userDispatch, isUserLoggedIn}}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export {AppProvider}