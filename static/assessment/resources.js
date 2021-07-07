/**
 * Populate the datatable for display
 */
const add_resource_row = (r) => {
    let resourceType = r.type.split('/')[1]
    row = {
        'Name': r.name,
        'Type': resourceType,
        'Group': r.resourceGroup,
        'Option': ''
    }
    let dataKey = null
    let dataValue = null
    if (resourceType == 'managedClusters') {
        row['Option'] = `<button type="button" class="btn btn-sm btn-primary view-details float-end" onclick="viewDetails('resources','${r.id.replace("'",'')}')">Details</button>`
        dataKey = r.id
        dataValue = r.details
    }
    return {
        'row': row,
        'dataKey': dataKey,
        'dataValue': dataValue
    }
}

/**
 * Populate the datatable for csv export
 */
const add_resource_full_row = (r) => { 
    let resourceType = r.type.split('/')[1]
    if (resourceType == 'managedClusters') { 
        let data = r.details
        let prop = data.properties
        let identity = data.identity
        if (!identity) {
            identity = {'type': '', 'principalId': '', 'tenantId': ''}
        }
        let net = prop.networkProfile
        let enablePrivateCluster = false
        if (prop.apiServerAccessProfile) {
            enablePrivateCluster = prop.apiServerAccessProfile.enablePrivateCluster
        }
        let addons = prop.addonProfiles
        let addons_list = []
        if (addons) {
            Object.keys(addons).forEach((k) => {
                addons_list.push(`${k}:${addons[k].enabled==true?'on':'off'}`)
            })
        }
        let tags = data.tags
        let tags_list = []
        if (tags) {
            Object.keys(tags).forEach((k) => {
                tags_list.push(`${k}=${tags[k]}`)
            })
        }
        let profile = prop.linuxProfile
        if (!profile) {
            profile = {'adminUsername': '', 'ssh': {'publicKeys': []}}
        } else if (!profile.ssh.publicKeys) {
            profile.ssh.publicKeys = []
        }
        let cred_types = ['user', 'monitoring', 'admin']
        let credentials_list = {}
        cred_types.forEach((t) => {
            credentials_list[t] = []
            let credentials = data.credentials[t]
            if (!credentials) {
                credentials = []
            }
            if (credentials.length > 0) {
                credentials.forEach((c) => {
                    credentials_list[t].push(c.name)
                })
            }
        })
        row = {
            'ID': r.id,
            'Name': r.name,
            'Type': 'managedClusters',
            'Group': r.resourceGroup,
            'SKU': data.sku.name + '/' + data.sku.tier,
            'Kubernetes version': ValueOr(prop.kubernetesVersion),
            'DNS prefix': ValueOr(prop.dnsPrefix),
            'API server address': ValueOr(prop.fqdn),
            'RBAC': prop.enableRBAC,
            'Encryption type': 'n/a',
            'Network Type (plugin)': ValueOr(net.networkPlugin),
            'Pod CIDR': ValueOr(net.podCidr),
            'Service CIDR': ValueOr(net.serviceCidr),
            'DNS service IP': ValueOr(net.dnsServiceIP),
            'Docker bridge CIDR': ValueOr(net.dockerBridgeCidr),
            'Network policy': 'n/a',
            'Load balancer': ValueOr(net.loadBalancerSku),
            'Private cluster': enablePrivateCluster,
            'Add-ons': addons_list.join(', '),
            'Identity Type': identity.type,
            'Identity Principal ID': identity.principalId,
            'Identity Tenant ID': identity.tenantId,
            'Tags': tags_list.join(', '),
            'Linux Profile - Admin User': profile.adminUsername,
            'Linux Profile - SSH Public Keys (Total)': profile.ssh.publicKeys.length,
            'User Credentials': credentials_list.user.join(', '),
            'Monitoring Credentials': credentials_list.monitoring.join(', '),
            'Admin Credentials': credentials_list.admin.join(', ')
        }
        console.log(row)
    } else {
        row = {
            'ID': r.id,
            'Name': r.name,
            'Type': resourceType,
            'Group': r.resourceGroup,
            'SKU': '',
            'Kubernetes version': '',
            'DNS prefix': '',
            'API server address': '',
            'RBAC': '',
            'Encryption type': '',
            'Network Type (plugin)': '',
            'Pod CIDR': '',
            'Service CIDR': '',
            'DNS service IP': '',
            'Docker bridge CIDR': '',
            'Network policy': '',
            'Load balancer': '',
            'Private cluster': '',
            'Add-ons': '',
            'Identity Type': '',
            'Identity Principal ID': '',
            'Identity Tenant ID': '',
            'Tags': '',
            'Linux Profile - Admin User': '',
            'Linux Profile - SSH Public Keys (Total)': '',
            'User Credentials': '',
            'Monitoring Credentials': '',
            'Admin Credentials': ''
        }
    }
    dataTable.resources_full.insert([row])
}

/**
 * Populate the cluster details boxes
 */
const populateResourcesDetails = (data) => {
    populateProperties(data)
    populateNetworking(data)
    populateAddons(data)
    populateIdentity(data)
    populateTags(data)
    populateLinuxProfile(data)
    populateCredentials(data)
    populateAgentPools(data)
}


/**
 * Populate Properties box
 */
const populateProperties = (data) => {
    let prop = data.properties
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = `
    ${li}SKU: ${sp}${data.sku.name}/${data.sku.tier}</span></li>
    ${li}Kubernetes version: ${sp}${ValueOr(prop.kubernetesVersion)}</span></li>
    ${li}DNS prefix: ${sp}${ValueOr(prop.dnsPrefix)}</span></li>
    ${li}API server address: ${sp}${ValueOr(prop.fqdn)}</span></li>
    ${li}RBAC: ${sp}${prop.enableRBAC==true?'Enabled':'Disabled'}</span></li>
    ${li}Encryption type: ${sp}n/a</span></li>`
    document.querySelector('#clusterInfo #listProperties').innerHTML = html
}

/**
 * Populate Networking box
 */
const populateNetworking = (data) => {
    let prop = data.properties
    let net = prop.networkProfile
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let enablePrivateCluster = false
    if (prop.apiServerAccessProfile) {
        enablePrivateCluster = prop.apiServerAccessProfile.enablePrivateCluster
    }
    let html = `\
    ${li}<strong>Network profile</strong></li>
    ${li}Type (plugin): ${sp}${ValueOr(net.networkPlugin)}</span></li>
    ${li}Pod CIDR: ${sp}${ValueOr(net.podCidr)}</span></li>
    ${li}Service CIDR: ${sp}${ValueOr(net.serviceCidr)}</span></li>
    ${li}DNS service IP: ${sp}${ValueOr(net.dnsServiceIP)}</span></li>
    ${li}Docker bridge CIDR: ${sp}${ValueOr(net.dockerBridgeCidr)}</span></li>
    ${li}Network policy: ${sp}n/a</span></li>
    ${li}<strong>Traffic routing</strong></li>
    ${li}Load balancer: ${sp}${ValueOr(net.loadBalancerSku)}</span></li>
    ${li}<strong>Security</strong></li>
    ${li}Private cluster: ${sp}${enablePrivateCluster==true?'Enabled':'Disabled'}</span></li>`
    document.querySelector('#clusterInfo #listNetworking').innerHTML = html
}

/**
 * Populate Addon box
 */
const populateAddons = (data) => {
    let addons = data.properties.addonProfiles
    if (!addons) {
        addons = {}
    }
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = ''
    Object.keys(addons).forEach((k) => {
        html += `${li}${k}: ${sp}${addons[k].enabled==true?'Enabled':'Disabled'}</span></li>`
    })
    document.querySelector('#clusterInfo #listAddons').innerHTML = html
}

/**
 * Populate Identity box
 */
const populateIdentity = (data) => {
    let identity = data.identity
    if (!identity) {
        identity = {'type': '', 'principalId': '', 'tenantId': ''}
    }
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = `
    ${li}Type: ${sp}${identity.type}</span></li>
    ${li}Principal ID: ${sp}${identity.principalId}</span></li>
    ${li}Tenant ID: ${sp}${identity.tenantId}</span></li>`
    document.querySelector('#clusterInfo #listIdentity').innerHTML = html
}

/**
 * Populate Tags box
 */
const populateTags = (data) => {
    let tags = data.tags
    if (!tags) {
        tags = {}
    }
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = ''
    Object.keys(tags).forEach((k) => {
        html += `${li}${k}: ${sp}${tags[k]}</span></li>`
    })
    document.querySelector('#clusterInfo #listTags').innerHTML = html
}

/**
 * Populate Linux Profile box
 */
const populateLinuxProfile = (data) => {
    let profile = data.properties.linuxProfile
    if (!profile) {
        profile = {'adminUsername': '', 'ssh': {'publicKeys': []}}
    } else if (!profile.ssh.publicKeys) {
        profile.ssh.publicKeys = []
    }

    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = `
    ${li}Admin User: ${sp}${profile.adminUsername}</span></li>
    ${li}SSH Public Keys (Total): ${sp}${profile.ssh.publicKeys.length}</span></li>`
    document.querySelector('#clusterInfo #listLinuxProfile').innerHTML = html
}

/**
 * Populate User, Monitoring and Admin Credentials [kubeconfigs]
 */
const populateCredentials = (data) => {
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let types = ['user', 'monitoring', 'admin']
    let html = ''
    types.forEach((t) => {
        html += `${li}<strong>${title(t)}</strong></li>`
        let credentials = data.credentials[t]
        if (!credentials) {
            credentials = []
        }
        if (credentials.length > 0) {
            credentials.forEach((c) => {
                html += `${li}${c.name} ${sp}${c.value.substring(0,15)}...</span></li>`
            })
        } else {
            html += `${li}<em>n/a</em></li>`
        }
    }) 
    document.querySelector('#clusterInfo #listCredentials').innerHTML = html
}

/**
 * Populate Agent Pools box
 */
const populateAgentPools = (data) => {
    let agents = data.properties.agentPoolProfiles
    if (!agents) {
        agents = []
    }
    let headers = ['']
    let i = 0
    agents.forEach((agent) => {
        let row = {
            'resourceName': data.name,
            'name': agent.name,
            'count': agent.count + '',
            'vmSize': agent.vmSize,
            'osDiskSizeGB': agent.osDiskSizeGB,
            'osDiskType': agent.osDiskType,
            'kubeletDiskType': agent.kubeletDiskType,
            'maxPods': agent.maxPods + '',
            'type': agent.type,
            'provisioningState': agent.provisioningState,
            'powerState': agent.powerState.code,
            'orchestratorVersion': agent.orchestratorVersion,
            'enableNodePublicIP': agent.enableNodePublicIP + '',
            'nodeLabels': JSON.stringify(agent.nodeLabels),
            'mode': agent.mode,
            'enableEncryptionAtHost': agent.enableEncryptionAtHost + '',
            'osType': agent.osType,
            'osSKU': agent.osSKU,
            'nodeImageVersion': agent.nodeImageVersion,
            'enableFIPS': agent.enableFIPS + ''
        }
        dataTable.resources_agent.insert([row])
    })
}