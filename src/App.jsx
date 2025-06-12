import "./App.css";
import MapForm from "./componants/MapForm";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 ">
      <header className="text-center py-6 text-2xl font-bold text-yellow-600 ">
        Route Finder Map Application
      </header>
      <MapForm />
    </div>
  );
}

export default App;
