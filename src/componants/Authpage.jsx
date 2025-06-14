import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiclient from "../uitls/CustomAxios";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setisLogin] = useState(true);
  const [inputChange, setInputChange] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputChange({ ...inputChange, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isLogin) {
      setLoading(true);
      apiclient
        .post("/auth/register", inputChange)
        .then((res) => {
          window.alert("registration successfull");
          setisLogin(true);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          window.alert(error.response.data.message);
          setisLogin(true);
          setLoading(false);
        });
    }
    if (isLogin) {
      setLoading(true);
      apiclient
        .post("/auth/login", inputChange)
        .then((res) => {
          window.alert("Login successfull");
          setLoading(false);
          const expiryTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour in milliseconds
          sessionStorage.setItem("expiry", expiryTime);
          sessionStorage.setItem("token", res.data.token);
          navigate("/");
        })
        .catch((error) => {
          setLoading(false);
          window.alert(error.response.data.message);
        });
    }
  };

  return (
    <main className="flex min-h-screen font-sans">
      {/* LEFT SIDE */}
      <div className="w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white p-10 flex flex-col justify-center relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-4xl font-bold mb-4">
            🗺️ Route Finder <span className="text-white">Application</span>
          </h1>
          <h2 className="text-3xl font-semibold mb-6">
            Find your best route
            <br />
            with ease.
          </h2>
          <p className="text-lg opacity-80">
            Supercharge Your Navigation
            <br />
            using our smart assistant!
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-sm p-8">
          <div className="text-center mb-8">
            <div className="text-5xl text-purple-700 font-bold">🗺️</div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome to <span className="text-purple-700">Route Finder </span>
            </h2>
          </div>
          {message && (
            <div className="mb-4 text-center text-sm text-green-600">
              {message}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <label>
                <input type="checkbox" className="mr-1" /> Remember me
              </label>
              <a href="#" className="text-purple-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : isLogin ? (
                "Login"
              ) : (
                "Register"
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="border-b w-full" />
              <span className="text-gray-400">or</span>
              <div className="border-b w-full" />
            </div>
            <button
              type="button"
              className="w-full border border-gray-300 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setisLogin(false)}
                    className="text-purple-700 hover:underline cursor-pointer"
                  >
                    Create Account
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setisLogin(true)}
                    className="text-purple-700 hover:underline cursor-pointer"
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
