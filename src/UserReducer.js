export const UserReducer = (state, action) => {
    switch(action.type){
        case "SET_USER":
            return {...state, user:action.payload.userFromDB, isUserAuthenticated:true}
        
        case "LOGOUT_USER":
            return{
                ...state, user:"", isUserAuthenticated:false
            }
    
        default:
            return state
    }
}