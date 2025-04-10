import React, {useEffect, useState} from 'react'
import RecommendedUser from "../components/RecommendedUser.jsx";
import {useAuthStore} from "../store/useAuthStore.js";
import {Loader} from "lucide-react";
import UserCard from "../components/UserCard.jsx";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";

const RecommendedUsers = () => {
    const {recomendedUsers, recommendedUsers, isNotifying} = useAuthStore()
    console.log(recomendedUsers)
    const [connectionLoading, setConnectionLoading] = useState(false)
    const [connections, setConnections] = useState([])
    const getConnections = async () => {
        try {
            setConnectionLoading(true)
            const response= await axiosInstance.get('/connection')
            if (response.data.success) {
                setConnections(response.data.connections)
            }

        } catch (error) {
            toast.error(error.message)
        } finally {
            setConnectionLoading(false)
        }
    }

    useEffect(() => {
        recommendedUsers()
        getConnections()
    }, [])
    console.log(recomendedUsers)
    console.log(connections)


    return (
        <div>

            {recomendedUsers.suggestedUser?.length > 0 && (
                <div className='col-span-1 lg:col-span-1 hidden lg:block'>
                    <div className="bg-blue-50 rounded-lg shadow p-4">
                        <h2 className='font-semibold mb-4'>Люди которых ты можешь знать</h2>
                        {recomendedUsers?.suggestedUser.map((item, index) => (
                            <RecommendedUser key={index} user={item}/>
                        ))}
                    </div>
                </div>
            )}

            <div className='mt-4'>
                {connections?.length > 0 && (
                    <div className='mb-8'>
                        <h2 className='text-xl font-semibold mb-4'>Мои друзья</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {connectionLoading &&(<div className='flex items-center justify-center w-full'>
                                <Loader className='animate-spin text-blue-500'/>
                            </div>)}
                            {connections.map((connection, index) => (
                                <UserCard connectioning={connectionLoading} setConnectioning={connectionLoading} key={connection._id} user={connection} isConnection={true}/>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>

    )
}
export default RecommendedUsers