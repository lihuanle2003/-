import request from "@/utils/request";

const tokenVerfiy = (token) => {
    return request({
        url: "/tokenVerfiy",
        method: "POST",
        headers: {
            Authorization: token ? 'Bearer ' + token : ''
        }
    })
}

export default tokenVerfiy