import ReactDOM from 'react-dom/client';
import './index.css'
import { useContext } from "react";
import { Provider } from "react-redux";
import AppRouter from "./routers/AppRouter";
import { store } from "./store";
import { AuthProvider, UserContext } from "@/context/AuthContext";

function Root() {
  const { ready } = useContext(UserContext);

  if (!ready) return <div>Loading...</div>; // or a spinner

  return <AppRouter />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </Provider>
);