interface IInitTreeData {
    id: string;
    name: string;
    children: IInitTreeData[];
}

interface IDepartmentTreeData {
    system_id: string;
    full_name: string;
    parent_id: string;
    children: IDepartmentTreeData[];
}

// 树数据
interface ITreeData {
    title: string;
    key: string;
    value: string;
    children: ITreeData[];
}

// 部门树数据
interface IDepartmentTree {
    title: string;
    key: string;
    value: string;
    parent_id: string;
    children: IDepartmentTree[];
}

// 操作事件
interface IOperationTree {
    id: string;
    pid: string;
    text: string;
    url: string;
    is_open: string;
    state: any[];
    icon: string;
    target_type: string;
    children: IOperationTree[];
}

export function formatTreeData(initTreeData: IInitTreeData[]): ITreeData[] {
    const newTreeData: ITreeData[] = []
    initTreeData.forEach((item: IInitTreeData): void => {
        newTreeData.push({
            title: item.name,
            value: item.id,
            key: item.id,
            children: item.children.length > 0 ? formatTreeData(item.children) : []
        })
    })
    return newTreeData
}

export function departmentTreeData(IdepartmentTree: IDepartmentTreeData[]): IDepartmentTree[] {
    const newDepartmentTreeData: IDepartmentTree[] = []
    IdepartmentTree.forEach((item: IDepartmentTreeData): void => {
        newDepartmentTreeData.push({
            title: item.full_name,
            value: item.system_id,
            parent_id: item.parent_id,
            key: item.system_id,
            children: item.children.length > 0 ? departmentTreeData(item.children) : []
        })
    })
    return newDepartmentTreeData
}

export function operationData(operationTreeData: IOperationTree[]): ITreeData[] {
    const newoperationData: ITreeData[] = []
    operationTreeData.forEach((item: IOperationTree): void => {
        newoperationData.push({
            title: item.text,
            value: item.id,
            key: item.id,
            children: item.children !== null ? operationData(item.children) : []
        })
    })
    return newoperationData
}