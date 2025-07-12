import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/restaurant/dashboard");
      }
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image Section (Only image, no text) */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1671403964040-3fa56d33f44b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGZvb2R8ZW58MHx8MHx8fDA%3D')",
        }}
      ></div>

      {/* Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">
            Login (Admin & Restaurant)
          </h2>
          <form className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-700 transition duration-200 cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
