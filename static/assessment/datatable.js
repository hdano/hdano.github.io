/**
 * Clear datatable rows
 */
const clearDataTables = () => {
    dataNames.forEach((name) => {
        clearDataTable(name, title(name))
        if (name == 'resources') {
            clearDataTable('resources_full', 'ResourcesFull')
            clearDataTable('resources_agent', 'AgentPools')
        } else if (name == 'subscriptions') {
            clearDataTable('subscriptions_full', 'SubscriptionsFull')
        } else if (name == 'storages') {
            clearDataTable('storages_full', 'StoragesFull')
        }
    })
    document.querySelectorAll('.rowDetails').forEach((e) => { e.classList.add('d-none') })
}

const clearDataTable = (name, _title) => {
    total_rows = document.querySelectorAll(`#table${_title} tbody tr`).length
    dataTable[name].rows().remove([...Array(total_rows).keys()])
}


/**
 * Export table to csv
 */
const exportToCSV = (name, _title) => {
    var data = {
        type: 'csv',
        filename: _title,
        lineDelimiter:  "\n",
        columnDelimiter:  ","
    }
    if (name == 'resources') {
        name = 'resources_full'
    } else if (name == 'subscriptions') {
        name = 'subscriptions_full'
    } else if (name == 'storages') {
        name = 'storages_full'
    }
    dataTable[name].export(data);
}