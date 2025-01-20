"use client"
import React from 'react';
import { MdClose } from 'react-icons/md';
import { useGlobalContext } from '@/context/contextProvider';
import Searchbox from './Search';
import Notification from './Notification';
import CreatePost from './CreatePost';
import Login from './Login';
import Register from './Register';


function Popovercard() {
    const { setPopover, Search, setSearch, NotificationPop, Loginbtn, Registerbtn, setRegisterBtn, setLoginBtn, setNotificationPop, createPostbtn, setCreatePostBtn, } = useGlobalContext()

    const handleClosePopOver = () => {
        setPopover(false)
        setSearch(false)
        setNotificationPop(false)
        setCreatePostBtn(false)
        setLoginBtn(false)
        setRegisterBtn(false)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center overflow-hidden">
            <button className="absolute top-2 right-2 rounded-full p-2 bg-slate-200" onClick={handleClosePopOver}>
                <MdClose className='size-8 font-bold' />
            </button>
            <div className="bg-white p-4 rounded-lg max-h-[90%]">
                {
                    Search ? <Searchbox /> : ""
                }
                {
                    NotificationPop ? <Notification /> : ""
                }
                {
                    createPostbtn ? <CreatePost /> : ""
                }
                {
                    Loginbtn ? <Login /> : ""
                }
                {
                    Registerbtn ? <Register /> : ""
                }



            </div>
        </div>
    );
}

export default Popovercard;