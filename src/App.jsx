import "./App.css";
import MapForm from "./componants/MapForm";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import AuthPage from "./componants/Authpage";
import apiclient from "./uitls/CustomAxios";
import RouteMap from "./componants/RouteMap";
import { useEffect, useState } from "react";
import useTokenExpiry from "./uitls/useTokenExpire";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./uitls/protectRoute";

function App() {
  const [profile, setProfile] = useState(null);
  const token = sessionStorage.getItem("token");
  useTokenExpiry();
  useEffect(() => {
    if (token) {
      apiclient
        .get("/auth/profile")
        .then((res) => setProfile(res.data))
        .catch(() => {
          setProfile(null);
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("expiry");
        });
    }
  }, [token]);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute element={<MapForm />} isAuthenticated={!!token} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
