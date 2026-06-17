import { createSlice } from "@reduxjs/toolkit";

interface IIniatialState {
    isOpen : boolean 
}

const initialState : IIniatialState = {
    isOpen : true
}

export const asideSlice = createSlice({
    name: "aside",
    initialState,
    reducers: {
        toggleAside: (state) => {
            state.isOpen = !state.isOpen;
        }
    }
})

export const { toggleAside } = asideSlice.actions;
export default asideSlice.reducer;