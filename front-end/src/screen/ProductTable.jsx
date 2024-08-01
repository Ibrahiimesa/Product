import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../redux/productSlice";
import ModalProduct from "../components/ModalProduct";
import ProductForm from "../components/ProductForm";
import Swal from "sweetalert2";

const ProductTable = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    price: "",
    discount: "",
  });

  const initalFormData = {
    product_name: "",
    category: "",
    price: "",
    discount: "",
  };

  useEffect(() => {
    if (isEditing && editProduct) {
      setFormData({
        product_name: editProduct.product_name,
        category: editProduct.category,
        price: editProduct.price,
        discount: editProduct.discount || "",
      });
    }
  }, [editProduct, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateProduct({ id: editProduct.id, updatedProduct: formData }));
    } else {
      dispatch(createProduct(formData))
        .then(() => dispatch(fetchProducts()))
        .catch((error) => console.log(error));  
    }
    handleCloseModal();
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteProduct(id));
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditProduct(product);
      setIsEditing(true);
    } else {
      setEditProduct(null);
      setIsEditing(false);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    setFormData(initalFormData);
  };

  return (
    <div className="p-6">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl">Product</h1>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto"
        >
          Add
        </button>
      </div>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>{error}</p>}
      {status === "succeeded" && products.length === 0 && (
        <p>No products available.</p> 
      )}
      {status === "succeeded" && products.length > 0 && (
        <div className=" bg-white shadow overflow-hidden sm:rounded-lg  mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 bg-gray-60"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.discount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2 justify-start">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-sm bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ModalProduct
        open={modalOpen}
        onClose={handleCloseModal}
        title={isEditing ? "Edit Product" : "Add Product"}
        body={
          <ProductForm
            onClose={handleCloseModal}
            isEdit={isEditing}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        }
      />
    </div>
  );
};

export default ProductTable;
