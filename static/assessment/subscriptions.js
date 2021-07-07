/**
 * Populate the datatable for display
 */
const add_subscription_row = (name, r) => { 
    row = {
        'Display Name': r.displayName,
        'Subscription ID': r.subscriptionId,
        'Option': `<button type="button" class="btn btn-sm btn-primary view-details" onclick="viewDetails('subscriptions','${r.subscriptionId.replace("'",'')}')">Details</button>`
    }
    return {
        'row': row,
        'dataKey': r.subscriptionId,
        'dataValue': r
    }
}

/**
 * Populate the datatable for csv export
 */
const add_subscription_full_row = (r) => {
    let pol = r.subscriptionPolicies
    let row = {
        'Subscription ID': r.subscriptionId,
        'Display Name': r.displayName,
        'Authorization Source': r.authorizationSource,
        'Managed by Tenants': 'n/a',
        'Tenant ID': r.tenantId,
        'State': r.state,
        'Location Placement ID': pol.locationPlacementId,
        'Quota ID': pol.quotaId,
        'Spending Limit': pol.spendingLimit
    }
    dataTable.subscriptions_full.insert([row])
}

/**
 * Populate Properties box
 */
const populateSubProperties = (data) => {
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = `
    ${li}Authorization Source: ${sp}${data.authorizationSource}</span></li>
    ${li}Managed by Tenants: ${sp}n/a</span></li>
    ${li}Tenant ID: ${sp}${data.tenantId}</span></li>
    ${li}State: ${sp}${data.state}</span></li>`
    document.querySelector('#subscriptionInfo #listSubProperties').innerHTML = html
}

/**
 * Populate Policies box
 */
const populateSubPolicies = (data) => {
    let pol = data.subscriptionPolicies
    let li = '<li class="list-group-item">'
    let sp = '<span class="float-end">'
    let html = `
    ${li}Location Placement ID: ${sp}${pol.locationPlacementId}</span></li>
    ${li}Quota ID: ${sp}${pol.quotaId}</span></li>
    ${li}Spending Limit: ${sp}${pol.spendingLimit}</span></li>`
    document.querySelector('#subscriptionInfo #listSubPolicies').innerHTML = html
}
