import React, { useRef, useState } from "react";
import NavBar from "../components/NavBar";
import {
  ArrowBigDownIcon,
  ChevronDownIcon,
  CirclePlus,
  SquareStackIcon,
  X,
} from "lucide-react";
import { Trash } from "lucide-react";
import {
  Menu,
  MenuHandler,
  Button,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import toast from "react-hot-toast";
import erroImg from "../assets/error.png";

import {
  useMutation,

  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
const apiLink = import.meta.env.VITE_API_URL;
import axios from "axios";

function Dashboard() {
  const query = useQueryClient();
  const [open, setOpen] = useState(false);
  function close() {
    setOpen(!open);
  }

  const qstQuery = useQuery({
    queryKey: ["qst"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${apiLink}/question`);
        console.log(res.data);
        return res.data;
      } catch (err) {
        throw new Error(err);
      }
    },
  });
  const statQuey = useQuery({
    queryKey: ["stat"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${apiLink}/nbrCAT`);
        console.log(res.data);
        return res.data;
      } catch (err) {
        throw new Error(err);
      }
    },
  });

  return (
    <>
      <div className="w-full">
        
        <div className="w-full  overflow-y-auto  h-screen  p-4">
          <div className="flex  h-full   flex-col px-3 py-2 ">
            <h1 className="text-xl pl-6 font-bold  my-4"> Dashboard </h1>
            <div className="h-38 flex gap-12 h-36 px-6 my-8">
              <DashboardCard
                title="Nbr employé"
                count={
                  !statQuey.isLoading &&
                  !statQuey.isError &&
                  statQuey.data.data.NbrAdmin
                }
                color="#FFEFE7"
              />
              <DashboardCard
                title="Client"
                count={
                  !statQuey.isLoading &&
                  !statQuey.isError &&
                  statQuey.data.data.NbrTesteur
                }
                color="#E8F0FB"
              />
              <DashboardCard
                title="Nbr Testeur"
                count={
                  !statQuey.isLoading &&
                  !statQuey.isError &&
                  statQuey.data.data.NbrProduct
                }
                color="#FFEFE7"
              />
            </div>

            <div className="w-full h-full  ">
              <div className="flex items-center justify-between  gap-2">
                <h1 className="text-xl pl-6 font-bold  my-4"> Question </h1>

                <button
                  onClick={() => setOpen(true)}
                  className=" hover:bg-main hover:text-white hover:scale-110 transition  py-2 text-main flex gap-4 items-center  text-base rounded-2xl border-2 border-main  px-4 "
                >
                  Ajouter
                  <CirclePlus />
                </button>
              </div>
              <div className="w-full h-full px-6 py-4 ">
                {!qstQuery.isError && !qstQuery.isLoading ? (
                  <div>
                    {qstQuery.data.Qustions.map((qst, index) => {
                      return <Qst key={index} qst={qst} />;
                    })}
                    {qstQuery.data.Qustions.length == 0 && (
                      <div className="w-full text-center text-lg my-32">
                        {" "}
                        pas de question{" "}
                      </div>
                    )}
                  </div>
                ) : qstQuery.isError ? (
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
                  <div className="w-full flex justify-center py-20  ">
                    <div className="loader"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddQst open={open} close={close} />
    </>
  );
}

function DashboardCard({ title, count, color }) {
  console.log(count);
  return (
    <div
      style={{ backgroundColor: color }}
      className={`w-1/3 shadow-lg shadow-black/10 rounded-3xl min-w-56 py-6 px-6  `}
    >
      <h2 className="text-black font-bold text-lg "> {title} </h2>
      <p className="text-xl my-2 font-semibold "> {count} </p>
    </div>
  );
}

function Qst({ qst }) {
  const query = useQueryClient();
  const types = [
    "Oui ou non question",
    "Question simple (text)",
    "Question a choix multiple",
  ];
  const removeQstMutation = useMutation({
    mutationKey: ["addQst"],

    mutationFn: async () => {
      try {
        const res = await axios.delete(`${apiLink}/question/${qst._id}`);
        console.log(res.data);
        return res.data;
      } catch (err) {
        throw new Error(err);
      }
    },
    onSuccess: () => {
      toast.success("Question Suprimer avec succes");
      query.invalidateQueries(["qst"]);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-12 ">
        <p className="text-base font-medium"> {qst.Qustions} </p>
        <p className="text-base "> {types[qst.type]} </p>
      </div>
      <button
        onClick={() => removeQstMutation.mutate()}
        className="btn flex gap-2"
      >
        {" "}
        Delete <Trash />{" "}
      </button>
    </div>
  );
}

function AddQst({ open, close }) {
  const query = useQueryClient();
  const [openMenu, setOpenMenu] = useState(false);
  console.log(openMenu);
  const [qstType, setqstType] = useState(1);
  const [multiQuestion, setmultiQuestion] = useState([]);
  const [qst, setqst] = useState("");
  const [refresh, setrefrech] = useState(false);
  const responseInputRef = useRef();
  function handleAddResponse() {
    if (multiQuestion.length > 3 || responseInputRef.current.value == "") {
      toast.error(
        "le maximum des repose et 4 reponse et les repose vide sont invalide"
      );
      return;
    }

    multiQuestion.push(responseInputRef.current.value);
    setmultiQuestion(multiQuestion);
    toast.success("repose ajouter avec succes");
    responseInputRef.current.value = "";
    setrefrech(!refresh);

    console.log(multiQuestion);
  }
  const AddQstMutation = useMutation({
    mutationKey: ["addQst"],

    mutationFn: async () => {
      try {
        console.log({
          Qustions: qst,
          type: qstType,
          enumReponse: multiQuestion,
        });
        const res = await axios.post(`${apiLink}/question`, {
          Qustions: qst,
          type: qstType,
          enumReponse: multiQuestion,
        });
        console.log(res.data);
        return res.data;
      } catch (err) {
        throw new Error(err);
      }
    },
    onSuccess: () => {
      toast.success("Question ajouter avec succes");
      query.invalidateQueries(["qst"]);
      clear();
      close();
    },

    onError: (err) => {
      console.log(err);
    },
  });

  function clear() {
    setqst("");
    setqstType(1);
    setmultiQuestion([]);
  }

  const types = [
    "Oui ou non question",
    "Question simple (text)",
    "Question a choix multiple",
  ];
  return (
    <>
      {open && (
        <div className="w-full flex justify-center items-center h-screen  absolute bg-black/60 z-30">
          <div className="h-fit relative w-[900px] pt-8 PopUp flex  px-4  rounded-3xl shadow-lg shadow-black/50  bg-white">
            <button
              className="absolute top-6 left-6"
              onClick={() => {
                clear();
                close();
              }}
            >
              <X size={45} color="#C50808" />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="w-[80%] mx-auto py-10 "
            >
              <h2 className="text-main text-xl text-center my-6">
                {" "}
                Ajouter une question{" "}
              </h2>
              <input
                type="text"
                placeholder="Entrer la question"
                className="in py-5 rounded-xl"
                required
                onChange={(e) => setqst(e.target.value)}
              />

              {qstType == 2 && (
                <div className="w-full h-64 ">
                  <div className="flex  gap-4">
                    <input
                      placeholder="Ajouter une reponse"
                      type="text"
                      className="in py-2 rounded-xl"
                      ref={responseInputRef}
                    />
                    <button
                      onClick={() => handleAddResponse()}
                      className="btn flex items-center gap-3 "
                    >
                      {" "}
                      <CirclePlus /> Ajouter{" "}
                    </button>
                  </div>
                  <div className=" w-full h-52 ">
                    {multiQuestion.map((qst, index) => {
                      return (
                        <div className="flex justify-between items-center my-2  px-4 ">
                          <p className="text-base "> {qst} </p>
                          <button
                            onClick={() => {
                              multiQuestion.splice(index, 1);
                              setmultiQuestion(multiQuestion);
                              setrefrech(!refresh);
                            }}
                          >
                            {" "}
                            <Trash />{" "}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <details className="dropdown cursor-pointer">
                <summary onClick={() => setOpenMenu(!openMenu)} className="in flex justify-between py-5 rounded-xl w-[695px]">
                  {qstType == null ? "Type de Question" : types[qstType]}
                  <ChevronDownIcon
                    size={25}
                    className={` transition-transform ${
                      openMenu ? "rotate-0" : "rotate-180"
                    }`}
                  />
                </summary>
                { <ul className="p-2 w-[695px] cursor-pointer bg-white  flex flex-col items-start  shadow menu dropdown-content z-[1]  rounded-box ">
                  <li className="hover:bg-gray-200 w-full ">
                    <a
                      onClick={() => {setqstType(1)}}
                      className="flex w-full items-center gap-2"
                    >
                      Question simple (text)
                    </a>
                  </li>
                  <li className="hover:bg-gray-200 w-full active:bg-white focus:bg-white open:bg-white valid:bg-white ">
                    <a
                      onClick={() => {setqstType(0)}}
                      className="flex items-center gap-2"
                    >
                      Oui ou non question
                    </a>
                  </li>
                  <li className="hover:bg-gray-200 w-full">
                    <a onClick={() => {setqstType(2) }}>
                      Question a choix multiple
                    </a>
                  </li>
                </ul>}
              </details>
              <div className="w-full flex mt-6">
                {" "}
                <button
                  type="submit"
                  disabled={AddQstMutation.isPending}
                  onClick={() => {(multiQuestion.length == 0 && qstType == 2) ? toast.error('veuillez ajouter une reponse (choix)') : AddQstMutation.mutate() }}
                  className={`btn my-8 mx-auto ${
                    AddQstMutation.isPending ? "bg-gray-400" : "bg-main"
                  }`}
                >
                  {" "}
                  Confirmer{" "}
                </button>{" "}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
export default Dashboard;
