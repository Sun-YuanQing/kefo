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
        key: 'Attribute',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.Attribute || '—');
                }
    },
    {
        title: '来源',
        key: 'SourceType',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.SourceType == 1 ? '总部' : '门店');
                }
    },
    {
        title: '状态',
        key: 'AuditStatus',
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

const directColumns = [
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
        title: '属性',
        key: 'Attribute',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.Attribute || '—');
                }
    },
    {
        title: '来源',
        key: 'SourceType',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.SourceType == 1 ? '总部' : '门店');
                }
    },
    {
        title: '状态',
        key: 'AuditStatus',
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
        key: 'Attribute',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.Attribute || '—');
                }
    },
    {
        title: '来源',
        key: 'SourceType',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.SourceType == 1 ? '总部' : '门店');
                }
    },
    {
        title: '状态',
        key: 'AuditStatus',
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
        key: 'Attribute',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.Attribute || '—');
                }
    },
    {
        title: '来源',
        key: 'SourceType',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.SourceType == 1 ? '总部' : '门店');
                }
    },
    {
        title: '状态',
        key: 'AuditStatus',
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

const hotelColumns = [
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
        title: '状态',
        key: 'AuditStatus',
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

const combinedColumns = [
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
        title: '状态',
        key: 'AuditStatus',
        minWidth: 100,
        align: 'center',
    },
    {
        title: '来源',
        key: 'SourceType',
        minWidth: 100,
        align: 'center',
        render: (h, params) => {
                    return h('div', params.row.SourceType == 1 ? '总部' : '门店');
                }
    },
    {
        title: '上传人',
        key: 'Source',
        minWidth: 100,
        align: 'center',
        className: 'nameColumn',
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
    directColumns,
    notDirectColumns,
    otherColumns,
    hotelColumns,
    combinedColumns,
}