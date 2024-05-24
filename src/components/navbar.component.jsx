import { useContext, useEffect, useState } from 'react'
import darkLogo from "../imgs/logo-dark.png"
import lightLogo from "../imgs/logo-light.png"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { ThemeContext, UserContext } from '../App';
import UserNavigationPanel from './user-navigation.component';
import axios from 'axios';
import { storeIsSession } from '../common/session';
const Navbar = () => {

    const [searchBoxVisiblity, setSearchBoxVisiblity] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false);

    let { theme, setTheme } = useContext(ThemeContext);

    let navigate = useNavigate();

    const { userAuth, userAuth: { access_token, profile_img, new_notification_available }, setUserAuth } = useContext(UserContext);

    useEffect(() => {
        if (access_token) {
            axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
                .then(({ data }) => {
                    setUserAuth({ ...userAuth, ...data })
                })
                .catch(err => console.log(err))
        }
    }, [access_token])

    const handleUserNavPanel = () => {
        setUserNavPanel(currentval => !currentval);
    }

    const handleSearch = (e) => {
        let query = e.target.value;
        console.log(e)

        if (e.key === "Enter" && query.length) {
            navigate(`/search/${query}`)
        }

    }
    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 200)
    }

    const changeTheme = () => {
        let newTheme = theme == "light" ? "dark" : "light";

        setTheme(newTheme);

        document.body.setAttribute("data-theme", newTheme)


        storeIsSession("theme", newTheme);
    }


    return (
        <>
            <nav className="navbar z-50 ">

                <Link to="/" className='flex-none w-10' >
                    <div className='logo'>
                        <img src={theme == "light" ? darkLogo : lightLogo} alt="logo" />
                    </div>
                </Link>



                <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchBoxVisiblity ? "show" : "hide")}>
                    <input type="text"
                        onKeyDown={handleSearch}
                        placeholder='Search'
                        className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12  '
                    />
                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey  "></i>
                </div>

                <div className="flex item-center gap-3 md:gap-6 ml-auto ">
                    <button className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center '
                        onClick={() => setSearchBoxVisiblity(currentval => (!currentval))}
                    >
                        <i className='fi fi-rr-search text-xl '></i>
                    </button>

                    <Link to={"/editor"} className='hidden md:flex gap-2 link'>
                        <i className='fi fi-rr-file-edit'></i>
                        <p>write</p>
                    </Link>

                    <button className='bg-grey w-12 h-12 rounded-full relative hover:bg-black/10' onClick={changeTheme} >
                        <i className={" text-2xl block mt-1 fi fi-rr-" + (theme == "light" ? "moon-stars" : "sun")} ></i>
                    </button>

                    {
                        access_token ?
                            <>
                                <Link to="/dashboard/notifications">
                                    <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                                        <i className='fi fi-rr-bell text-2xl block mt-1'></i>
                                        {
                                            new_notification_available ?
                                                <span className='bg-red h-3 w-3 rounded-full absolute z-10 top-2 right-2'></span>
                                                : ""
                                        }
                                    </button>
                                </Link>
                                <div className='relative  ' onClick={handleUserNavPanel} onBlur={handleBlur}>
                                    <button className='w-12 h-12 mt-1'>
                                        <img src={profile_img} alt="profile" className='w-full h-full rounded-full object-cover' />
                                    </button>
                                    {
                                        userNavPanel ? <UserNavigationPanel /> : ""
                                    }

                                </div>
                            </>
                            :
                            <>
                                <Link className='btn-dark py-2' to="/signin">
                                    Sign In
                                </Link>
                                <Link className='btn-light py-2 hidden md:block' to="/signup">
                                    Sign Up
                                </Link>
                            </>
                    }


                </div>



            </nav>

            <Outlet />
        </>
    )
}


export default Navbar;