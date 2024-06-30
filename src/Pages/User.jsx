import React, { useContext } from "react";
import NavBar from "../components/NavBar";
import {
  Phone,
  Copy,
  X,
  MailCheck,
  Info,
  MapPin,
  Ruler,
  Weight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import erroImg from "../assets/error.png";
import { useState } from "react";
import { AppContext } from "../AppProvider";
const apiLink = import.meta.env.VITE_API_URL;

function User() {
  const [open, setOpen] = useState(false);
  const [currentUser, setcurrentUser] = useState(null);
  const { searchByUser } = useContext(AppContext);
  
  function close() {
    setOpen(false);
  }
  function Open(user) {
    console.log(user);
    setcurrentUser(user);

    setOpen(true);
  }
  const UserQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${apiLink}/user`);
        console.log(res);
        return res.data;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  });
  return (
    <>
      <div className="w-full h-screen  ">
        <NavBar searchBy="user" serach={true} />
        <div className="relative px-4 flex flex-col-reverse overflow-y-auto h-full py-8 ">
          {!UserQuery.isLoading && !UserQuery.isError ? (
           
           UserQuery.data.length == 0 ? (
              <p className="w-full text-center my-32 font-medium text-lg">
                {" "}
                aucun prouduit trouver{" "}
              </p>
            ) : (
              UserQuery.data.data.map((usr, index) => {
                return (
                  <>
                    {usr.fullName.includes(searchByUser) |
                      usr._id.includes(searchByUser) && (
                      <TesteurLigne open={Open} user={usr} key={index} />
                    )}
                  </>
                );
              })
            )
          ) : UserQuery.isError ? (
            <div className="flex flex-col gap-8">
              <img src={erroImg} alt="..." className="w-96  mx-auto" />
              <button
                className="btn w-fit mx-auto "
                onClick={() => query.refetchQueries(["product"])}
              >
                {" "}
                Reesayer{" "}
              </button>
            </div>
          ) : (
            <div className="w-full flex justify-center py-20  ">
              <div className="loader"></div>
            </div>
          )}
        </div>
      </div>
      <Details user={currentUser} open={open} close={close} />
    </>
  );
}

function TesteurLigne({ open, user }) {
  function copyId() {
    console.log("copie test");
    window.navigator.clipboard.writeText(user._id).then(() => {
      toast.success("id copier avec succes");
    });
  }
  
  return (
    <div
      className={`py-6  mx-4 my-3 flex justify-between items-center px-4  ${
        user.isTester ? "bg-main/70 text-white" : "bg-gray-200 text-black"
      }`}
    >
      <p className="font-medium text-base w-[30%] "> {user.fullName} </p>
      <div className="font-medium text-base w-[30%] flex gap-2 items-center ">
        {" "}
        <Phone className="cursor-pointer" /> {user.phoneNumber}{" "}
      </div>
      <div className="font-medium text-base w-[42%] flex gap-2 items-center">
        {" "}
        <Copy onClick={() => copyId()} className="cursor-pointer" /> {user._id}{" "}
      </div>
      <button onClick={() => open(user)} className="">
        <Info
          className={`${
            user.isTester ? "hover:text-white" : "hover:text-main"
          }`}
        />
      </button>
    </div>
  );
}

function Details({ open, close, user }) {
  const query = useQueryClient();
  const UserToTesterMutation = useMutation({
    mutationKey: ["userToTester"],
    mutationFn: async () => {
      try {
        const res = await axios.post(`${apiLink}/user/tester/${user._id}`);
        console.log(res);
        return res.data;
      } catch (err) {
        throw new Error(err);
      }
    },
    onSuccess: () => {
      toast.success("votre etulisateur est maintenant un testeur");
      query.invalidateQueries(["user"]);
      close();
    },
  });
  return (
    <>
      {open && (
        <div className="w-full flex justify-center items-center h-screen  absolute bg-black/60 z-30">
          <div className="h-fit relative w-[600px] pt-8 PopUp flex  px-4  rounded-3xl shadow-lg shadow-black/50  bg-white">
            <button className="absolute top-6 left-6" onClick={() => close()}>
              <X size={45} color="#C50808" />
            </button>
            <div className="mt-20 w-full">
              <h1 className="px-4 mb-4 text-xl text-main font-semibold">
                {" "}
                Information {user.isTester
                  ? "du Testeur"
                  : "d'utililisateur"}{" "}
              </h1>
              <h2 className="text-lg px-4 font-medium">
                {" "}
                {user.fullName} , {user.Age} ans{" "}
              </h2>
              <div className="px-4 py-8 flex flex-col ">
                <div className="flex gap-2 my-3 items-center">
                  <MailCheck />
                  {user.email}
                </div>
                <div className="flex gap-2 my-3 items-center">
                  <Phone />
                  {user.phoneNumber}
                </div>
                <div className="flex gap-2 my-3 items-center">
                  <MapPin />
                  {user.willaya}
                </div>
                <div className="flex gap-6 items-center my-8">
                  <div
                    className={`flex gap-2 items-center rounded-2xl text-white px-6 py-2  ${
                      user.gender == "Male" ? "bg-blue-500" : "bg-pink-500"
                    }`}
                  >
                    {user.gender}
                  </div>
                  <div className="flex gap-2 items-center rounded-2xl text-black/70 px-6 py-2 bg-gray-300  ">
                    <Ruler />
                    {user.height} cm
                  </div>
                  <div className="flex gap-2 items-center rounded-2xl text-black/70 px-6 py-2 bg-gray-300  ">
                    <Weight />
                    {user.weight} kg
                  </div>
                </div>
                {!user.isTester && (
                  <div className="w-full py-8 flex justify-center ">
                    <button
                      disabled={UserToTesterMutation.isPending}
                      onClick={() => UserToTesterMutation.mutate()}
                      className="py-2 px-4 border-2 border-main hover:bg-main hover:text-white  bg-white  text-main hover:scale-105 transition rounded-2xl"
                    >
                      {" "}
                      Transformer au testeur{" "}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default User;
