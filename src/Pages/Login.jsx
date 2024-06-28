import React, { useState } from "react";
import img from "../assets/hero.svg";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
function Login() {
    const navigate = useNavigate()
    const apiLink = import.meta.env.VITE_API_URL;
    const [admin, setadmin] = useState({
        email : "",
        password : ""
    })
    const [loading,setLoading] = useState(false)
    function handleChange(data) {
        const {name,value} = data.target;
        setadmin({...admin,[name] : value});

    }
    function handleSubmit(e){
        e.preventDefault();
        setLoading(true)
        axios.post(`${apiLink}/admin/login` , admin)
        .then((res) => {
            window.localStorage.setItem('admin', JSON.stringify(res.data.data) );
            if(res.data.status == "success") {
                navigate('/dashboard');
                setLoading(false);

            }
        })
        .catch((err) => {
            console.error(err);
            setLoading(false)
            toast.error(err.response.data.message)
        })
        
        


        
    }
  return (
    <div className="w-full h-screen flex ">
      <div className="w-1/2 flex justify-center items-center">
        <form  onSubmit={(e) => handleSubmit(e)}  className="w-2/3  ">
          <div className="flex flex-col gap-4">
            <div className="flex items-center my-2 gap-2">
              <Mail />
              adresse e-mail
            </div>
            <input name="email" onChange={(e) => handleChange(e)} className="bg-bg border-[1px] focus:outline-none focus:border-main border-black/70 py-3 px-2 my-2" type="email" placeholder="example@gmailcom" />
          </div>
          <div className="flex flex-col my-2 gap-2">
            <div className="flex items-center gap-2">
              <Lock />
              Mot de pass
            </div>

            <input name="password" onChange={(e) => handleChange(e)} className=" bg-bg border-[1px] focus:outline-none focus:border-main border-black/70 py-3 px-2 my-2  " type="password" placeholder="example@gmailcom" />
          </div>
          {loading ? <div className="loader scale-75 my-4 mx-8"></div> : <button type="submit"  className=" btn "> Log in </button>}
        </form>
      </div>
      <div className="w-1/2 flex justify-center items-center ">
        <img src={img} alt="..." />
      </div>
    </div>
  );
}

export default Login;
