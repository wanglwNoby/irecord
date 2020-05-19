import { combineReducers } from 'redux'
import langReducer from './reducers/langReducer'
import themeReducer from './reducers/themeReducer'
import IndexTabsReducer from './reducers/tabsReducer'

export default combineReducers({
    langReducer,
    themeReducer,
    IndexTabsReducer
})