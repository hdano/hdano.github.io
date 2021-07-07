/**
 * Saves and retrieves values to/from local storage
 */
const dataFields = ['script_type', 'subscription_id', 'tenant_id', 'app_id', 'client_secret']
const saveLocalData = (data) => {
    dataFields.forEach((x) => {
        localStorage.setItem(x, data[x])    
    })
}
const getLocalData = () => {
    data = {}
    dataFields.forEach((x) => {
        data[x] = localStorage.getItem(x)
    })
    return data
}