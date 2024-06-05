import axios from "axios"
import AnimationWrapper from "../common/page-animation"
import InPageNavigation, { activeTabRef } from "../components/inpage-navigation.component"
import { useEffect, useState } from "react"
import Loader from "../components/loader.component"
import BlogPostCard from "../components/blog-post.component"
import MinimalBlogPost from "../components/nobanner-blog-post.component"
import NoDataMessgae from "../components/nodata.component"
import { filterPaginationData } from "../common/filter-pagination-data"
import LoadMoreDataBtn from "../components/load-more.component"

const HomePage = () => {

    let [blogs, setBlog] = useState(null)
    let [trendinBlogs, setTrendingBlogs] = useState(null)
    let [pageState, setPageState] = useState("home");
    let [categories, setCategories] = useState(null);

    const fetchTags = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/tags")
            .then(({ data }) => {
                setCategories(data);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const fetchLatestBlogs = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
            .then(async ({ data }) => {
                console.log(data.blogs)
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/all-latest-blogs-count",
                })
                console.log(formatedData)

                setBlog(formatedData);
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
            .then(({ data }) => {
                setTrendingBlogs(data.blogs);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const fetchBlogByCategory = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState, page })
            .then(async ({ data }) => {

                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { tag: pageState }
                })
                console.log(formatedData)

                setBlog(formatedData);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const loadBlogByCategory = (category) => {
        // let category = e.target.innerText.toLowerCase();
        setBlog(null);

        if (pageState === category) {
            setPageState("home");
            return;
        }

        setPageState(category);

    }

    useEffect(() => {
        fetchTags();
    }, [])

    useEffect(() => {

        activeTabRef.current.click();


        if (pageState === "home") {
            fetchLatestBlogs({ page: 1 });
        }
        else {
            fetchBlogByCategory({ page: 1 });
        }

        if (!trendinBlogs) {
            fetchTrendingBlogs();
        }

        console.log("my ->>",blogs)

    }, [pageState])

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* lates blog */}
                <div className="w-full">
                    <InPageNavigation routes={[pageState, 'Trending']} defaultHidden={['Trending']} >

                        <>
                            {
                                blogs === null ? <Loader /> :
                                    blogs.results.length ?
                                        blogs.results.map((blog, i) => {
                                            return <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                                <BlogPostCard key={i} content={blog} author={blog.author.personal_info} />
                                            </AnimationWrapper>
                                        })
                                        : <NoDataMessgae message={"No blogs Published "} />
                            }
                            <LoadMoreDataBtn state={blogs} fetchDataFun={(pageState === "home" ? fetchLatestBlogs : fetchBlogByCategory)} />
                        </>

                        {
                            trendinBlogs === null ? <Loader /> :

                                trendinBlogs.length ?
                                    trendinBlogs.map((blog, i) => {
                                        return <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                            <MinimalBlogPost blog={blog} index={i} />
                                        </AnimationWrapper>
                                    }) : <NoDataMessgae message={"No Trending blogs Published"} />
                        }
                    </InPageNavigation>
                </div>
                {/* terending blogs */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className=" font-medium text-xl mb-8 ">
                                Stories from around the web
                            </h1>
                            <div className="flex gap-3 flex-wrap">
                                {
                                    categories ?  categories.map((category, i) => {
                                        return <button onClick={() => loadBlogByCategory(category)} key={i} className={"tag " + (pageState == category ? " bg-black text-white" : "")} >{category}</button>
                                    }) : ""
                                }

                            </div>
                        </div>
                        <div className="font-medium text-xl mb-8 " >
                            <i className="fi fi-rr-arrow-trend-up text-xl"></i>
                            {
                                trendinBlogs === null ? <Loader /> :
                                    trendinBlogs.length ?
                                        trendinBlogs.map((blog, i) => {
                                            return <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                                <MinimalBlogPost blog={blog} index={i} />
                                            </AnimationWrapper>
                                        }) : <NoDataMessgae message={"No Trending blogs Published"} />
                            }
                        </div>
                    </div>
                </div>

            </section>
        </AnimationWrapper>
    )

}

export default HomePage