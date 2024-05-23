// import axios from "axios";

// export const uploadImage = async (img) => {
//     let imgURL = null;

//     await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
//         .then(async ({ data: { uploadURL } }) => {
//             await axios({
//                 method: "PUT",
//                 url: uploadURL,
//                 headers: {
//                     "Content-Type": "multipart/form-data"
//                 },
//                 data: img
//             })
//                 .then(() => {
//                     imgURL = uploadURL.split("?")[0];
//                 })
//         })

//     return imgURL;
// }

// import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

// cloudinary.config({
//     cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
//     api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
//     api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
// });

export const uploadImage = async (img) => {
    try {
        let imgURL = null;
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", "myblog");
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        axios.post(import.meta.env.VITE_CLOUDINARY_API, data)
            .then((data) => {
                console.log("first", data.data.url)
                imgURL = data.data.url
                return imgURL
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
                return null;
            });
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
};