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
import Swal from "sweetalert2";
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
      {isNonDesktopDevice() && (
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Cet espace administratif est destiné à être utilisé sur un ordinateur. Veuillez vous connecter depuis un ordinateur pour une meilleure expérience. ",
          confirmButtonText : "OK",
          confirmButtonColor : "#C50808"
        }).then((result) => {
          if(result.isConfirmed){
            window.location.replace('https://testeuse.vercel.app/')
          }

        })
      )}
      
    </>
  );
}

function isNonDesktopDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;

  const isMobile = userAgent.includes("mobile");
  const isTablet = userAgent.includes("tablet") || (userAgent.includes("android") && !userAgent.includes("mobile")) || userAgent.includes("ipad");

  // Assuming desktop width is typically greater than 1024px
  const isDesktopWidth = width > 1024;

  return isMobile || isTablet || !isDesktopWidth;
}





export default App;
