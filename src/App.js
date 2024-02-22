import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Navbar from "./Pages/Navbar/nav";
import AllItems from "./Pages/AllItems/AllItems";
import CartPage from "./Pages/Cart/cartPage";
import Orders from "./Pages/Orders/orders";
import SignUp from "./Pages/Auth/SignUp";
import SignIn from "./Pages/Auth/SignIn";
import { useEffect, useState } from "react";
import { auth } from "./firebase/auth";
import ErrorPage from "./error/404";

// Defining the main App component
function App() {
  // State variables using useState hook
  const [msg, setMsg] = useState(""); // Message state for notifications
  const [isAuth, setUserAuth] = useState(""); // Authentication state

  // useEffect hook for handling user authentication changes
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // Listening for authentication state changes
      if (user) {
        setUserAuth(user.displayName); // Set user's display name if authenticated
      } else {
        setUserAuth(""); // Clear user's display name if not authenticated
      }
    });
  }, []); // Empty dependency array to run this effect only once

  // useEffect hook to clear message after 3 seconds
  useEffect(() => {
    setTimeout(() => {
      setMsg("");
    }, 3000);
  }); // Missing dependency array, may cause infinite loop

  // Creating router configuration using createBrowserRouter
  const Router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar isAuth={isAuth} msg={msg} setMsg={setMsg} />,
      errorElement :<ErrorPage/>,
        children: [
        { index: true, element: <AllItems isAuth={isAuth} setMsg={setMsg} /> },
        { path: "cart", element: <CartPage setMsg={setMsg} isAuth={isAuth} /> },
        { path: "orders", element: <Orders setMsg={setMsg} /> },
        { path: "signUp", element: <SignUp setMsg={setMsg} /> },
        { path: "signIn", element: <SignIn setMsg={setMsg} /> },
      ],
    },
  ]);

  // Returning the JSX with provider wrappers
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={Router} />
      </Provider>
    </>
  );
}

export default App;
