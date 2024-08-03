import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import Editor from "./components/Editor/Editor";
import { useDispatch, useSelector } from 'react-redux'
import AllRoutes from "./AllRoutes";
import Homepage from "./components/Homepage/Homepage";
import Test from "./components/Homepage/Test";


function App() {

    const User = useSelector((state) => (state.currentUserReducer))

  return (
    <div>
      <Router>
        <Navbar />
        <AllRoutes />
      </Router>
    </div>
  );
}

export default App;
