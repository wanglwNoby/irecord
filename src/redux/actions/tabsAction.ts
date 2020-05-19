interface IAddTab { type: string; id: string; name: string }
interface IChangeTab { type: string; id: string }
interface IDeleteTab { type: string; id: string }
interface ISetDefalutTab { type: string; id: string; name: string }

export const addTab = (id: string, name: string): IAddTab => (
    { type: 'ADD_TAB', id, name }
)

export const changeTab = (id: string): IChangeTab => (
    { type: 'CHANGE_TAB', id }
)

export const deleteTab = (id: string): IDeleteTab => (
    { type: 'DELETE_TAB', id }
)

export const setDefalutTab = (id: string, name: string): ISetDefalutTab => (
    { type: 'SET_DEFAULT_TAB', id, name }
)