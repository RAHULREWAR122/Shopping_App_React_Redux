import React, { useState } from "react";
import style from "./signUp.module.css";
import { NavLink } from "react-router-dom";
import { signUpUserThunk, authSelector } from "../../Reducers/Auth/auth";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Component for user sign-up
function SignUp({ setMsg }) {
  // State variables using useState hook
  const [name, setName] = useState(""); // State for user name
  const [email, setEmail] = useState(""); // State for user email
  const [password, setPass] = useState(""); // State for user password
  const [errMsg, setErrMsg] = useState(""); // State for error message

  const msgs = useSelector(authSelector); // Selecting authentication messages
  const dispatch = useDispatch(); // Redux dispatch function
  const navigate = useNavigate(); // Navigation hook

  // Function to handle user sign-up
  const handleSignUp = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setErrMsg("");
    }, 2000);

    try {
      if (name === "" || email === "" || password === "") {
        setErrMsg("All fields are required, try Again");
        return;
      } else {
        if (password.length < 6) {
          setErrMsg("Password must be at least 6 characters");
          setName("");
          setEmail("");
          setPass("");
          return;
        } else {
          dispatch(signUpUserThunk({ name, email, password }));
          setName("");
          setEmail("");
          setPass("");
          setErrMsg("");
          navigate("/signIn");
          setMsg("SignUp Successfully");
        }
      }
    } catch (err) {
      console.log("error in signUp User", err.message);
    }
  };

  // JSX for rendering
  return (
    <div className={style.signIn}>
      <div className={style.form}>
        <h1 style={{ textAlign: "center" }}>Sign Up</h1>
        <form action="">
          <div className={style.inputContainer}>
            <input
              type="name"
              name=""
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="text">Name</label>
          </div>
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
              placeholder=" "
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
            <label htmlFor="password">Password</label>
          </div>
          <h4 style={{ color: "red", textAlign: "center" }}>
            <strong>{errMsg}</strong>
          </h4>
          <button onClick={handleSignUp}>
            {msgs.msg === "pending" ? "Wait..." : "SignUp"}
          </button>
        </form>
        <h3 style={{ marginTop: "40px", textAlign: "center" }}>
          <strong>
            Have you already an account <NavLink to="/signIn">Login?</NavLink>
          </strong>
        </h3>
      </div>
    </div>
  );
}

export default SignUp;
