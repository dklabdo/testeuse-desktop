import React, { useRef, useState } from "react";
import NavBar from "../components/NavBar";
import { Trash, CirclePlus, X } from "lucide-react";
import img from "../assets/image.png";
import useImage from "../hooks/useImage";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import erroImg from "../assets/error.png";
import toast from "react-hot-toast";

const apiLink = import.meta.env.VITE_API_URL;

function AdminPage() {
  const query = useQueryClient();
  const [openAddAmdin, setopenAddAmdin] = useState(false);
  function close() {
    setopenAddAmdin(false);
  }

  const AdminQuery = useQuery({
    queryKey: ["admin"],
    queryFn: async () => {
      const res = await axios.get(`${apiLink}/admin/AllAdmin`);

      return res.data;
    },
  });

  return (
    <>
      <AddAdmin open={openAddAmdin} close={close} />

      <div className="w-full  h-screen overflow-y-auto ">
        
        <div className="text-xl pl-16 font-bold mt-8 ">
          <div className="px-4 flex justify-between items-center">
            <p> Admin </p>
            <button
              onClick={() => setopenAddAmdin(true)}
              className="flex text-sm btn gap-2 items-center"
            >
              {" "}
              <CirclePlus size={25} color="#ffff" /> Add Admin{" "}
            </button>
          </div>
          {!AdminQuery.isError && !AdminQuery.isLoading ? (
            AdminQuery.data.length == 0 ? <p className="my-48 w-full text-lg font-medium text-center "> there is no admin  </p> : (
              AdminQuery.data.map((admin, index) => {
                return (
                  <AdminLigne
                    key={index}
                    img={admin.avatar}
                    name={admin.fullname}
                    email={admin.email}
                    id={admin._id}
                  />
                );
              })
            ) 

          ) : AdminQuery.isError ? (
            <div className="flex w-full items-center flex-col gap-8">
              <img src={erroImg} alt="..." className="w-96 " />
              <button
                className="btn w-fit mx-auto "
                onClick={() => query.refetchQueries(["product"])}
              >
                {" "}
                Reesayer{" "}
              </button>
            </div>
          ) : (
            <div className="w-full flex justify-between my-48"> <div className="loader mx-auto "></div> </div>
          )}
        </div>
      </div>
    </>
  );
}

function AdminLigne({ img, name, email ,id }) {
  const query = useQueryClient()
  const DeleteAdminMutation = useMutation({
    mutationKey : ["deleteAdmin"],
    mutationFn : async () => {
      const res = await axios.delete(`${apiLink}/admin/${id}`)
      return res
    },

    onSuccess : () => {
      query.invalidateQueries(["admin"])
      toast.success("admin suprimer avec succes")
    }
  
    
  })
  return (
    <div className="w-full my-8 h-24 flex justify-between px-6 items-center ">
      <div className="flex gap-4 items-center ">
        <img
          src={img}
          className="w-24 bg-gray-200 rounded-full object-cover object-center"
        />
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-lg"> {name} </h2>
          <p className="text-base font-normal"> {email} </p>
        </div>
      </div>
      <button onClick={() => DeleteAdminMutation.mutate()} className={ `flex text-sm py-2 px-6 rounded-3xl bg-main text-white gap-2 items-center ${DeleteAdminMutation.isPending ? "bg-gray-500" : "bg-main"} ` } >
        {" "}
        <Trash /> Bann{" "}
      </button>
    </div>
  );
}

function AddAdmin({ open, close }) {
  const [file, setfile] = useState(null);
  const query = useQueryClient();
  const [admin, setadmin] = useState({
    fullname: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const AddAdminMutation = useMutation({
    mutationKey: ["addAdmin"],
    mutationFn: async () => {
      console.log("test2");
      const res = await axios.post(`${apiLink}/admin`, {
        fullname: admin.fullname,
        password: admin.password,
        email: admin.email,
        avatar: url,
        role: 0,
      });
      console.log(res);
      return res.data;
    },
    onSuccess: () => {
      console.log("succes");
      
      toast.success("admin ajouter avec succes")
      close();
      setfile(null)
      query.invalidateQueries(["admin"]);
      
    },
  });

  const url = useImage(file);
  function HandleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    setfile(file);
  }
  function HandleFileChange(e) {
    e.preventDefault();
    const file = e.target.files[0];

    setfile(file);
  }

  function handleChange(e) {
    const { value, name } = e.target;
    setadmin({ ...admin, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(admin);
    if (admin.cpassword != admin.password) {
      toast.error("veuillez confirmer votre mot de pass");

      return;
    }
    else if (file == null) {
      toast.error("veuillez choisir une image")
      return;
    }
    console.log("test");
    AddAdminMutation.mutate();
  }

  const validPassWord = useRef();

  return (
    <>
      {open && (
        <div className="w-full flex justify-center items-center h-screen  absolute bg-black/60 z-30">
          <div className="h-[770px] relative w-[700px] pt-4 PopUp flex  px-4  rounded-3xl shadow-lg shadow-black/50  bg-white">
            <button className="absolute top-6 left-6" onClick={() => close()}>
              <X size={45} color="#C50808" />
            </button>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="w-full items-center px-4 flex flex-col"
            >
              <div className="flex flex-col p-10  w-96 ">
                <div
                  onDrop={(e) => HandleDrop(e)}
                  onDragOver={(e) => e.preventDefault()}
                  className="cursor-move w-full h-60 p-12 flex justify-center items-center border-dashed mb-2 mt-8 rounded-2xl border-2 border-main"
                >
                  <img
                    src={url}
                    className="object-contain w-full rounded-2xl"
                  />
                </div>
                <label
                  className="self-center w-full text-center text-main  underline rounded-full cursor-pointer"
                  htmlFor="addFile"
                >
                  Ajouter une photo
                </label>
                <input
                  onChange={(e) => HandleFileChange(e)}
                  type="file"
                  className="hidden"
                  id="addFile"
                />
              </div>
              <input
                name="fullname"
                onChange={(e) => handleChange(e)}
                className="bg-white  border-[1px] w-full  focus:outline-none focus:border-main border-black/70 py-3 px-2 my-2"
                type="text"
                placeholder="admin name"
              />
              <input
                name="email"
                onChange={(e) => handleChange(e)}
                className="bg-white  border-[1px] w-full  focus:outline-none focus:border-main border-black/70 py-3 px-2 my-2"
                type="text"
                placeholder="e-mail"
              />
              <input
                name="password"
                onChange={(e) => handleChange(e)}
                className="bg-white  border-[1px] w-full  focus:outline-none focus:border-main border-black/70 py-3 px-2 my-2"
                type="password"
                placeholder="mot de pass"
              />
              <input
                ref={validPassWord}
                name="cpassword"
                onChange={(e) => handleChange(e)}
                className="bg-white  border-[1px] w-full  focus:outline-none focus:border-main border-black/70 py-3 px-2 my-2"
                type="password"
                placeholder="Confirmer le mot de pass"
              />
              <button type="submit" className="btn  text-base ">
                {" "}
                Confirmer{" "}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPage;
