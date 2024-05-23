import { useContext, useRef } from "react";
import AnimationWrapper from "../common/page-animation.jsx";
import InputBox from "../components/input.component.jsx";
import googleIcon from "../imgs/google.png"
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast"
import axios from "axios"
import { storeIsSession } from "../common/session.jsx";
import { UserContext } from "../App.jsx";
import { authWithGoogle } from "../common/firebase.jsx";

const UserAuthForm = ({ type }) => {

    let { userAuth: { access_token }, setUserAuth  } = useContext(UserContext);



    const UserAuthThroughServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                storeIsSession("user", JSON.stringify(data))
                setUserAuth(data)
                return toast.success("Signed in successfully")
            })
            .catch(({ response }) => {
                toast.error(response.data.error)
            })


    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;


        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData;

        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Fullname must be atleast 3 letters long"
                )
            }
        }

        if (!email.length) {
            return toast.error("Email cannot be empty"
            )
        }

        if (!emailRegex.test(email)) {
            return toast.error("email is invalid")
        }

        if (type != "sign-in") {
            if (!passwordRegex.test(password)) {
                return toast.error("password should be atleast 6 characters long and should contain atleast 1 uppercase letter, 1 lowercase letter and 1 number"
                )
            }
        }

        UserAuthThroughServer(serverRoute, formData);

    }

    const handleGoogleAuth = (e) => {
        e.preventDefault();
        authWithGoogle().then((user) => {
            let serverRoute = "/google-auth";

            let formData = {
                access_token: user.accessToken
            }

            UserAuthThroughServer(serverRoute, formData)

        })
        .catch((error) => {
            toast.error('Error signing in with Google')
            return console.log(error)
        })
    }

    return (
        access_token ? <Navigate to={"/"} /> :
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster />
                <form id="formElement" className="w-[80%] max-w-[400px] ">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type == "sign-in" ? "Welcome back" : "Join us today"}
                    </h1>
                    {
                        type != "sign-in" ? <InputBox name="fullname" type="text" id="username" placeholder="Full Name" icon="fi fi-rr-user" /> : ""
                    }
                    <InputBox name="email" type="email" id="email" placeholder="Email" icon="fi fi-rr-envelope" />
                    <InputBox name="password" type="password" id="password" placeholder="Password" icon="fi fi-rr-key" />

                    <button className="btn-dark center mt-14"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        {type.replace("-", " ")}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />
                    </div>

                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center "
                        onClick={handleGoogleAuth}
                    >
                        <img src={googleIcon} className="w-5" />
                        Continue with google
                    </button>


                    {

                        type == "sign-in" ?
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Don't have an account?
                                <Link to="/signup" className="underline text-black text-xl ml-1">
                                    Join us today
                                </Link>
                            </p>
                            :
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Already a member ?
                                <Link to="/signin" className="underline text-black text-xl ml-1">
                                    Sign in here.
                                </Link>
                            </p>
                    }
                </form>
            </section>
        </AnimationWrapper>
    )
}

export default UserAuthForm;