
const add_tag_row = (r) => {
    row = {
        'Resource Group': r.resource_group,
        'Resource Type': r.resource_type.split('/')[1],
        'Resource Name': r.resource_name,
        'Tags': r.tags
    }
    return {
        'row': row,
        'dataKey': null,
        'dataValue': null
    }
}
