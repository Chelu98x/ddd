import {createSlice} from "@reduxjs/toolkit";
import { STATUSES } from "../globals/mis/statuses";

const productSlice = createSlice({
    name: "product",
    initialState: {
        data: [],
        status: STATUSES.LOADING
    },
    reducers: {
        setProducts (state, action) {
            state.data = action.payload;
        },
        setStatus (state, action) {
            state.status = action.payload;
        }
    }
})



// actions
export const {setProducts, setStatus} = productSlice.actions;

// selectors
export default productSlice.reducer;