const current_login_user={
    namespaced:true,
    state:{
        // 记录当前所在用户
        current_username : ''
    },
    mutations:{
        // 更改当前用户
        changeCurrentUser(state,value){
            console.log("更改当前用户",value);
            if(value !== state.current_username) state.current_username = value
        }
    }
}

export default current_login_user