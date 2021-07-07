"""
Reference: https://docs.microsoft.com/en-us/rest/api/resources/subscriptions
"""
import requests

from .common import call_api


def get_subscriptions(access_token):
    url = ''.join([
        'https://management.azure.com/subscriptions?api-version=2020-01-01'
        ])
    return call_api(url, access_token)
