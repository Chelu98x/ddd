import {configurestore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import productSlice from './productSlice'
import cartSlice from './cartSlice'

const store = configurestore({
    reducer: {
        auth: authSlice,
        products: productSlice,
        cart: cartSlice
    }
})

export default store