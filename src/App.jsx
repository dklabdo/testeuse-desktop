import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import { Toaster } from "react-hot-toast";
import SideBar from "./components/SideBar";
import Dashboard from "./Pages/Dashboard";
import Product from "./Pages/Product";
import AdminPage from "./Pages/AdminPage";
import ProductInfo from "./Pages/ProductInfo";
import AppProvider from "./AppProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import User from "./Pages/User";
const query = new QueryClient(
  {
    defaultOptions : {
      queries :{staleTime : 1000 * 60 * 4}
    }
  }
);
function App() {
  return (
    <>
      
      <QueryClientProvider client={query}  >
        <ReactQueryDevtools/>
        <AppProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <div className="flex">
                  {" "}
                  <SideBar /> <Dashboard />{" "}
                </div>
              }
            />
            <Route
              path="/product"
              element={
                <div className="flex">
                  {" "}
                  <SideBar /> <Product />{" "}
                </div>
              }
            />
           
            <Route
              path="/user"
              element={
                <div className="flex">
                  {" "}
                  <SideBar /> <User />{" "}
                </div>
              }
            />
            <Route
              path="/admin"
              element={
                <div className="flex">
                  {" "}
                  <SideBar /> <AdminPage />{" "}
                </div>
              }
            />
            <Route
              path="/productInfo/:id"
              element={
                <div className="flex">
                  {" "}
                  <SideBar /> <ProductInfo />{" "}
                </div>
              }
            />
          </Routes>
          <Toaster position="top-center" reverseOrder={false} />
        </AppProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
