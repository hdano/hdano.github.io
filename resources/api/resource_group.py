"""
Reference: GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups?api-version=2021-04-01
"""
import requests

from .common import call_api


def get_resource_groups(subscription_id, access_token):
    url = ''.join([
        'https://management.azure.com/subscriptions/',
        subscription_id,
        '/resourcegroups?api-version=2021-04-01'
        ])
    return call_api(url, access_token)
