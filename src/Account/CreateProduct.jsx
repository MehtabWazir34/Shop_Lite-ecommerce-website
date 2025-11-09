import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { DataBases, ID, account, storage } from "../Auth/Config";
import MyInput from "../MiniParts/MyInput";

function CreateProduct({isDark}) {
  const databaseId = import.meta.env.VITE_APPWRITE_DB_ID;
  const myProductsTable = import.meta.env.VITE_APPWRITE_MyProductsTable_ID;
const bucketId = import.meta.env.VITE_APPWRITE_ProductsImagesBucket;

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  // ✅ Image Selection + Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ✅ Remove Image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  // ✅ Form Validation
  const isFormValid =
    imageFile && title && price && category && description;

  // ✅ Create Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {
      let user = await account.get(); 
      const uploadedImg = await storage.createFile(
        bucketId,
        ID.unique(),
        imageFile
      );

      const imageUrl = storage.getFileView(
        bucketId,
        uploadedImg.$id
      );

      // const product =
       await DataBases.createDocument(
        databaseId,
        myProductsTable,
        ID.unique(),
        {
          userId: user.$id,
          title,
          price: Number(price),
          category,
          description,
          ImgLink: imageUrl,
        }
      );

      toast.success("Product added successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error("❌ Failed to upload product");
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent top-14 relative flex items-center justify-center pb-16 p-6">
      <Toaster className="top-center" />

      <div className={` ${isDark ? 'bg-blue-950/90': 'bg-white'} w-full max-w-xl p-2 mt-2 rounded-2xl shadow-lg `}>

        <h1 className="text-2xl font-bold mb-5 text-center">
          Add New Product
        </h1>

        {/* ✅ IMAGE UPLOAD */}
        <div className="mb-5 flex flex-col items-center">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                className="h-48 w-48 object-cover rounded-xl border"
                alt="Preview"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-black bg-opacity-60 
                text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="cursor-pointer bg-gray-200 p-3 rounded-lg w-full text-center border border-gray-400">
              Upload Product Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Input fields for product item. */}
        <div className="flex flex-col gap-3">
          
          <MyInput type={"text"} req={'required'} name={'Title'} placeHolder={'Write title here'} id={'Title'}
          onChange={(a)=>setTitle(a.target.value)} />
          <MyInput type={"number"} req={'required'} name={'Price'} placeHolder={'Enter Price'} id={'Price'}
          onChange={(a)=>setPrice(a.target.value)} />
          <MyInput type={"text"} req={'required'} name={'Category'} placeHolder={'Write Category i.e shoe, cloth, watch'} id={'Category'}
          onChange={(a)=>setCategory(a.target.value)} />

          <textarea
            placeholder="Description (Max 1000 letters)"
            className="w-full p-2 outline-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white text-gray-800 placeholder-gray-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/*  SHARE BUTTON */}
        <button
          disabled={!isFormValid}
          onClick={handleCreateProduct}
          className={`mt-5 w-full py-3 rounded-lg font-semibold text-white ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Share Product
        </button>
      </div>
    </div>
  );
}

export default CreateProduct;
