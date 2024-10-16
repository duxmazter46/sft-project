import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [isSignUp, setIsSignUp] = useState(false);
  console.log(import.meta.env.VITE_APP_API_URL);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/users/login`, {
        usernameOrEmail: email,
        password: password,
      }, { withCredentials: true });
      
      const userData = response.data.user;
      console.log("Login successful", response.data);
      
  
      // Save user data to localStorage (or sessionStorage)
      localStorage.setItem('user', JSON.stringify(userData));  
  
      // Check the user role and navigate accordingly
      if (userData.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/MainPage");
      }
  
    } catch (error) {
      console.error("Login error", error);
      alert('Email or password is incorrect.')
      // Handle error, e.g., show an error message
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div
        className="bg-cover h-0 lg:h-screen lg:w-screen"
        style={{
          backgroundImage: 'url("/assets/Photo-by-Brooke-Cagle.png")',
          backgroundPosition: "left",
        }}
      ></div>
      <div
        className="flex flex-col h-screen w-screen"
        style={{ backgroundImage: 'url("/assets/Background.png")' }}
      >
        <div className="insert-0 m-auto w-[380px] h-[500px] bg-white rounded-lg ">
          
          <div className="text-center">
            <img
              src="assets/logo.png"
              alt="Stroke Fast Track Logo"
              className="mx-auto w-fit h-fit"
            />
          </div>
          <form onSubmit={handleLogin} className="px-10 ">
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or Username"
            />
            <FormInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gray-900 text-white font-semibold rounded-md shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
}: FormInputProps) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
    />
  </div>
);

export default LoginPage;
