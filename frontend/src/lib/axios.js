import axios from 'axios'

const axiosInstance= axios.create({
    baseURL: 'http://localhost:4023/api',
    withCredentials: true,
})
export default axiosInstance