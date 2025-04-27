import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    adminRole: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto min-h-screen mt-10"
    >
      <div className="mb-5">
        <label
          htmlFor="username"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-red-900"
        >
          Username:
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-5">
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
    
      <div>
        <label class="inline-flex items-center mb-5 cursor-pointer">
          <input
            type="checkbox"
            name="adminRole"
            checked={formData.adminRole}
            onChange={handleChange}
            className="sr-only peer"
            value=""
            class="sr-only peer"
          />
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ms-3 text-sm font-medium text-gray-900 dark:text-red-900">
            Planning want to organize contests
          </span>
        </label>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
