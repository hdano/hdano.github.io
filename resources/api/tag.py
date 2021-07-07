"""
Get resource tags

Reference: GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/myPRNameSpace/VM/myVm/providers/Microsoft.Resources/tags/default?api-version=2021-04-01
"""
from flask import current_app

from .common import call_api


def get_tags(subscription_id, access_token):
    # get tags in subscription
    url = ''.join([
        'https://management.azure.com/subscriptions/', subscription_id,
        '/tagNames?api-version=2021-04-01'
        ])
    result = call_api(url, access_token)
    return result


def extract_tags(resources):
    # Extract tags properties for each resourcess
    items = []
    for r in resources:
        if 'tags' in r and len(r['tags'].keys()) > 0:
            item = dict(
                id=r['id'],
                resource_name=r['name'],
                resource_type=r['type'],
                resource_group=r['resourceGroup'],
                tags=', '.join([k+'='+r['tags'][k] for k in r['tags']])
                )
            items.append(item)
    return items
