import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../mis/statuses";
import { API } from "../http";

const DEMO_PRODUCTS = [
    {
        _id: "demo-buff-momos",
        productName: "Buff Momos",
        productDescription: "Soft steamed momos filled with juicy buffalo meat and served with spicy achar.",
        productStatus: "in-stock",
        productStockQty: 20,
        productPrice: 180,
        productImageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80"
    },
    {
        _id: "demo-chilli-momos",
        productName: "Chilli Momos",
        productDescription: "Crispy fried momos tossed in a bold chilli garlic sauce with a smoky finish.",
        productStatus: "in-stock",
        productStockQty: 15,
        productPrice: 220,
        productImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
    },
    {
        _id: "demo-pizza",
        productName: "Pizza",
        productDescription: "Classic cheesy pizza with tomato sauce, mozzarella, and freshly baked crust.",
        productStatus: "in-stock",
        productStockQty: 12,
        productPrice: 450,
        productImageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80"
    }
];

const productSlice = createSlice({
    name: "product",
    initialState: {
        data: DEMO_PRODUCTS,
        status: STATUSES.SUCCESS,
        selectedProduct: DEMO_PRODUCTS[0]
    },
    reducers: {
        setProducts(state, action) {
            state.data = action.payload || [];
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        setSelectedProduct(state, action) {
            state.selectedProduct = action.payload;
        }
    }
});

export const { setProducts, setStatus, setSelectedProduct } = productSlice.actions;

export default productSlice.reducer;

export function fetchAllProducts() {
    return async function fetchAllProductsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const res = await API.get("/globals/products");
            const products = res.data.data && res.data.data.length ? res.data.data : DEMO_PRODUCTS;
            dispatch(setProducts(products));
            dispatch(setStatus(STATUSES.SUCCESS));
            return products;
        } catch (error) {
            dispatch(setProducts(DEMO_PRODUCTS));
            dispatch(setStatus(STATUSES.SUCCESS));
            console.log(error);
            return DEMO_PRODUCTS;
        }
    };
}

export function fetchProducts(productId) {
    return async function fetchProductThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const res = await API.get(`/globals/products/${productId}`);
            const product = res.data.data || DEMO_PRODUCTS.find((item) => item._id === productId) || DEMO_PRODUCTS[0];
            dispatch(setSelectedProduct(product));
            dispatch(setStatus(STATUSES.SUCCESS));
            return product;
        } catch (error) {
            const fallbackProduct = DEMO_PRODUCTS.find((item) => item._id === productId) || DEMO_PRODUCTS[0];
            dispatch(setSelectedProduct(fallbackProduct));
            dispatch(setStatus(STATUSES.SUCCESS));
            console.log(error);
            return fallbackProduct;
        }
    };
}