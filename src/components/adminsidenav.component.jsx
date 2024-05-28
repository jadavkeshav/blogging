import { useContext, useEffect, useRef, useState } from "react"
import { NavLink, Navigate, Outlet } from "react-router-dom"
import { UserContext } from "../App"
import Loader from "./loader.component";

const AdminSideNav = () => {
    let { userAuth} = useContext(UserContext);

    let page = location.pathname.split("/")[2];

    let [pageState, setPageState] = useState(page.replace("-", " "));
    let [showSideNav, setShowSideNav] = useState(false);
    let [loading, setLoading] = useState(true);

    let activeTabLine = useRef();
    let sideBarIconTab = useRef();
    let pageStateTab = useRef();

    const changePageState = (e) => {
        let { offsetWidth, offsetLeft } = e.target;

        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        if (e.target == sideBarIconTab.current) {
            setShowSideNav(true);
        } else {
            setShowSideNav(false);
        }

    }

    useEffect(() => {
        if (userAuth && userAuth.isAdmin !== undefined) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [userAuth]);

    useEffect(() => {
        setShowSideNav(false);
        // pageStateTab.current.click();
    }, [pageState])

    if (loading) {
        return <Loader/>; // Or any loading indicator you prefer
    }

    return (
        userAuth && userAuth.isAdmin ? 
        userAuth.access_token === null ? <Navigate to="/signin" /> :
            <>
                <section className=" relative flex gap-10 py-0 m-0 max-md:flex-col     ">
                    <div className="sticky top-[80px] z-30 ">


                        <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-a-auto  " >
                            <button onClick={changePageState} ref={sideBarIconTab} className="p-5 capitalize">
                                <i className="fi fi-rr-bars-staggered pointer-events-none "></i>
                            </button>
                            <button onClick={changePageState} ref={pageStateTab} className="p-5 capitalize" >
                                {pageState}
                            </button>
                            <hr ref={activeTabLine} className="absolute bottom-0 duration-500" />
                        </div>


                        <div className={" min-w-[200px] h-[clac(100vh-80px-60px)]   md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%-80px)] max-md:px-16 max-md:-ml-7 duration-500 " + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")}>
                            <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
                            <hr className=" border-grey mb-8 -ml-6 mr-6" />

                            <NavLink className="sidebar-link" to="/admin/blogs" onClick={(e) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-document "></i>
                                Blogs
                            </NavLink>

                            <NavLink className="sidebar-link" to="/admin/users" onClick={(e) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-user"></i>
                                Users
                            </NavLink>

                            <NavLink className="sidebar-link" to="/admin/request" onClick={(e) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-users"></i>
                                Users Request
                            </NavLink>

                            <h1 className="text-xl text-dark-grey mt-20 mb-3">Settings</h1>
                            <hr className=" border-grey mb-8 -ml-6 mr-6" />

                            <NavLink className="sidebar-link" to="/settings/edit-profile" onClick={(e) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-file-user "></i>
                                Edit Profile
                            </NavLink>

                            <NavLink className="sidebar-link" to="/settings/change-password" onClick={(e) => setPageState(e.target.innerText)}>
                                <i className="fi fi-rr-lock "></i>
                                Change Password
                            </NavLink>



                        </div>
                    </div>

                    <div className="max-md:-mt-8 mt-5 w-full">
                        <Outlet />
                    </div>
                </section>
            </> : <Navigate to="/signin" />
    ) 
}
export default AdminSideNav