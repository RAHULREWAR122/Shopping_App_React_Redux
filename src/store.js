import { configureStore } from "@reduxjs/toolkit";
import { cartReducerSlice } from "./Reducers/cart/CartReducer";
import { ordersSliceReducers } from "./Reducers/Orders/OrderReducer";
import { authReducer } from "./Reducers/Auth/auth";
export const store = configureStore({
    reducer :{
         cartReducerSlice,
         ordersSliceReducers,
         authReducer,
    },
    
})