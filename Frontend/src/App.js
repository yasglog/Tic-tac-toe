import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    <div>
      <Toaster></Toaster>
    </div>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/gamepage/:roomId" element={<GamePage/>}></Route>
      </Routes>
    </>
  );
}

export default App;
