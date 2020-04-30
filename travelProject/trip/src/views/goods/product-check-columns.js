const allColumns = [
    {
        title: '序号',
        type: 'index',
        width: 80,
        align: 'center'
    },
    {
        title: '产品名称',
        key: 'Name',
        minWidth: 120,
        className: 'nameColumn',
        align: 'center'
    },
    {
        title: '产品类型',
        slot: 'Type',
        minWidth: 100,
        align: 'center',
    },
    {
        title: '属性',
        key: 'Share',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.Share == 1 ? '可共享' : '不可共享');
                }
    },
    {
        title: '状态',
        slot: 'AuditStatus',
        minWidth: 100,
        align: 'center',
    },
    {
        title: '操作',
        slot: 'Action',
        minWidth: 320,
        align: 'center'
    }
]

const notDirectColumns = [
    {
        title: '序号',
        type: 'index',
        width: 80,
        align: 'center'
    },
    {
        title: '产品名称',
        key: 'Name',
        minWidth: 120,
        className: 'nameColumn',
        align: 'center'
    },
    {
        title: '供应商名称',
        key: 'SupplierName',
        minWidth: 120,
        className: 'nameColumn',
        align: 'center'
    },
    {
        title: '属性',
        key: 'Share',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.Share == 1 ? '可共享' : '不可共享');
                }
    },
    {
        title: '状态',
        slot: 'AuditStatus',
        minWidth: 100,
        align: 'center',
    },
    {
        title: '操作',
        slot: 'Action',
        minWidth: 320,
        align: 'center'
    }
]

const otherColumns = [
    {
        title: '序号',
        type: 'index',
        width: 80,
        align: 'center'
    },
    {
        title: '产品名称',
        key: 'Name',
        minWidth: 120,
        className: 'nameColumn',
        align: 'center'
    },
    {
        title: '产品分类',
        key: 'TravelProductTypeName',
        minWidth: 120,
        align: 'center'
    },
    {
        title: '属性',
        key: 'Share',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.Share == 1 ? '可共享' : '不可共享');
                }
    },
    {
        title: '状态',
        slot: 'AuditStatus',
        minWidth: 100,
        align: 'center',
    },
    {
        title: '操作',
        slot: 'Action',
        minWidth: 320,
        align: 'center'
    }
]



export {
    allColumns,
    notDirectColumns,
    otherColumns,
}
