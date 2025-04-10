import axios from 'axios'

const axiosInstance= axios.create({
    baseURL: 'https://vk-backend-ashen.vercel.app/api',
    withCredentials: true,
})
export default axiosInstance
