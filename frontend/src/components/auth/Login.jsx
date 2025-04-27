import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  //to manage auth
  const { login, auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      console.log("???");
      if (res.status == 200) {
        alert("Login successful");
      } else {
        alert(res.error);
        console.log("ress ", res);
      }
    } catch (error) {
      alert("Please try again");
      console.error("Some error occured while logging.", error);
    }
  };

  useEffect(() => {
    if (auth?.loggedIn) {
      navigate("/");
    }
  }, [auth?.loggedIn, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto min-h-screen mt-40"
    >
      <div className="mb-5 ">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-red-900"
        >
          Email:
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-red-900"
        >
          Password:
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
