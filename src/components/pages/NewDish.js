import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase";
import { useHistory } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";

const NewDish = () => {
  //state for uploading
  const [uploading, setUploading] = useState(false);
  const [progres, setProgres] = useState(0);
  const [imageLink, setImageLink] = useState("");
  //for context
  const { firebase } = useContext(FirebaseContext);

  //hook for navigation using router dom

  //const navigate = useNavigate();
  const history = useHistory();
  // validation and reading the form data
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      category: "",
      image: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Item name Must be More than 3 letters")
        .required("Please enter Item Name"),
      price: Yup.number()
        .min(1, "Price must be a valid number")
        .required("Please enter price"),
      category: Yup.string().required("Please choose a category"),
      description: Yup.string()
        .min(25, "Please enter description about the item")
        .required("You need to enter a valid Description"),
    }),
    onSubmit: (dish) => {
      try {
        dish.existence = true;
        dish.image = imageLink;
        firebase.db.collection("products").add(dish);
        history.push("/menu");
      } catch (error) {
        console.log(error);
      }
    },
  });
  //to upload images
  const handleUploadStart = () => {
    setProgres(0);
    setUploading(true);
  };
  const handleUploadError = (error) => {
    setUploading(false);
    console.log(error);
  };
  const handleProgress = (progres) => {
    setProgres(progres);
    console.log(progres);
  };
  const handleUploadSuccess = async (name) => {
    setProgres(100);
    setUploading(false);
    const url = await firebase.storage
      .ref("products")
      .child(name)
      .getDownloadURL();

    setImageLink(url);
  };

  return (
    <>
      <h1 className="text-3xl font-light mb-4">NewDish</h1>
      <div className="flex justify-center mt-10">
        <div className="max-w-3xl w-full">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Dish Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">fix error:</p>
                <p>{formik.errors.name} </p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="price"
              >
                Price
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="number"
                placeholder="$30"
                min="0"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.price && formik.errors.price ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">fix error:</p>
                <p>{formik.errors.price} </p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Category
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">-- Select --</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="drinks">Drinks</option>
                <option value="dessert">Starter</option>
              </select>
            </div>
            {formik.touched.category && formik.errors.category ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">fix error:</p>
                <p>{formik.errors.category} </p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="image"
              >
                image
              </label>
              <FileUploader
                accept="image/*"
                id="image"
                name="image"
                randomizeFilename
                storageRef={firebase.storage.ref("products")}
                onUploadStart={handleUploadStart}
                onUploadError={handleUploadError}
                onUploadSuccess={handleUploadSuccess}
                onProgress={handleProgress}
              />
            </div>
            {uploading && (
              <div className="h-12 relative w-full border">
                <div
                  className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                  style={{ width: `${progres}%` }}
                >
                  {progres} %
                </div>
              </div>
            )}
            {imageLink && (
              <p className="bg-green-500 text-white p-3 text-center my-5">
                image successfully uploaded
              </p>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                id="description"
                type="text"
                placeholder="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></textarea>
            </div>
            {formik.touched.description && formik.errors.description ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">fix error:</p>
                <p>{formik.errors.description} </p>
              </div>
            ) : null}
            <input
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
              value="Add Dish"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default NewDish;
