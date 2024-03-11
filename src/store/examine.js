export default {
    namespaced:true,
    state:{
        // 一审数据
        dataOfFirstInstance:[],
        // 二审数据
        dataOfScendIntance:[]
    },
    mutations:{
        getFirstInstData(state,value){
            if(value){
                value.map((item,index)=>{
                    let status = item.aduitStatus
                    if(status === '0'){
                        state.dataOfFirstInstance.push(item)
                    }else if(status === '1'){
                        state.dataOfScendIntance.push(item)
                    }
                })

                console.log(state.dataOfFirstInstance);
            }
        }
    }
}