import request from "@/utils/request"
export const getLoanData = (params)=>{
    return request(
        {
            url:"/loan/getList",
            method:"GET",
            params:params
        }
    )
}

export const updateLoanData = (params)=>{
    // 审核申请数据更新请求
    return request.post("/loan/updateData",{params})
}

export const submitLoanData = (params)=>{
    return request({
        url:"/user/submitLoanData",
        method:"POST",
        params:params
    })
}