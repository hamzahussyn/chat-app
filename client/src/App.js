import Login from "./components/Login";
import Chat from "./components/Chat";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";

import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

function App() {
  const token = localStorage.getItem("token");

  return (
    <div>
      {!token ? (
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Signup />} />
        </Routes>
      ) : (
        <Routes>
          <Route exact path="/" element={<Chat socket={socket}/>} />
        </Routes>
      )}
    </div>
  );
}

export default App;
