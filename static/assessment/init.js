let dataTable = null
let allData = {}
let dataNames = ['resources', 'subscriptions', 'locks', 'tags', 'storages']

// Init Start button
const btnStart = document.querySelector('#btnStart')
if (btnStart != null && btnStart != undefined) {
    btnStart.addEventListener('click', getData)
}
// Reload saved form values
const localData = getLocalData()
if (localData['script_type'] != undefined && localData['script_type'] != null) {
    try {
        document.querySelector('#subscription_id').value = localData.subscription_id
        document.querySelector('#app_id').value = localData.app_id
        document.querySelector('#client_secret').value = localData.client_secret
        document.querySelector('#tenant_id').value = localData.tenant_id
    } catch (e) {
        console.log('Failed to get local data.')
        console.log(e)
    }
}

const viewDetails = (name, id) => {
    displayData(name, id)
    if (name == 'resources') {
        document.querySelector('#clusterInfo').classList.remove('d-none')
    } else if (name == 'subscriptions') {
        document.querySelector('#subscriptionInfo').classList.remove('d-none')
    } else if (name == 'storages') {
        document.querySelector('#storageInfo').classList.remove('d-none')
    }

}

const initDataCSVExport = (_title, name) => {
    // Datatables
    dataTable[name] = new DataTable("#table" + _title);
    if (name == 'resources') {
        dataTable['resources_full'] = new DataTable("#tableResourcesFull");
        dataTable['resources_agent'] = new DataTable("#tableAgentPools", {
            'searchable': false, 'sortable': false, 'footer': false,
            'nextPrev': 0, 'perPageSelect': false, 'perPage': 100
        });
    } else if (name == 'subscriptions') {
        dataTable['subscriptions_full'] = new DataTable("#tableSubscriptionsFull");
    } else if (name == 'storages') {
        dataTable['storages_full'] = new DataTable("#tableStoragesFull");
    }
    // Export Buttons
    let btnExport = document.querySelector('#btnExport'+_title)
    if (btnExport != null && btnExport != undefined) {
        btnExport.addEventListener('click', () => {
            exportToCSV(name, _title)
        })
    }
    if (name == 'resources') {
        // Export Agent Pools
        btnExport = document.querySelector('#btnExportAgentPools')
        if (btnExport != null && btnExport != undefined) {
            btnExport.addEventListener('click', () => {
                exportToCSV('resources_agent', 'Agent Pools for '+btnExport.getAttribute('data-name'))
            })
        }
    }
}

dataTable = {}
dataNames.forEach((name) => {
    // checkboxes
    document.querySelector('#check_'+name).addEventListener('click', (e) => {
        let tabLink = document.querySelector(`a.nav-link[data-target="#tab${title(name)}"]`)
        let moreResources = document.querySelector('#moreResources')
        let moreResourcesToggle = document.querySelector('#moreResourcesToggle')
        if (e.target.checked) {
            tabLink.classList.remove('disabled')
            tabLink.click()
            moreResources.classList.remove('d-none')
            moreResourcesToggle.classList.remove('d-none')
        } else {
            tabLink.classList.add('disabled')
            document.querySelector('#tab'+title(name)).classList.add('d-none')
            moreResources.classList.add('d-none')
            moreResourcesToggle.classList.add('d-none')
        }
    })
    // dataTable and CSV Export
    initDataCSVExport(title(name),name)
}) 
// tabs
document.querySelectorAll('#tabLinks .nav-link').forEach((el) => {
    el.addEventListener('click', (e) => {
        document.querySelectorAll('.tabContent').forEach((el2) => { el2.classList.add('d-none') })
        document.querySelector(e.target.getAttribute('data-target')).classList.remove('d-none')
        document.querySelectorAll('#tabLinks .nav-link').forEach((el2) => { el2.classList.remove('active') })
        e.target.classList.add('active')
    })
})