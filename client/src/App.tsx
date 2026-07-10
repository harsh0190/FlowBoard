import AppRoutes from "./routes/AppRoutes";
import SocketListener
from "./components/SocketListener";

function App() {
  return (
    <>
      <AppRoutes />
      <SocketListener/>
    </>
  );
}

export default App;
