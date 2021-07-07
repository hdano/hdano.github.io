"""
References:
    https://management.azure.com/subscriptions/{subscriptionId}/resources?api-version=2021-04-01
    https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.ContainerService/managedClusters?api-version=2021-05-01
"""
import requests

from flask import current_app

from .common import call_api


def get_resources(subscription_id, access_token):
    url = ''.join([
        'https://management.azure.com/subscriptions/',
        subscription_id,
        '/resources?api-version=2021-04-01'
        ])
    raw_resources = call_api(url, access_token)
    resources = []
    for r in raw_resources:
        parsed_id = r['id'].split('/')
        r['resourceGroup'] = parsed_id[4]
        resources.append(r)
    return resources


def get_clusters(subscription_id, access_token):
    url = ''.join([
        'https://management.azure.com/subscriptions/',
        subscription_id,
        '/providers/Microsoft.ContainerService/managedClusters',
        '?api-version=2021-05-01'
        ])
    return call_api(url, access_token)


def get_cluster_credentials(subscription_id, access_token, resource):
    # user credentials
    user, monitoring, admin = [], [], []
    url = ''.join([
        'https://management.azure.com/subscriptions/', subscription_id,
        '/resourceGroups/', resource['resourceGroup'],
        '/providers/Microsoft.ContainerService/managedClusters/',
        resource['name'],
        '/listClusterUserCredential?api-version=2021-05-01'
        ])
    data = call_api(url, access_token, 'post')
    if 'kubeconfigs' in data:
        user = data['kubeconfigs']
    # monitoring
    url = ''.join([
        'https://management.azure.com/subscriptions/', subscription_id,
        '/resourceGroups/', resource['resourceGroup'],
        '/providers/Microsoft.ContainerService/managedClusters/',
        resource['name'],
        '/listClusterMonitoringUserCredential?api-version=2021-05-01'
        ])
    data = call_api(url, access_token, 'post')
    if 'kubeconfigs' in data:
        monitoring = data['kubeconfigs']
    # admin
    url = ''.join([
        'https://management.azure.com/subscriptions/', subscription_id,
        '/resourceGroups/', resource['resourceGroup'],
        '/providers/Microsoft.ContainerService/managedClusters/',
        resource['name'],
        '/listClusterAdminCredential?api-version=2021-05-01'
        ])
    data = call_api(url, access_token, 'post')
    if 'kubeconfigs' in data:
        admin = data['kubeconfigs']
    return dict(user=user, monitoring=monitoring, admin=admin)


def update_resources(raw_resources, selection, subscription_id, access_token):
    # filter based on selection
    raw_resources = [
        r for r in raw_resources if r['type'].split('/')[1] in selection
    ]
    # more details for clusters
    raw_clusters = get_clusters(subscription_id, access_token)
    clusters = {c['name']: c for c in raw_clusters}
    resources = []
    for r in raw_resources:
        if 'managedCluster' in r['type'] and r['name'] in clusters:
            r['details'] = clusters[r['name']]
            r['details']['credentials'] = get_cluster_credentials(
                subscription_id, access_token, r)
        resources.append(r)
    return resources
