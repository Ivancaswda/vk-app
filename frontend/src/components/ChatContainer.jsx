import React, {useEffect, useRef, useState} from 'react'
import {useAuthStore} from "../store/useAuthStore.js";
import toast from "react-hot-toast";
import {ArrowBigDown, ArrowBigLeft, ArrowDown, Image, Send, Trash2, User, X} from "lucide-react";

import axiosInstance from "../lib/axios.js";
import {Link} from "react-router-dom";

const ChatContainer = () => {
    const [confirmPurge, setConfirmPurge] = useState(null)
    const {selectedUser, getMessages, messages, authUser, sendMessage, setSelectedUser, subscribeToMessages, unsubscribeToMessages, onlineUsers, purgeChat} = useAuthStore()
    const messageEndRef = useRef(null)
    const [text, setText] = useState("")
    const fileInputRef = useRef(null) // attaching image to input
    const [imagePreview, setImagePreview] = useState(null)


    useEffect(() => {
        getMessages(selectedUser?._id)
        subscribeToMessages()

        return () => unsubscribeToMessages()

    }, [selectedUser, getMessages, subscribeToMessages, unsubscribeToMessages])
    console.log(messages)
    console.log(authUser)
    const handleImageChange = (event) => {
try {


        const file = event.target.files[0]
        if (!file || !file.type.startsWith('image/')) { // определяем есть ли изобпажение или нет!
           toast.error('Выберите изображение!')
        return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)

} catch (error) {
    toast.error(error.message)
}
    }
    useEffect(() => { // делаем что автоматически экран передвигается вниз
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [messages])

    const removeImage = async (event) => {
        event.preventDefault()
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSendMessage = async (event) => {
        try {
            event.preventDefault()

            if (!text.trim() && !imagePreview) {
                return
            }
            console.log(imagePreview)
            await sendMessage({text:text.trim(), image: imagePreview})

            setText('')
            setImagePreview(null)

            if (fileInputRef.current) {
                fileInputRef.current.value =''
            }


        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }
    // делаем чтобы стрелочка появлялось когжа \то надо
    const [showArrow, setShowArrow] = useState(true)
    const targetRef = useState(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { // если пеерсекается
                // по y с пунктом назначение то убираем а если нет оставляем
                setShowArrow(!entry.isIntersecting)
            },{
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            }

        )
         // если пеерсекается// по y с пунктом назначение то убираем а если нет оставляем
        if (targetRef.current) {
            observer.observe(targetRef.current)
        }
        // если пеерсекается// по y с пунктом назначение то убираем а если нет оставляем

        return () => {
            if (targetRef.current) observer.unobserve(targetRef.current)
        }
    }, [])








    return (
        <div className={'relative rounded-lg border border-gray-200 p-3'}>
            {showArrow && <a href="#too">
                <ArrowDown size={40} className=' right-14 bottom-20 p-2 rounded-xl bg-gray-200 fixed z-20'/>
            </a>}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <ArrowBigLeft size='25' className='text-blue-500 cursor-pointer' onClick={() => setSelectedUser(null)}/>
                    <Link className='cursor-pointer' to={`/profile/${selectedUser?.userName}`}>

                        {selectedUser?.profilePic ? <img  className='rounded-full h-[40px] w-[40px] object-cover' src={selectedUser?.profilePic} alt=""/> : <div
                            className='bg-blue-600  w-[40px] text-center  h-[40px] rounded-full   flex justify-center items-center'>
                            <User size={22} className='rounded-full text-white  '/>
                        </div>}

                    </Link>
                    <div className='leading-none'>

                        <p className='font-semibold text-lg'>{selectedUser?.fullName}</p>
                        <p className='text-[11px]'>{onlineUsers.includes(selectedUser._id) ? <p className={'text-green-500'}>В сети</p> : <p className='text-gray-500'>Не в сети</p>}</p>
                    </div>
                </div>
                <Trash2 title='Очистит чат' onClick={ async () => {

                    if (confirm('Удалить все сообщения с этим пользователем?')) { // running instantly for successfully working
                        try {
                            await axiosInstance.delete(`/message/purge/${selectedUser._id}`)
                            toast.success('Чат удалён')
                            // очищаем локальные сообщения
                             getMessages(selectedUser._id) // перезагрузить чтобы показать, что пусто
                        } catch (err) {
                            toast.error(err.message)
                            console.log(err)
                        }
                    }

                }} className='mr-7 text-blue-600 cursor-pointer'  size={20}/>
            </div>
            <hr className='mt-4'/>



            <div className=' w-full sm:flex-1  flex flex-col overflow-auto'>


                {/* Status section */}


                <div onClick={() => {


                }} className='w-full sm:flex-1 overflow-y-auto p-4 space-y-4 mb-20'>
                    {messages?.length > 0 ? (
                        messages.map((message, index) => (
                            <div key={index}
                                 className={`chat ${message.senderId === authUser.user?._id ? 'chat-end ' : 'chat-start'} `}
                                 ref={messageEndRef}>
                                <div className="chat-image avatar">
                                    <div className="size-10 rounded-full border">
                                        {message.senderId === authUser.user?._id
                                            ? authUser.user.profilePic ?
                                                <img src={authUser.user.profilePic} // дисплэим мой аватар
                                                     className='w-[45px] h-[45px] rounded-full object-cover' alt=""/> :
                                                <div
                                                    className='bg-blue-600  w-[40px] text-center  h-[40px] rounded-full   flex justify-center items-center'>
                                                    <User size={22} className='rounded-full text-white  '/>
                                                </div>
                                            : selectedUser.profilePic ?
                                                <img src={selectedUser.profilePic} // дисплэим аватар пользователя
                                                     className='w-[45px] h-[45px] rounded-full object-cover' alt=""/> :
                                                <div
                                                    className='bg-blue-600  w-[40px] text-center  h-[40px] rounded-full   flex justify-center items-center'>
                                                    <User size={22} className='rounded-full text-white  '/>
                                                </div>
                                        }
                                    </div>
                                </div>
                                <div className='chat-header mb-1'>
                                    <time className='text-xs opacity-50 ml-1'>
                                        {new Date(message.createdAt).toLocaleTimeString()}
                                    </time>
                                </div>

                                <div
                                    className={`chat-bubble flex flex-col ${message.senderId === authUser?._id && 'light:bg-blue-50'}`}>
                                    {message.image && (
                                        <img src={message.image} className='sm:max-w-[200px] rounded-md mb-2' alt=""/>
                                    )}
                                    <p>{message.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center mt-10 h-100">Сообщений пока нет</p>
                    )}
                </div>


            </div>

            <div
                className=" bottom-0 mt-10  items-end justify-right w-full bg-white dark:bg-gray-900 border-t border-gray-300 p-3">
                {imagePreview && (
                    <div className="mb-3 flex items-center gap-2">
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-20  z-20 h-20 object-cover rounded-lg border border-zinc-700"
                            />
                            <button
                                onClick={removeImage}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-700
                         flex items-center justify-center"
                                type="button"
                            >
                                <X className="size-3"/>
                            </button>
                        </div>
                    </div>
                )}

                <form id='too' onSubmit={handleSendMessage} className="flex items-center gap-2 w-[100%] sm:w-[100%] left-0 ">
                    <div className="flex-1 items-center flex gap-2">

                        <input
                            type="text"
                            className="w-full py-2 px-4 border rounded-lg focus:outline-none transition-all duration-500 focus:ring-2 focus:ring-blue-500"
                            placeholder="Введите сообщение..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </div>

                    <button
                        type="button"
                        className={`btn btn-circle ${
                            imagePreview ? "text-blue-500" : "text-zinc-400"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image className='text-blue-500' size={20}/>
                    </button>
                    <button
                        type="submit"
                        className="btn btn-circle bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
                        disabled={!text.trim() && !imagePreview}
                    >
                        <Send size={20} className='text-black'/>
                    </button>
                </form>
            </div>

        </div>
    )
}
export default ChatContainer
