import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.css";
import { store } from "./store/store.js";

const queryClient = new QueryClient({
  defaultOptions:{
    queries: {
      retry:  (failureCount, error) => 
        {
          if (error.status === 401 || error.status === 403) 
            {
                return false; // Don't retry on 401 errors
            }
          else{
            return failureCount < 3
          }
        }
    }
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
