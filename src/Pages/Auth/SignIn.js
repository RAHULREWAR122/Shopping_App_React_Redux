import React, { useState } from "react";
import style from "./signIn.module.css";
import { NavLink } from "react-router-dom";
import { SignInUserThunk, authSelector } from "../../Reducers/Auth/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Component for user sign-in
function SignIn({ setMsg }) {
  // State variables using useState hook
  const [email, setEmail] = useState(""); // State for user email
  const [password, setPass] = useState(""); // State for user password
  const [errMsg, setErrMsg] = useState(""); // State for error message

  const dispatch = useDispatch(); // Redux dispatch function
  const msgs = useSelector(authSelector); // Selecting authentication messages
  const navigate = useNavigate(); // Navigation hook

  // Function to handle user sign-in
  const handleSignInUser = async (e) => {
    e.preventDefault();
    setTimeout(() => {
      setErrMsg("");
    }, 2000);

    try {
      if (email === "" || password === "") {
        setErrMsg("All fields are required, try Again");
        return;
      } else if (password.length < 6) {
        setErrMsg("Password must be at least 6 characters.");
        setEmail("");
        setPass("");
        return;
      }

      const signInAction = await dispatch(SignInUserThunk({ email, password }));
      if (signInAction.payload) {
        navigate("/");
        setMsg(`SignIn Successfully`);
      } else {
        setErrMsg("Invalid user email or password");
        setMsg("Invalid user email or password");
        setEmail("");
        setPass("");
        return;
      }
    } catch (err) {
      console.log("error in Sign in User ", err.message);
    }
  };

  // JSX for rendering
  return (
    <div className={style.signIn}>
      <div className={style.form}>
        <h1 style={{ textAlign: "center" }}>Sign In</h1>
        <form action="">
          <div className={style.inputContainer}>
            <input
              type="email"
              name=""
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className={style.inputContainer}>
            <input
              type="password"
              name=""
              id="password"
              placeholder=""
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
            <label htmlFor="password">Password</label>
          </div>
          <h4 style={{ color: "red", textAlign: "center" }}>
            <strong>{errMsg}</strong>
          </h4>
          <button onClick={handleSignInUser}>
            {msgs.msg === "pending" ? "Wait..." : "Login"}
          </button>
        </form>
        <h3 style={{ marginTop: "40px", textAlign: "center" }}>
          <strong>
            or try to <NavLink to="/signUp">SignUp?</NavLink>
          </strong>
        </h3>
      </div>
    </div>
  );
}

export default SignIn;
