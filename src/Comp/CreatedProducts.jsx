import React, { useEffect, useState } from "react";
import { account, DataBases } from "../Auth/Config";
import Shop from "./Shop";
import { Query } from "appwrite";

function CreatedProducts() {
  const [products, setProducts] = useState([]);

  const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
  const tableId = import.meta.env.VITE_APPWRITE_MyProductsTable_ID;

  function mapProduct(doc) {
    return {
      id: doc.$id,
      title: doc.title,
      price: doc.price,
      img: doc.ImgLink,
      category: doc.category,
      detail: doc.description,
    };
  }

  async function fetchProducts() {
    try {
      // let user = await account.get()
      const res = await DataBases.listDocuments(
        databaseId, tableId,
        [
          // Query.equal('userId',user.$id),
          Query.orderAsc("$createdAt"),
        ]
      );
      setProducts(res.documents.map(mapProduct));
    } catch (err) {
      console.log("Error loading products:", err);
    }
  }

  useEffect(() => {
    fetchProducts();
  });

  return (
    <Shop products={products} />
  );
}

export default CreatedProducts;
