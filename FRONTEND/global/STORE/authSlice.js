import {createSlice} from '@reduxjs/toolkit'
import { STATUSES } from '../globals/mis/statuses'  
import axios from 'axios';



const authSlice = createSlice ({
    name: 'auth',
    initialState: {
        user: null,
        staus: STATUSES.SUCESS,
        token: null
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        setToken(state, action) {
            state.token = action.payload;
        }
    }
})

export const {setUser, setStatus, setToken} = authSlice.actions;


// Thunks to handle async actions


export function registerUser(userData) {
    return async function registerUserThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
            try{
                const response = await axios.post('http://localhost:5000/api/register', userData);
                dispatch(setUser(response.data.user));
                dispatch(setStatus(STATUSES.SUCESS));
            } catch (error) {
                dispatch(setStatus(STATUSES.ERROR));
            }
    }
}

// login user thunk


export function loginUser(credentials) {
    return async function loginUserThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await axios.post('http://localhost:5000/api/login', credentials);
            dispatch(setUser(response.data.user));
            dispatch(setToken(response.data.token));
            dispatch(setStatus(STATUSES.SUCESS));
        } catch (error) {
            dispatch(setStatus(STATUSES.ERROR));
            console.log(error);
        }
    }
}

export default authSlice.reducer;