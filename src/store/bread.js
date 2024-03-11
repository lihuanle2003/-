const bread = {
    namespaced:true,
    state:{
        breadList:[
            {
                path:"/home",
                title:"home"
            }
        ]
    },
    mutations:{
        breadListAdd(state,value){
            // 定义检测标识符 0为没有检测到相同元素 1为检测到了相同元素
            let count = 0;
            state.breadList.map(item=>{
                if(item.path === value.path){
                    count = 1
                }
            })
            if(!count){
                state.breadList.push(value)
            }
        }
    }
}

export default bread