import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "../../firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
// make iniitialState
const initialState = {
  user: null,
  msg: "",
};

// create a signUp action using createAsyncThunk
export const signUpUserThunk = createAsyncThunk(
  "auth/signUp",
  async ({ name, email, password }, thunkApi) => {
    try {
      //create user using createUserWithEmailAndPassword and pass email and password and auth to verify authencation using firebase
      const signUp = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // use displayName to display user Name
      await updateProfile(signUp.user, {
        displayName: name,
      });
      //
      const userName = signUp.user.displayName;
      return userName;
    } catch (err) {
      console.log("error in signUp", err.message);
    }
  }
);

// create a signIn action using createAsyncThunk
export const SignInUserThunk = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, thunkApi) => {
    try {
      // login user using signInWithEmailAndPassword with pass values email and password
      const signIn = await signInWithEmailAndPassword(auth, email, password);
      const userName = signIn.user.displayName;
      return userName;
    } catch (err) {
      console.log("error in sign in user ", err.message);
    }
  }
);

// log outUser
export const logOutUser = createAsyncThunk(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      // loged Out User using SignOut
      await signOut(auth);
    } catch (err) {
      console.log(err.message);
    }
  }
);

// create authSlice functin using createSlice
const authencationUserSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  // working on extraReducers , for all Actions we use 3 case fulfilled if res. successfully , pending - if working on action and rejected - if some error then reject the req.
  extraReducers: (builder) => {
    builder
      .addCase(signUpUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.msg = "";
      })
      .addCase(signUpUserThunk.pending, (state, action) => {
        state.msg = "pending";
      })
      .addCase(signUpUserThunk.rejected, (state, action) => {
        state.msg = action.error.message;
      })

      .addCase(SignInUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.msg = "";
      })
      .addCase(SignInUserThunk.pending, (state, action) => {
        state.msg = "pending";
      })
      .addCase(SignInUserThunk.rejected, (state, action) => {
        state.msg = action.error.message;
      })

      .addCase(logOutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const authReducer = authencationUserSlice.reducer;
export const authSelector = (state) => state.authReducer;
