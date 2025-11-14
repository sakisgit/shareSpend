
import AppContextProvider from "./components/context/AppContext";
import AppRouter from "./components/pages/AppRouter";

function App() {
  return (
    <AppContextProvider>
      <AppRouter/>
    </AppContextProvider>
  );
}

export default App;
