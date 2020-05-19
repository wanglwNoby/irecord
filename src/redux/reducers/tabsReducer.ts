interface IDefaultState {
    tabList: any[];
    activeID: string;
}

const defaultState: IDefaultState = {
    tabList: [],
    activeID: ''
}

export default (state = defaultState, action: { type: string; id: string; name?: string }): IDefaultState => {
    const index = state.tabList.findIndex((item: any): boolean => item.id === action.id)
    switch (action.type) {
        case 'SET_DEFAULT_TAB':
            state.tabList = [{ id: action.id, active: true, name: action.name }]
            return Object.assign({}, state, {
                tabList: [...state.tabList],
                activeID: action.id
            })
        case 'ADD_TAB': {
            state.tabList.forEach((item: any): void => {
                item.active = false
            })
            if (index > -1) {
                state.tabList[index].active = true
                return Object.assign({}, state, {
                    tabList: [...state.tabList],
                    activeID: state.tabList[index].id
                })
            }
            return Object.assign({}, state, {
                tabList: [...state.tabList, { id: action.id, active: true, name: action.name }],
                activeID: action.id
            })
        }
        case 'CHANGE_TAB': // 改变选择的tab
            state.tabList.forEach((item: any): void => {
                item.active = (item.id === action.id)
            })
            return Object.assign({}, state, {
                tabList: [...state.tabList],
                activeID: action.id
            })
        case 'DELETE_TAB': // 删除tab
            if (state.tabList.length === 1) {
                return state
            }
            let activeID: string = state.activeID
            if (state.tabList[index].active) {
                if (index === 0) {
                    state.tabList[index + 1].active = true
                    activeID = state.tabList[index + 1].id
                } else {
                    state.tabList[index - 1].active = true
                    activeID = state.tabList[index - 1].id
                }
            }
            state.tabList.splice(index, 1)
            return Object.assign({}, state, {
                tabList: [...state.tabList],
                activeID
            })
        default:
            return state
    }
}