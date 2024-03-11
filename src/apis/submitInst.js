import request from "@/utils/request";

export const firstInstSuccess = (params)=>{
    return request({
        url:"/submit/firstSuccess",
        method:"POST",
        params:params
    })
}

export const firstInstNoArgee = (params)=>{
    return request({
        url:"/submit/firstNoargee",
        method:"POST",
        params:params
    })
}