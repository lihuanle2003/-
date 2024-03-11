import request from "@/utils/request"

export const doLogin =(user)=>{
  return request({
    url:"/login",
    params:user,
    method:"POST",
    headers:{
      Authorization:localStorage.getItem("token") ? 'Bearer' + localStorage.getItem("token") : ''
    }
  })
}

export const userSign = (user={})=>{
  return request.post("/sign",user)
}

export const logout = (username)=>{
  return request({
    url:"/user/logout",
    method:"POST",
    params:username
  })
} 

export const getLoginUser = ()=>{
  return request.get("/login_user")
} 

export const updateUserLimit = (componentObj)=>{
  return request({
    url:"/updateUserLimit",
    method:"POST",
    params:componentObj
  })
}

export const getUserLimit = (userName)=>{
  return request({
    url:"/getUserLimit",
    method:"POST",
    params:{
      userName
    }
  })
}

export const regisPut = (params)=>{
  return request({
    url:"/regisPut",
    method:"POST",
    params
  })
}

export const regisGet = (params)=>{
  return request({
    url:"/getRegisData",
    method:'GET',
    params
  })
}