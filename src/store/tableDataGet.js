import { getLoanData } from "@/apis/loan"

export default {
    namespaced: true,
    state: {
        tabledata: [],
        firstInstData: [],
        scendInstData: [],
        fallinyInstData: [],
        allowInst: [],
        disAllowInst: []
    },
    mutations: {
        // 整个项目加载后 获取后台数据存放在 tabledata 并进行状态分组
        async getTableData(state) {
            let res = await getLoanData()
            if (res.data.code === 200) {
                let status
                // 重置数据
                state.firstInstData = []
                state.scendInstData = []
                state.fallinyInstData = []
                state.allowInst = []
                state.disAllowInst = []
                state.tabledata = []

                // 总数据存放
                state.tabledata = res.data.data.tableData
                state.tabledata.map((item, index) => {
                    status = item.aduitStatus
                    switch (status) {
                        case '0':
                            state.firstInstData.push(item)
                            break;
                        case '1':
                            state.scendInstData.push(item)
                            break;
                        case '2':
                            state.fallinyInstData.push(item)
                            break;
                        case '3':
                            state.allowInst.push(item)
                            break;
                        case '4':
                            state.disAllowInst.push(item)
                    }
                })
            }
        },
    }
}