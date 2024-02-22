import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  collection,
} from "firebase/firestore";

import { db } from "../../firebase/auth";

// Initial state for orders slice
const initialState = {
  orderItems: [], // Array to store order items
  msg: "", // Message for asynchronous operations
};

// Thunk action creator to add order
export const addOrdersThunk = createAsyncThunk(
  "orders/add",
  async (item, thunkApi) => {
    try {
      const fetchOrdersData = thunkApi.dispatch(fetchOrdersThunk());
      const newData = (await fetchOrdersData).payload;

      const findId = newData.find((items) => items.newId === item.newId);

      if (!findId) {
        await addDoc(collection(db, "Orders1"), {
          newId: item.newId,
          title: item.title,
          img: item.img,
          price: item.price,
          quantity: item.quantity,
        });
        return item;
      } else {
        return item;
      }
    } catch (err) {
      console.log("error in add Item", err);
    }
  }
);

// Thunk action creator to fetch orders
export const fetchOrdersThunk = createAsyncThunk(
  "orders/fetch",
  async (_, thunkApi) => {
    try {
      const querySnapshot = await getDocs(collection(db, "Orders1"));
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders;
    } catch (err) {
      console.log("error in order items fetch", err);
    }
  }
);

// Thunk action creator to remove order
export const removeOrderThunk = createAsyncThunk(
  "orders/remove",
  async (itemId, thunkApi) => {
    try {
      await deleteDoc(doc(db, "Orders1", itemId));
      return itemId;
    } catch (err) {
      console.log("error in remove order", err);
    }
  }
);

// Creating orders slice
const ordersSlice = createSlice({
  name: "orders",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addOrdersThunk.fulfilled, (state, action) => {
        state.orderItems.push(action.payload);
        state.msg = "";
      })
      .addCase(addOrdersThunk.pending, (state, action) => {
        state.msg = "pending";
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.orderItems = action.payload;
        state.msg = "";
      })
      .addCase(fetchOrdersThunk.pending, (state, action) => {
        state.msg = "pending";
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.msg = action.error.message;
      })
      .addCase(removeOrderThunk.fulfilled, (state, action) => {
        state.orderItems = state.orderItems.filter(
          (item) => item.id !== action.payload
        );
        state.msg = "";
      })
      .addCase(removeOrderThunk.pending, (state, action) => {
        state.msg = "pending";
      });
  },
});

// Exporting reducer and selector
export const ordersSliceReducers = ordersSlice.reducer;
export const ordersSelector = (state) => state.ordersSliceReducers;
