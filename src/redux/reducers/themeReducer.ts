interface IDefaultState {
    theme: string;
}
const defaultState: IDefaultState = {
    theme: 'dark'
}

export default (state: any = defaultState, action: any): IDefaultState => {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, theme: action.theme }
        default:
            return state
    }
}