import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmi1jWwVMMDkUF8s92hE1wxWliRi__fv4",
  authDomain: "blog-fa6d3.firebaseapp.com",
  projectId: "blog-fa6d3",
  storageBucket: "blog-fa6d3.appspot.com",
  messagingSenderId: "795787416573",
  appId: "1:795787416573:web:c31084ee3dd3472bc23f94",
  measurementId: "G-ZKV0GEYZBL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



//google auth provider

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider)
    .then((result)=>{
        user = result.user;
    })
    .catch((error)=>{
        console.log(error);
    })

    return user;
}