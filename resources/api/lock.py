"""
Get management locks

Reference: https://docs.microsoft.com/en-us/rest/api/resources/management-locks/list-at-subscription-level
"""
from .common import call_api


def get_locks(subscription_id, access_token):
    # get locks in subscription
    url = ''.join([
        'https://management.azure.com/subscriptions/', subscription_id,
        '/providers/Microsoft.Authorization/locks?api-version=2016-09-01'
        ])
    result = call_api(url, access_token)
    return result
