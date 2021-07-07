"""
Reference: GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Storage/storageAccounts?api-version=2021-04-01
"""
from .common import call_api


def get_storages(subscription_id, access_token):
    url = ''.join([
        'https://management.azure.com/subscriptions/', subscription_id,
        '/providers/Microsoft.Storage/storageAccounts?api-version=2021-04-01'
        ])
    result = call_api(url, access_token)
    return result
