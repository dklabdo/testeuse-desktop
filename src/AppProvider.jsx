import React, { Children } from "react";
import { createContext } from "react";
import { useState } from "react";
import useFetch from "./hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export const AppContext = createContext();
const apiLink = import.meta.env.VITE_API_URL;

function AppProvider(props) {

  const [searchByUser,setsearchByUser] = useState("");
  const [searchByProduct,setsearchByProduct] = useState("");

  const SearchFn =(ts,val) => {
    if(ts == "product"){
      setsearchByProduct(val)
    }
    else{
      setsearchByUser(val)
    }
    
    
  }

 

  return (
    <AppContext.Provider value={ {SearchFn, searchByUser , searchByProduct} }>
      {props.children}
    </AppContext.Provider>
  );
}

export default AppProvider;
