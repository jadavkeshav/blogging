import Embed from "@editorjs/embed"
import List from "@editorjs/list"
import Image from "@editorjs/image"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import Header from "@editorjs/header"
import InlineCode from "@editorjs/inline-code"
import { uploadImage } from "../common/aws"
import axios from "axios"

const uploadImageByURL = (url) => {
    let formData = new FormData();
    formData.append("file", url);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    return axios.post(import.meta.env.VITE_CLOUDINARY_API, formData)
        .then(response => {
            if (response.data.url) {
                return {
                    success: 1,
                    file: {
                        url: response.data.url
                    }
                }
            }
        })
        .catch(error => {
            console.error("Error uploading image:", error);
            return {
                success: 0,
                file: {
                    url: ""
                },
                error: "Error uploading image"
            }
        });
}
const uploadImageByFILE = (file) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    return axios.post(import.meta.env.VITE_CLOUDINARY_API, formData)
        .then(response => {
            if (response.data.url) {
                return {
                    success: 1,
                    file: {
                        url: response.data.url
                    }
                }
            }
        })
        .catch(error => {
            console.error("Error uploading image:", error);
            return {
                success: 0,
                file: {
                    url: ""
                },
                error: "Error uploading image"
            }
        });
}

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true,
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByURL,
                uploadByFile: uploadImageByFILE,


            }
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    marker: Marker,
    header: {
        class: Header,
        config: {
            placeholder: "Type heading........",
            levels: [2, 3, 4],
            defaultLevel: 2
        }
    },
    inlineCode: InlineCode
}