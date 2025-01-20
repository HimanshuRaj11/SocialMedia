// components/PostCard.tsx
"use client"
import React, { useState } from 'react';
import { FaThumbsUp, FaComment, FaShareAlt, FaMusic, FaBookmark } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { BiUserPlus } from "react-icons/bi";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel"
import Link from 'next/link';
import axios from 'axios';
import { useGlobalContext } from '@/context/contextProvider';
import { ImLocation2 } from 'react-icons/im';
import { toast } from 'react-toastify';
import { CommentsBox } from './Comments';
const avatarUrl = "https://www.svgrepo.com/show/327465/person-circle.svg"
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL



const PostCard = ({ post }: { post: any }) => {
    const { setSearch, setPopover, setNotificationPop, setCreatePostBtn, setLoginBtn, setRegisterBtn } = useGlobalContext()
    const handleLoginClick = () => {
        setPopover(true)
        setLoginBtn(true)
        setSearch(false)
        setNotificationPop(false)
        setCreatePostBtn(false)
        setRegisterBtn(false)
    };
    const { User: { user } } = useSelector((state: any) => state.User);
    const FileLength = post?.files.length

    const followed = user?.followings?.includes(post.user._id) || post.user._id == user?._id

    const [OpenCommentBox, setOpenCommentBox] = useState(false)
    const liked = post.likes.includes(user?._id);
    const likeOrDislikeHandler = async (Post_id: any) => {
        try {
            if (!user) {
                handleLoginClick()
                return
            }
            const action = liked ? 'dislike' : 'like';

            await axios.post(`${baseUrl}/api/v1/post/${action}`, { Post_id }, { withCredentials: true })

            return
        } catch (error) {
            return error
        }
    }
    const Bookmarked = user?.savedPost.includes(post?._id);
    const BookmarkHandler = async (Post_id: any) => {
        try {
            if (!user) {
                handleLoginClick()
                return
            }
            const action = Bookmarked ? 'unbookmarkpost' : 'bookmarkpost';

            await axios.post(`${baseUrl}/api/v1/user/${action}`, { Post_id }, { withCredentials: true })

            return
        } catch (error) {
            return error
        }
    }
    const followhandler = async (fllowUserId: any) => {
        try {
            if (!user) {
                handleLoginClick()
                return
            }
            await axios.post(`${baseUrl}/api/v1/user/follow`, { fllowUserId })
            // tost popup
            return
        } catch (error) {
            return error
        }
    }

    const [Comments, setComments] = useState(null)
    const openComments = async (comments: any) => {
        try {
            if (!user) {
                handleLoginClick();
                return;
            }
            const { data } = await axios.post(`${baseUrl}/api/v1/post/comment/getComments`, { comment_id: comments });
            setComments(data.commentsList)

            setOpenCommentBox(!OpenCommentBox);
        } catch (error) {
            return error
        }
    }

    const createdAt: number | string = post?.createdAt ?? 0;
    const createdAtDate = new Date(createdAt);
    const currentDate = new Date();

    const differenceInMilliseconds = currentDate.getTime() - createdAtDate.getTime();

    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);
    let PostTime = ""
    if (differenceInDays > 0) {
        PostTime = `${differenceInDays} days ago`;
    } else if (differenceInHours > 0) {
        PostTime = `${differenceInHours} hours ago`;
    } else if (differenceInMinutes > 0) {
        PostTime = `${differenceInMinutes} minutes ago`;
    } else {
        PostTime = `${differenceInSeconds} seconds ago`;
    }

    return (
        <div className="mx-auto w-full md:w-[80%] lg:w-[70%] cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden my-4 transition-transform transform hover:scale-101">

            <div className="flex items-center justify-between px-4 py-1">
                <div className='flex items-center'>
                    <Link href={post?.user?.username}>
                        <img className="w-10 h-10 object-cover rounded-full" src={post?.user?.profilePic?.file ? post?.user?.profilePic?.file : avatarUrl} alt="User avatar" />
                    </Link>

                    <div className="mx-3 ">
                        <Link className='flex flex-col' href={post?.user?.username}>
                            <h2 className="text-gray-800 font-semibold">{post?.user?.name}</h2>
                            <h2 className="text-gray-600 text-[13.5px] font-semibold">@{post?.user?.username}</h2>
                        </Link>
                    </div>
                    {
                        !followed ?
                            <div className='w-auto' onClick={() => followhandler(post?.user?._id)}>
                                <div className=' flex flex-row justify-center items-center text-blue-500 font-semibold border-2 border-blue-500 rounded-2xl px-2 hover:text-white hover:bg-blue-500'>Follow <BiUserPlus className=' font-semibold ml-1 text-2xl' /></div>
                            </div>
                            :
                            ""
                    }
                </div>

                <div className="float-end">
                    <button className="text-gray-600 hover:text-gray-400">
                        <HiDotsVertical />
                    </button>
                </div>
            </div>

            <div className="px-4 py-1">
                <p className="text-gray-700">{post?.caption}</p>
                <div className="flex flex-row">
                    <p className="mr-3 text-gray-500 text-[13.5px] flex flex-row justify-center items-center">{PostTime}</p>
                    {
                        post?.location ? <p className="mr-3 text-gray-500 text-[13.5px] flex flex-row justify-center items-center"><ImLocation2 />{post?.location}</p> : ""
                    }
                    {
                        post?.music?.file ? <p className="mr-3 text-gray-500 text-[13.5px] flex flex-row justify-center items-center"><FaMusic />{post?.music?.file}</p> : ""
                    }
                </div>
            </div>

            <div>
                <Carousel className='relative'>

                    <CarouselContent>

                        {
                            post?.files?.map((file: any, index: number) => {
                                return (
                                    <CarouselItem key={index} >
                                        <div className="p-4 flex justify-center ">
                                            <div className="carousel-item w-full relative">
                                                {
                                                    FileLength !== 1 ?
                                                        <span className='absolute rounded-md bg-gray-300 opacity-80 top-2 right-5'>{index + 1}/{FileLength}</span> : ""
                                                }
                                                <img className="w-[100%] max-h-[30rem] object-contain rounded-lg" src={file?.url} alt={"userDetails?.username"} />
                                            </div>
                                        </div>
                                    </CarouselItem>
                                );
                            })
                        }
                    </CarouselContent>
                    {
                        FileLength !== 1 ?
                            <>
                                <CarouselPrevious className="left-4 " />
                                <CarouselNext className="right-4" />
                            </>
                            : ""
                    }
                    {/* <CarouselPrevious className='absolute top-[50%] left-[-1px]' />
                                <CarouselNext className='absolute top-[50%] right-[-1px]' /> */}
                </Carousel>
            </div>




            <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
                <div className="flex items-center">
                    <button onClick={() => likeOrDislikeHandler(post._id)} className={`flex items-center  hover:text-blue-500 ${liked ? "text-blue-500" : "text-gray-600"}`}>
                        <FaThumbsUp className="w-5 h-5 mr-1" />
                        <span>{post?.likes.length}</span>
                    </button>

                    <button className="flex items-center ml-4 text-gray-600 hover:text-blue-500" onClick={() => openComments(post?.comments)}>
                        <FaComment className="w-5 h-5 mr-1" />
                        <span>{post?.comments.length}</span>
                    </button>
                </div>

                <div className="flex flex-row">
                    <button className={` hover:text-blue-500 mx-1 ${Bookmarked ? "text-blue-500" : "text-gray-600"}`} onClick={() => BookmarkHandler(post._id)}>
                        <FaBookmark className="w-5 h-5" />
                    </button>
                    <button className="text-gray-600 hover:text-blue-500 mx-1">
                        <FaShareAlt className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {
                OpenCommentBox ? (
                    <CommentsBox post={post} Comments={Comments} />
                ) : ""
            }
        </div>


    );
};

export default PostCard;