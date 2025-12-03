
import AppContextProvider from "./contexts/AppContext";
import AppRouter from "./pages/AppRouter";

function App() {
  return (
    <AppContextProvider>
      <AppRouter/>
    </AppContextProvider>
  );
}

export default App;
