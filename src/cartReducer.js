export const cartReducer = (state,action) => {
    
    switch(action.type){

        case 'ADD_TO_CART':
            console.log(action.payload)
            console.log(action.payload._id)
            console.log(state.cart)
            const isInCart = state.cart.find((item) => {
        return item._id === action.payload._id ? true : false
            });
            console.log(isInCart)
            return{
                ...state,
                cart: isInCart ? state.cart.map((item)=>{
                    
                        if(item._id === action.payload._id){
                            return(
                                {
                                    ...item,
                                    qty:item.qty+1,
                                }
                            )
                        }else{
                            return item
                        }
                    
                }) : [...state.cart,{...action.payload, qty:1}]
            }

        case 'REMOVE_FROM_CART':
            const index = state.cart.findIndex((item)=>{
                return item._id === action.payload
            })

            let newCartValue = [...state.cart]

            if(index >= 0){
                newCartValue.splice(index,1)
            }
            else{
                console.log('The item is not found')
            }
            return {
                ...state,
                cart:newCartValue
            }

        case 'ADJUST_QTY':
            return{
                ...state,
                cart: state.cart.map((item)=>{
                    if(item._id === action.payload.id){
                        return(
                            {
                                ...item,
                                qty:action.payload.qty
                            }
                        )
                    }else{
                        return item
                    }
                })
            }
        
        case "ADD_PICKUP":
            console.log(action.payload)
        return {
            ...state,
            pickupDetails: [action.payload]
        }

        case "CLEAR_CART":
            return{
                ...state,
                cart:[],
                pickupDetails:[]
            }


        default:
            return state
    }
}