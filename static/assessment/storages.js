/**
 * Populate the datatable for display
 */
const add_storage_row = (r) => {
    row = {
        'Storage Name': r.name,
        'Kind': r.kind,
        'Option': `<button type="button" class="btn btn-sm btn-primary view-details float-end" onclick="viewDetails('storages','${r.id.replace("'",'')}')">Details</button>`  
    }
    return {
        'row': row,
        'dataKey': r.id,
        'dataValue': r
    }
}

/**
 * Populate the datatable for csv export
 */
const add_storage_full_row = (r) => {
    let prop = r.properties
    let tags = []
    Object.keys(r.tags).forEach((k) => {
      tags.push(k + '=' + r.tags[k])
    })
    let keyCreationTime = []
    Object.keys(prop.keyCreationTime).forEach((k) => {
      keyCreationTime.push(k + ': ' + prop.keyCreationTime[k])
    })
    let privateEndpoints = []
    prop.privateEndpointConnections.forEach((e) => {
      privateEndpoints.push(e.name + ': ' + e.properties.privateEndpoint)
    })
    let encryptionServices = []
    Object.keys(prop.encryption.services).forEach((k) => {
      encryptionServices.push(k + '=' + prop.encryption.services[k].enabled)
    })
    let row = {
        'ID': r.id,
        'Name': r.name,
        'Kind': r.kind,
        'Location': r.location,
        'SKU': r.sku.name + '/' + r.sku.tier,
        'Tags': tags.join(', '),
        'Key Creation Time': keyCreationTime.join(', '),
        'Private Endpoint Connections': privateEndpoints.join(', '),
        'Minimum TLS Version': prop.minimumTlsVersion,
        'Allow BLOB Public Access': prop.allowBlobPublicAccess,
        'Network ACLS - Bypass': prop.networkAcls.bypass,
        'Network ACLS - Virtual Network Rules': prop.networkAcls.virtualNetworkRules,
        'Network ACLS - IP Rules': prop.networkAcls.ipRules,
        'Network ACLS - Default Action': prop.networkAcls.defaultAction,
        'Support HTTPS Traffic Only': prop.supportsHttpsTrafficOnly,
        'Encryption Services': encryptionServices.join(', '),
        'Encryption Key Source': prop.encryption.keySource,
        'Access Tier': prop.accessTier,
        'Provisioning State': prop.provisioningState,
        'Creation Time': prop.creationTime,
        'Primary Endpoint - DFS': prop.primaryEndpoints.dfs,
        'Primary Endpoint - Web': prop.primaryEndpoints.web,
        'Primary Endpoint - Blob': prop.primaryEndpoints.blob,
        'Primary Endpoint - Queue': prop.primaryEndpoints.queue,
        'Primary Endpoint - Table': prop.primaryEndpoints.table,
        'Primary Endpoint - File': prop.primaryEndpoints.file,
        'Primary Location': prop.primaryLocation,
        'Status of Primary': prop.statusOfPrimary,
    }
    dataTable.storages_full.insert([row])
}

/**
 * Populate All Info box
 */
const populateStorageDetails = (data) => {
    populateStorageProperties(data)
    populateStorageTags(data)
    populateStorageKeyCreation(data)
    populateStoragePrivateEndpoints(data)
    populateStorageNetworkACLs(data)
    populateStorageEncryptionServices(data)
    populateStoragePrimaryEndpoints(data)
}

/**
 * Populate Properties box
 */
const populateStorageProperties = (data) => {
    let prop = data.properties
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = `
    ${li}Location: ${sp}${data.location}</span></li>
    ${li}SKU: ${sp}${data.sku.name}/${data.sku.tier}</span></li>
    ${li}Minimum TLS Version: ${sp}${prop.minimumTlsVersion}</span></li>
    ${li}Allow BLOB Public Access: ${sp}${prop.allowBlobPublicAccess}</span></li>
    ${li}Support HTTPS Traffic Only: ${sp}${prop.supportsHttpsTrafficOnly}</span></li>
    ${li}Encryption Key Source: ${sp}${prop.encryption.keySource}</span></li>
    ${li}Access Tier: ${sp}${prop.accessTier}</span></li>
    ${li}Provisioning State: ${sp}${prop.provisioningState}</span></li>
    ${li}Creation Time: ${sp}${prop.creationTime}</span></li>
    ${li}Primary Location: ${sp}${prop.primaryLocation}</span></li>
    ${li}Status of Primary: ${sp}${prop.statusOfPrimary}</span></li>`
    document.querySelector('#storageInfo #listStorageProperties').innerHTML = html
}

/**
 * Populate Tags box
 */
const populateStorageTags = (data) => {
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = ''
    Object.keys(data.tags).forEach((k) => {
      html += `${li}${k}: ${sp}${data.tags[k]}</span></li>`
    })
    document.querySelector('#storageInfo #listStorageTags').innerHTML = html
}

/**
 * Populate Key Creation Time box
 */
const populateStorageKeyCreation = (data) => {
    let prop = data.properties
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = ''
    Object.keys(prop.keyCreationTime).forEach((k) => {
      html += `${li}${k}: ${sp}${prop.keyCreationTime[k]}</span></li>`
    })
    document.querySelector('#storageInfo #listStorageKeyCreation').innerHTML = html
}

/**
 * Populate Private Endpoints box
 */
const populateStoragePrivateEndpoints = (data) => {
    let prop = data.properties
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = ''
    prop.privateEndpointConnections.forEach((e) => {
      html += `${li}${e.name}: ${sp}${e.properties.prop.privateEndpoint}</span></li>`
    })
    document.querySelector('#storageInfo #listStoragePrivateEndpoints').innerHTML = html
}

/**
 * Populate Network ACLs box
 */
const populateStorageNetworkACLs = (data) => {
    let acl = data.properties.networkAcls
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = `
    ${li}Bypass: ${sp}${acl.bypass}</span></li>
    ${li}Virtual Network Rules: ${sp}${acl.virtualNetworkRules}</span></li>
    ${li}IP Rules: ${sp}${acl.ipRules}</span></li>
    ${li}Default Action: ${sp}${acl.defaultAction}</span></li>`
    document.querySelector('#storageInfo #listStorageNetworkACLs').innerHTML = html
}

/**
 * Populate Encryption Services box
 */
const populateStorageEncryptionServices = (data) => {
    let prop = data.properties
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = ''
    prop.privateEndpointConnections.forEach((e) => {
    })
    Object.keys(prop.encryption.services).forEach((k) => {
      html += `${li}${k}: ${sp}${prop.encryption.services[k].enabled}</span></li>`
    })
    document.querySelector('#storageInfo #listStorageEncryptionServices').innerHTML = html
}

/**
 * Populate Primary Endpoints box
 */
const populateStoragePrimaryEndpoints = (data) => {
    let prop = data.properties
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = ''
    Object.keys(prop.primaryEndpoints).forEach((k) => {
      html += `${li}${k}: ${sp}${prop.primaryEndpoints[k]}</span></li>`
    })
    document.querySelector('#storageInfo #listStoragePrimaryEndpoints').innerHTML = html
}