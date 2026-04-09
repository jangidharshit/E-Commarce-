import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // 🔥 FIXED ADD TO CART
  const addProduct = (product) => {
    const updatedProduct = {
      ...product,
      image: product.thumbnail || product.image, // ✅ FIX
    };

    dispatch(addCart(updatedProduct));
    toast.success("Added to cart");
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://dummyjson.com/products");

        if (!response.ok) throw new Error("API failed");

        const result = await response.json();

        setData(result.products);
        setFilter(result.products);
      } catch (error) {
        console.log("API failed, loading local JSON");

        const local = await fetch("/products.json");
        const localData = await local.json();

        setData(localData);
        setFilter(localData);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 text-center py-5">
          <Skeleton height={40} width={500} />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="col-md-4 col-sm-6 col-12 mb-4">
            <Skeleton height={400} />
          </div>
        ))}
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        {/* FILTER */}
        <div className="buttons text-center py-5">
          <button className="btn btn-outline-dark m-2" onClick={() => setFilter(data)}>
            All
          </button>
          <button className="btn btn-outline-dark m-2" onClick={() => filterProduct("smartphones")}>
            Smartphones
          </button>
          <button className="btn btn-outline-dark m-2" onClick={() => filterProduct("laptops")}>
            Laptops
          </button>
          <button className="btn btn-outline-dark m-2" onClick={() => filterProduct("fragrances")}>
            Fragrances
          </button>
          <button className="btn btn-outline-dark m-2" onClick={() => filterProduct("skincare")}>
            Skincare
          </button>
        </div>

        {/* PRODUCTS */}
        {filter.map((product) => (
          <div key={product.id} className="col-md-4 col-sm-6 col-12 mb-4">
            <div className="card text-center h-100">

              <img
                className="card-img-top p-3"
                src={product.thumbnail || product.image}
                alt={product.title}
                height={250}
              />

              <div className="card-body">
                <h5>{product.title.substring(0, 15)}...</h5>
                <p>{product.description.substring(0, 80)}...</p>
              </div>

              <ul className="list-group">
                <li className="list-group-item">₹ {product.price}</li>
              </ul>

              <div className="card-body">
                {/* 🔥 BUY NOW FIX */}


                <button
                  className="btn btn-dark w-100"
                  onClick={() => addProduct(product)}
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="container py-3">
      <h2 className="text-center">Latest Products</h2>
      <hr />
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

export default Products;