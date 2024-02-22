import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/auth";

// Initial state for cart slice
const initialState = {
  cartItems: [], // Array to store cart items
  msg: "", // Message for asynchronous operations
  total: 0, // Total price of cart items
};

// Thunk action creator to add item to cart
export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async (item, thunkApi) => {
    try {
      const fetchCartData = thunkApi.dispatch(fetchCartitemsThunk());
      const newData = (await fetchCartData).payload;

      const findId = newData.find((items) => items.newId === item.newId);

      if (!findId) {
        await addDoc(collection(db, "Cart1"), {
          newId: item.newId,
          title: item.title,
          img: item.img,
          price: item.price,
          quantity: 1,
        });
        return item;
      } else {
        return item;
      }
    } catch (err) {
      console.log("error in add item ", err);
    }
  }
);

// Thunk action creator to fetch cart items
export const fetchCartitemsThunk = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkApi) => {
    try {
      const querySnapshot = await getDocs(collection(db, "Cart1"));
      const cart = [];
      querySnapshot.forEach((doc) => {
        cart.push({ id: doc.id, ...doc.data() });
      });
      return cart;
    } catch (err) {
      console.log("error in cart items fetch", err);
    }
  }
);

// Thunk action creator to calculate total price of cart items
export const totalThunk = createAsyncThunk(
  "cart/total",
  async (_, thunkApi) => {
    try {
      const cartItems = await getDocs(collection(db, "Cart1"));
      let total = 0;
      cartItems.forEach((item) => {
        const data = item.data();
        total += data.quantity * data.price;
      });
      return total;
    } catch (err) {
      console.log("error in fetchTotal", err);
    }
  }
);

// Thunk action creator to remove item from cart
export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async (itemId, thunkAPI) => {
    try {
      await deleteDoc(doc(db, "Cart1", itemId));
      return itemId;
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  }
);

// Thunk action creator to increase quantity of an item in cart
export const increaseCartCount = createAsyncThunk(
  "cart/increase",
  async (itemId, thunkApi) => {
    try {
      const cartItems = thunkApi.getState().cartReducerSlice.cartItems;
      const itemToUpdate = cartItems.find((item) => item.id === itemId);
      if (itemToUpdate) {
        await updateDoc(doc(db, "Cart1", itemId), {
          quantity: itemToUpdate.quantity + 1,
        });
        return itemId;
      }
    } catch (err) {
      console.log("error in increasing quantity ", err);
    }
  }
);

// Thunk action creator to decrease quantity of an item in cart
export const decreaseCartCount = createAsyncThunk(
  "cart/decrease",
  async (itemId, thunkApi) => {
    try {
      const cartItems = thunkApi.getState().cartReducerSlice.cartItems;
      const itemToUpdate = cartItems.find((item) => item.id === itemId);
      if (itemToUpdate) {
        const newQuantity = itemToUpdate.quantity - 1;
        if (newQuantity < 1) {
          await deleteDoc(doc(db, "Cart1", itemId));
        } else {
          await updateDoc(doc(db, "Cart1", itemId), {
            quantity: itemToUpdate.quantity - 1,
          });
        }
        return itemId;
      }
    } catch (err) {
      console.log("error in decreasing quantity ", err);
    }
  }
);

// Creating cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    // Reducer function to increase quantity of an item
    increaseQuantity(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.itemId
      );
      if (itemIndex !== -1) {
        state.cartItems[itemIndex].quantity++;
      }
    },
    // Reducer function to decrease quantity of an item
    decreaseQuantity(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.itemId
      );
      if (itemIndex !== -1 && state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity--;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.cartItems.push(action.payload);
        state.msg = "";
      })
      .addCase(addToCartThunk.pending, (state, action) => {
        state.msg = "pending";
      })
      .addCase(fetchCartitemsThunk.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.msg = "";
      })
      .addCase(fetchCartitemsThunk.pending, (state, action) => {
        state.msg = "pending";
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload
        );
        state.msg = "";
      })
      .addCase(removeCartItem.pending, (state, action) => {
        state.msg = "pending";
      })
      .addCase(increaseCartCount.fulfilled, (state, action) => {
        const itemIndex = state.cartItems.findIndex(
          (item) => item.id === action.payload
        );
        if (itemIndex !== -1) {
          state.cartItems[itemIndex].quantity++;
        }
      })
      .addCase(decreaseCartCount.fulfilled, (state, action) => {
        const itemIndex = state.cartItems.findIndex(
          (item) => item.id === action.payload
        );
        if (itemIndex !== -1) {
          const newQuantity = state.cartItems[itemIndex].quantity - 1;
          if (newQuantity > 0) {
            state.cartItems[itemIndex].quantity = newQuantity;
          } else {
            state.cartItems.splice(itemIndex, 1);
          }
        }
      })
      .addCase(totalThunk.fulfilled, (state, action) => {
        state.total = action.payload;
      })
      .addCase(totalThunk.pending, (state, action) => {
        state.total = "...";
      });
  },
});

// Exporting reducer and selector
export const cartReducerSlice = cartSlice.reducer;
export const cartSelector = (state) => state.cartReducerSlice;
