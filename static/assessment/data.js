
/**
 * Get data selection
 */
const getDataSelection = () => {
    let selection = []
    dataNames.forEach((name) => {
        if (document.querySelector(`#check_${name}`).checked) {
            selection.push(name)
        }
    })
    return selection
}
const getResourceSelection = () => {
    let subs = []
    document.querySelectorAll('input[name="check_resources_subs"]').forEach((el) => {
        if (el.checked) {
            subs.push(el.value)
        }
    })
    return subs
}

/**
 * Get data from backend
 */
const getData = () => {
    showOverlay()
    btnWaitState()
    hideCounts()
    clearDataTables()
    try {
        const dataSelection = getDataSelection()
        const resourceSelection = getResourceSelection()
        const subscription_id = document.querySelector('#subscription_id').value
        const app_id = document.querySelector('#app_id').value
        const client_secret = document.querySelector('#client_secret').value
        const tenant_id = document.querySelector('#tenant_id').value
        const data = {
            'data_selection': dataSelection,
            'resource_selection': resourceSelection,
            'subscription_id': subscription_id,
            'tenant_id': tenant_id,
            'app_id': app_id,
            'client_secret': client_secret
        }
        saveLocalData(data)
        ajax_post('/api/all-data', data, listData)
    } catch (e) {
        console.log(e)
    }
}

/**
 * List the retrieved data
 */
const listData = (data) => {
    hideOverlay()
    btnNormalState()
    data = JSON.parse(data)
    if (data.success == true) {
        result = []
        dataNames.forEach((name) => {
            if (data.data[name]) {
                allData[name] = {}
                let badge = document.querySelector(`#tabLinks .nav-link[data-target="#tab${title(name)}"] .badge`)
                badge.classList.remove('d-none')
                data.data[name].forEach((r) => {
                    let row = null
                    let dataKey = null
                    let inserted = {}
                    if (name == 'resources') {
                        inserted = add_resource_row(r)
                        add_resource_full_row(r)
                    } else if (name == 'subscriptions') {
                        inserted = add_subscription_row(name, r)
                        add_subscription_full_row(r)
                    } else if (name == 'locks') {
                        inserted = add_lock_row(r)
                    } else if (name == 'tags') {
                        inserted = add_tag_row(r)
                    } else if (name == 'storages') {
                        inserted = add_storage_row(r)
                        add_storage_full_row(r)
                    }
                    if (inserted.row != null) {
                        dataTable[name].insert([inserted.row])
                    }
                    if (inserted.dataKey != null && inserted.dataValue != null) {
                        allData[name][inserted.dataKey] = inserted.dataValue
                    }
                })
                badge.innerText = data.data[name].length
            }
        })
    } else {
        alert(data.data.error)
    }
}

/**
 * Display the retrived data
 */
const displayData = (dataName, dataKey) => {
    let data = allData[dataName][dataKey]
    if (!data) {
        console.log(`allData[${dataName}][${dataKey}] is missing`)
        return
    }
    let name = ''
    if (dataName == 'resources') {
        name = data.name
        clearDataTable('resources_agent', 'AgentPools')
        populateResourcesDetails(data)
    } else if (dataName == 'subscriptions') {
        name = data.subscriptionId
        populateSubProperties(data)
        populateSubPolicies(data)
    } else if (dataName == 'storages') {
        name = data.name
        populateStorageDetails(data)
    }
    if (name != '') {
        document.querySelector('#name'+title(dataName)).innerText = name
        if (dataName == 'resources') {
            document.querySelector('#btnExportAgentPools').setAttribute('data-name', name)
        }
    }
}