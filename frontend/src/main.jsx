import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import { Provider } from "react-redux";
import store from "./redux/store";
import { SidebarProvider } from './context/sidebarContext.jsx';
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <SidebarProvider>
    <Provider store={store}>
    <App />
    </Provider>
  </SidebarProvider>
)
