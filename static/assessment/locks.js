
const add_lock_row = (r) => {
    let parsedId = r.id.split('/')
    let resourceGroup = parsedId[4]
    let resourceType = parsedId[7]
    let resourceName = parsedId[8]
    if (resourceType == 'locks') {
        resourceType = 'resourceGroup'
        resourceName = resourceGroup
    }
    row = {
        'Resource Type': resourceType,
        'Resource Name': resourceName,
        'Lock Name': r.name,
        'Lock Level': r.properties.level
    }
    return {
        'row': row,
        'dataKey': null,
        'dataValue': null
    }
}