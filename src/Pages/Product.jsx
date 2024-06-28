import React, { useContext, useState } from "react";
import NavBar from "../components/NavBar";
import { EllipsisVertical, MousePointer } from "lucide-react";
import img from "../assets/p1.svg";
import { CirclePlus, MessageSquareDiff, Trash2 } from "lucide-react";
import { Info } from "lucide-react";
import useImage from "../hooks/useImage";
import { X } from "lucide-react";
import useFetch from "../hooks/useFetch";
import axios from "axios";
import toast from "react-hot-toast";
import erroImg from "../assets/error.png";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
const apiLink = import.meta.env.VITE_API_URL;
import { useQueryClient } from "@tanstack/react-query";
import { AppContext } from "../AppProvider";

function Product() {
  const [open, setopen] = useState(false);
  const [addTester, setaddTester] = useState(false);
  const [currentid, setcurrentid] = useState("");
  function openaddTester(val) {
    setcurrentid(val);
    setaddTester(true);
  }
  function closeraddTester() {
    setaddTester(false);
  }
  const query = useQueryClient();
  const { searchByProduct } = useContext(AppContext);
  console.log("prodct is ", searchByProduct);

  const productQuery = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const res = await axios.get(`${apiLink}/product`);
      return res.data;
    },
  });

  function close() {
    setopen(false);
  }
  console.log(productQuery.data);
  productQuery.isError && toast.error(productQuery.error.message);

  return (
    <>
      <AddTesterToProduct
        id={currentid}
        open={addTester}
        close={closeraddTester}
      />
      <div className="w-full h-screen  overflow-y-auto ">
        <NavBar searchBy="product" serach={true} />

        <h1 className="text-xl  pl-12 font-bold mt-8 "> Product </h1>

        <div className="relative flex justify-center  ">
          <div className="justify-center px-8 bottom-20 gap-10 overflow-y-auto  my-8  flex flex-wrap  top-20  ">
            {!productQuery.isLoading && !productQuery.isError ? (
              productQuery.data.length == 0 ? (
                <p className="w-full text-center my-32 font-medium text-lg">
                  {" "}
                  aucun prouduit trouver{" "}
                </p>
              ) : (
                productQuery.data.map((pr, index) => {
                  return (
                    <>
                      {pr.ProductName.includes(searchByProduct) |
                        pr._id.includes(searchByProduct) && (
                        <ProductCard
                          openfn={openaddTester}
                          id={pr._id}
                          key={index}
                          nom={pr.ProductName}
                          image={pr.Image}
                          mark={pr.CompanyName}
                          desc={pr.description}
                        />
                      )}
                    </>
                  );
                })
              )
            ) : productQuery.isError ? (
              <div className="flex flex-col gap-8">
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
        <button
          onClick={() => setopen(true)}
          className="absolute transition hover:scale-110 bottom-14 right-16 py-2 text-white bg-main flex gap-4 items-center  text-base rounded-2xl border-2 border-main  px-4 "
        >
          Ajouter
          <CirclePlus />
        </button>
      </div>
      <AddProduct open={open} close={close} />
    </>
  );
}

function ProductCard({ openfn, id, image, nom, mark, desc }) {
  const navigate = useNavigate();
  const query = useQueryClient();
  function handleDelete() {
    console.log(id);
    axios
      .delete(`${apiLink}/product/${id}`)
      .then((res) => {
        toast.success("prouduit suprimer avec succes");
        query.invalidateQueries(["product"]);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="w-[23%] max-w-[25%] min-w-80 my-6  bg-white rounded-3xl shadow-lg shadow-black/20 flex flex-col gap-2 h-[550px] p-4 ">
      <div className="flex ml-4  my-2 justify-between items-center">
        <h2> {mark} </h2>
        <details className="dropdown dropdown-bottom dropdown-end">
          <summary className="btn w-fit hover:bg-white bg-white border-none">
            <EllipsisVertical color="#C50808" className="cursor-pointer" />
          </summary>
          <ul className="p-2 bg-white w-72 flex flex-col items-start  shadow menu dropdown-content z-[1]  rounded-box ">
            <li className="hover:bg-gray-200 w-full">
              <a
                onClick={() => navigate(`/productInfo/${id}`)}
                className="flex  items-center gap-2"
              >
                <Info /> information du prouduit
              </a>
            </li>
            <li className="hover:bg-gray-200 w-full active:bg-white focus:bg-white open:bg-white valid:bg-white ">
              <a onClick={() => openfn(id)} className="flex items-center gap-2">
                <MessageSquareDiff /> Ajouter un testeur
              </a>
            </li>
            <li className="hover:bg-gray-200 w-full">
              <a onClick={() => handleDelete()}>
                <Trash2 /> suprimer le prouduit
              </a>
            </li>
          </ul>
        </details>
      </div>
      <div className="w-full flex my-4 justify-center">
        <img src={image} alt="..." className="w-28 " />
      </div>
      <div className="flex flex-col my-4 gap-2">
        <h2 className="text-lg text-main font-semibold"> {nom} </h2>
        <p className="my-4"> {desc} </p>
      </div>
    </div>
  );
}

function AddProduct({ open, close }) {
  const query = useQueryClient();

  const [file, setfile] = useState(null);
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

  const [product, setproduct] = useState({
    ProductName: "",
    CompanyName: "",
    type: "",
    description: "",
  });

  function handleChange(data) {
    const { name, value } = data.target;
    setproduct({ ...product, [name]: value });
  }

  const AddProductMutation = useMutation({
    mutationKey: ["NewProduct"],
    mutationFn: async () => {
      console.log("test");
      try {
        const res = await axios.post(`${apiLink}/product`, {
          ...product,
          Image: url,
        });
        console.log(res);
        return res;
      } catch (err) {
        throw new Error(err.response.status);
      }
    },
    onSuccess: () => {
      query.invalidateQueries(["product"]);
      setfile(null);
      close();
      toast.success("Prouduit creé avec succes");
    },
    onError: (error) => {
      error.message == "413" &&
        toast.error("veuillez reduire la taille de l'image");
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ ...product, Image: url });
    if (file == null) {
      toast.error("veuillez ajouter une photo");
      return;
    }
    AddProductMutation.mutate();
  }
  function handleDetailsChange(e) {
    const text = e.target.value.trim();
    if (text.length == 0) {
      console.log("empty");
    }

    const word = text.split(/\s+/);
    if (word.length < 35) {
      handleChange(e);
    } else {
      toast.error("la descritpion dot pas depaser les 25 mots");
    }
  }

  return (
    <>
      {open && (
        <div className="w-full flex justify-center items-center h-screen  absolute bg-black/60 z-30">
          <div className="h-[650px] relative w-[80%] pt-8 PopUp flex  px-4  rounded-3xl shadow-lg shadow-black/50  bg-white">
            <button className="absolute top-6 left-6" onClick={() => close()}>
              <X size={45} color="#C50808" />
            </button>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="flex h-full w-full gap-4 "
            >
              <div className=" w-[35%] flex justify-center h-full items-center ">
                <div className="flex flex-col p-16  w-full ">
                  <div
                    onDrop={(e) => HandleDrop(e)}
                    onDragOver={(e) => e.preventDefault()}
                    className="cursor-move w-full h-full p-12 flex justify-center items-center border-dashed mb-2 mt-8 rounded-2xl border-2 border-main"
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
              </div>
              <div className="w-[65%] h-full justify-center items-center flex flex-col gap-3 px-4 ">
                <input
                  name="ProductName"
                  onChange={(e) => handleChange(e)}
                  className="bg-white border-[1px] w-full  focus:outline-none focus:border-main border-black/70 py-3 px-2 my-2"
                  type="text"
                  placeholder="Nom du prouduit"
                />
                <input
                  name="type"
                  onChange={(e) => handleChange(e)}
                  className="bg-white border-[1px] w-full  focus:outline-none focus:border-main border-black/70 py-3 px-2 my-2"
                  type="text"
                  placeholder="Type du prouduit"
                />
                <input
                  name="CompanyName"
                  onChange={(e) => handleChange(e)}
                  className="bg-white border-[1px] w-full  focus:outline-none focus:border-main border-black/70 py-3 px-2 my-2"
                  type="text"
                  placeholder=" Nom de l'entreprise "
                />
                <textarea
                  name="description"
                  onChange={(e) => handleDetailsChange(e)}
                  className="bg-white border-[1px] h-32  w-full focus:outline-none focus:border-main border-black/70 py-3 px-2 my-2"
                  type="text"
                  placeholder="Descritpion du prouduit"
                />
                <button
                  disabled={AddProductMutation.isPending == true}
                  type="submit"
                  className={` text-white py-3  w-full text-center ${
                    AddProductMutation.isPending ? "bg-gray-500" : "bg-main"
                  }`}
                >
                  {" "}
                  Confirmer{" "}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function AddTesterToProduct({ open, close, id }) {
  const query = useQueryClient()
  const [testerid, settesterid] = useState("");
  const getTesterId = useQuery({
    queryKey: ["getTesterId"],
    queryFn: async () => {
      const res = await axios.get(`${apiLink}/user/tester/${testerid}`);
      console.log(res);
      return res.data;
    },
  });

  const addTesterToProductMutation = useMutation({
    mutationKey: ["addTesterToProduct"],
    mutationFn: async () => {
      try {
        const res = axios.post(`${apiLink}/product/addTester/${id}`, {
          TesterId: getTesterId.data.data._id,
        });
        console.log("res");
        return res.data;
      } catch (err) {
        throw new Error(err);
      }
    },
   
    onSuccess : () => {
      toast.success('testeur ajouter avec succes')
      settesterid("")
      close();
    }
  });

  return (
    <>
      {open && (
        <div className="w-full flex justify-center items-center h-screen  absolute bg-black/60 z-30">
          <div className="h-fit relative w-[700px] pt-8 PopUp   px-4  rounded-3xl shadow-lg shadow-black/50  bg-white">
            <button className="absolute top-6 left-6" onClick={() => close()}>
              <X size={45} color="#C50808" />
            </button>
            <h2 className="text-xl font-medium text-main px-4 mb-4 mt-20">
              {" "}
              Ajouter un testeur{" "}
            </h2>
            <form onSubmit={(e) => e.preventDefault()} className="px-4 py-8">
              <label> Ajouter l'id du testeur </label>
              <input
                required
                onChange={(e) => {
                  settesterid(e.target.value);
                  query.invalidateQueries(["getTesterId"])
                }}
                className="in"
                type="text"
                placeholder="ddcbn98d7fhj7....."
              />

              <div className="w-full flex py-10 justify-center ">
                {testerid == "" ? (
                  <div ></div>
                ) : (
                  getTesterId.isLoading ? <div className="loader"></div> : <button
                    type="submit"
                    onClick={() => addTesterToProductMutation.mutate()}
                    className="py-2 px-4 border-2 border-main hover:bg-main hover:text-white  bg-white  text-main hover:scale-105 transition rounded-2xl"
                  >
                    {" "}
                    Ajouter un testeur{" "}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Product;
