import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component.jsx"
import UserAuthForm from "./pages/userAuthForm.page.jsx";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session.jsx";
import Editor from "./pages/editor.pages.jsx";
import HomePage from "./pages/home.page.jsx";
import SearchPage from "./pages/search.page.jsx";
import PageNotFound from "./pages/404.page.jsx";
import ProfilePage from "./pages/profile.page.jsx";
import BlogPage from "./pages/blog.page.jsx";
import SideNav from "./components/sidenavbar.component.jsx";
import ChangePassword from "./pages/change-password.page.jsx";
import EditProfile from "./pages/edit-profile.page.jsx";
import Notifications from "./pages/notifications.page.jsx";
import ManageBlogs from "./pages/manage-blogs.page.jsx";
import AdminDash from "./components/admin.component.jsx";
import AdminSideNav from "./components/adminsidenav.component.jsx";
import { AdminBlogs } from "./components/adminblogs.component.jsx";
import AdminManageBlogs from "./pages/admin-manage-blogs.page.jsx";
import AdminUsers from "./pages/admin-user.page.jsx";
import UserRequests from "./pages/admin-user-requestes.page.jsx";
import axios from "axios";



export const UserContext = createContext({})

export const ThemeContext = createContext({})

const darkThemePreference = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

const App = () => {

    const [userAuth, setUserAuth] = useState({});
    const [theme, setTheme] = useState(() => darkThemePreference() ? "dark" : "light");

    useEffect(() => {

        let userInSession = lookInSession("user");
        let themeInSession = lookInSession("theme");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });

        if (themeInSession) {
            setTheme(() => {
                document.body.setAttribute("data-theme", themeInSession);
                return themeInSession;
            });
        } else {
            document.body.setAttribute("data-theme", theme)
        }

    }, [])

    setTimeout(() => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/")
    }, 500)

  

    return (
        <ThemeContext.Provider value={{ theme, setTheme }} >
            <UserContext.Provider value={{ userAuth, setUserAuth }}>
                <Routes>
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/editor/:blog_id" element={<Editor />} />
                    <Route path="/" element={<Navbar />} >
                        <Route index element={<HomePage />} />
                        <Route path="admin" element={<AdminSideNav />}>
                            <Route path="dashboard" element={<AdminDash />} />
                            <Route path="blogs" element={<AdminManageBlogs />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="request" element={<UserRequests />} />
                        </Route>
                        <Route path="dashboard" element={<SideNav />} >
                            <Route path="blogs" element={<ManageBlogs />} />
                            <Route path="notifications" element={<Notifications />} />
                        </Route>
                        <Route path="settings" element={<SideNav />} >
                            <Route path="edit-profile" element={<EditProfile />} />
                            <Route path="change-password" element={<ChangePassword />} />
                        </Route>
                        <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                        <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                        <Route path="search/:query" element={<SearchPage />} />
                        <Route path="user/:id" element={<ProfilePage />} />
                        <Route path="blog/:blog_id" element={<BlogPage />} />

                        <Route path="*" element={<PageNotFound />} />
                    </Route>
                </Routes>
            </UserContext.Provider>
        </ThemeContext.Provider>
    )
}

export default App;