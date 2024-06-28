import React from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { LayoutDashboard , ShoppingBasket , UserRound , SquareUser} from "lucide-react";
function SideBar() {
  return (
    <div className=" min-w-64 h-screen border-r-2 flex flex-col overflow-y-hidden gap-40 py-10 border-black/20 ">
      <div className="w-full flex justify-center items-center ">
        <img src={logo} alt="..." className="w-40" />
      </div>
      <div className="flex flex-col gap-8 text-base pl-14 w-full ">
        <Link to="/dashboard" className="flex gap-2 group text-base hover:text-main transition ">
          <LayoutDashboard className="  group-hover:stroke-main " />
          Dashboard
        </Link>
        <Link to="/product" className="flex gap-2 group text-base hover:text-main transition">
          <ShoppingBasket className="group-hover:stroke-main" />
          Prouduit
        </Link>
       
        <Link to="/user" className="flex gap-2 group text-base hover:text-main transition">
          <UserRound className="group-hover:stroke-main" />
          Utilisateur
        </Link>
        <Link to="/admin" className="flex gap-2 group text-base hover:text-main transition">
          <SquareUser className="group-hover:stroke-main" />
          Admins
        </Link>
      </div>
      
    </div>
  );
}

export default SideBar;
