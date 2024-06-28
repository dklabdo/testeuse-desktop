import React from "react";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import erroImg from "../assets/error.png";

const apiLink = import.meta.env.VITE_API_URL;

function ProductInfo() {
  const query = useQueryClient();

  const { id } = useParams();
  const SingleProductQuery = useQuery({
    queryKey: ["singleProduct", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`${apiLink}/product/${id}`);
        return res.data;
      } catch (err) {
        throw new Error(err);
      }
    },
  });
  console.log(SingleProductQuery.data);
  console.log(SingleProductQuery.isLoading);
  console.log(SingleProductQuery.isError);

  return (
    <div className="w-full overflow-x-hidden overflow-y-hidden h-screen">
      <NavBar link="product" />
      <div className="w-full my-4   overflow-y-auto ">
        {!SingleProductQuery.isLoading && !SingleProductQuery.isError ? (
          <DisplayProduct product={SingleProductQuery.data} />
        ) : SingleProductQuery.isLoading ? (
          <div className="w-full h-full flex justify-center py-20  ">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <img src={erroImg} alt="..." className="w-96 mx-auto" />
            <button
              className="btn w-fit mx-auto "
              onClick={() => query.refetchQueries(["singleProduct"], id)}
            >
              {" "}
              Reesayer{" "}
            </button>
          </div>
        )}
        <div></div>
      </div>
    </div>
  );
}

function DisplayProduct({ product }) {
  return (
    <div className="w-full h-screen   flex flex-col  ">
      <div className="w-[80%] bg-white mx-auto rounded-3xl shadow-md shadow-black/20  h-fit  justify-center  flex py-8 gap-10 items-center">
        <div className="w-[40%]  flex justify-center">
          <img src={product.Image} className="w-60 object-center" alt="..." />
        </div>

        <div className="w-[60%] pr-4 py-8 flex flex-col gap-4 ">
          <p className="font-semibold text-xl text-main ">
            {" "}
            {product.ProductName}{" "}
          </p>
          <p className="font-semibold text-base "> {product.CompanyName} </p>
          <p className="font-semibold text-base "> {product.description} </p>
        </div>
      </div>
      <div className="w-full   py-10 ">
        {product.feedBacks.map((fb, index) => {
          return <Feedback id={fb} key={index} />;
        })}
      </div>
    </div>
  );
}

function Feedback({ id }) {
  console.log(id);
  const feedbacksQuery = useQuery({
    queryKey: ["feedbacks", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`${apiLink}/feedBack/${id}`)
        console.log("res");
        return res.data;
      } catch (err) {
        throw new Error(err);
      }
    },
    
    


  });

  console.log(feedbacksQuery.error);

  return (
    <div className="w-[80%] mx-auto   rounded-3xl flex   ">
      {!feedbacksQuery.isLoading && !feedbacksQuery.isError && (
        <div>
          {feedbacksQuery.data.feedBack.Qst.map((qst, index) => {
            return (
              <div key={index}>
                <DisplayQst id={qst.qution} key={index} />
                <h2 className="text-base font-normal"> {qst.reponse} </h2>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DisplayQst({ id }) {
  const getSingleQstQuery = useQuery({
    queryKey: ["singleQuery", id],
    queryFn: async () => {
      const res = await axios.get(`${apiLink}/question/${id}`);
      console.log(res);
      return res.data;
    },
  });

  return (
    <>
      {!getSingleQstQuery.isLoading && (
        <h2 className="text-lg font-medium my-2 "> {getSingleQstQuery.data.Qustions.Qustions} </h2>
      )}
    </>
  );
}

export default ProductInfo;
