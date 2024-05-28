import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { filterPaginationData } from "../common/filter-pagination-data"
import { Toaster, toast } from "react-hot-toast"
import InPageNavigation from "../components/inpage-navigation.component"
import Loader from "../components/loader.component"
import NoDataMessgae from "../components/nodata.component"
import AnimationWrapper from "../common/page-animation"
import LoadMoreDataBtn from "../components/load-more.component"
import { useSearchParams } from "react-router-dom"
import { AdminBlogs } from "../components/adminblogs.component"

const AdminManageBlogs = () => {

    const [blogs, setBlogs] = useState(null)
    const [query, setQuery] = useState("")


    let { userAuth: { access_token, isAdmin } } = useContext(UserContext)

    const getBlogs = ({ page, deletedDocCount = 0 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-all-blogs", { page, deletedDocCount }, 
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    user: access_token,
                    countRoute: "/get-all-user-written-blogs-count",
                    data_to_send: { query }
                })
                setBlogs(formatedData)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (access_token) {
            if (blogs == null) {
                getBlogs({ page: 1 })
            }
        }
    }, [access_token, blogs, query])



    const handleSearch = (e) => {

        let searchQuery = e.target.value;
        setQuery(searchQuery);
        if (e.key === "Enter" && searchQuery.length) {
            setBlogs(null);
        }

    }
    const handleChange = (e) => {
        if (!e.target.value.length) {
            setQuery("");
            setBlogs(null);
        }
    }

    // console.log("first --- >>>> ", blogs.results[0].deleteDocCount)
    return (
        <>
            <h1 className="max-md:hidden" >Manage Blogs</h1>
            <Toaster />
            <div className=" relative max-md:mt-5 md:mt-8 mb-10 ">
                <input
                    type="search"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
                    placeholder="Search Blogs"
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey "></i>
            </div>

            <InPageNavigation routes={[" User Published Blogs"]} >
                {/* published blogs */}
                {
                    blogs == null ? <Loader /> :
                        blogs.results.length ?
                            <>
                                {
                                    blogs.results.map((blog, i) => {
                                        return <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.04 }}   >
                                            <AdminBlogs blog={{ ...blog, index: i, setStateFunc: setBlogs }} />
                                        </AnimationWrapper>
                                    })
                                }
                                <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} additionalParam={{ draft: false, deletedDocCount: blogs.deletedDocCount }} />
                            </>
                            : <NoDataMessgae message="No Blogs Published" />
                }
            </InPageNavigation>

        </>
    )
}

export default AdminManageBlogs