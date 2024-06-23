import axios from "../axios";
const GetFeedback = (pid) => {
    try {
        return axios.get(`/api/product/${pid}/feedbacks`);
    } catch (error) {
        console.error('An error occurred while fetching feedback results:', error);
        throw error;
    }
}

export default GetFeedback;