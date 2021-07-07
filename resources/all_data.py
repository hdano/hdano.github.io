import requests

from flask import session, request
from flask_restful import Resource

from access_token import get_access_token

from .api.resource import get_resources, update_resources
from .api.storage import get_storages
from .api.subscription import get_subscriptions
from .api.tag import extract_tags
from .api.lock import get_locks


class AllData(Resource):
    access_token = None
    subscription_id = None

    def post(self):
        success = False
        result = None
        self.access_token = get_access_token(request)
        if self.access_token is None:
            result = dict(
                error='access-token',
                error_description='Cannot retrieve access token'
            )
        else:
            result = {}
            success = True
            json = request.get_json()
            data_selection = json['data_selection']
            self.subscription_id = json['subscription_id']
            resources = get_resources(
                self.subscription_id,
                self.access_token['access_token'])
            if 'resources' in data_selection:
                result['resources'] = update_resources(
                    resources,
                    json['resource_selection'],
                    self.subscription_id,
                    self.access_token['access_token'])
            if 'locks' in data_selection:
                result['locks'] = get_locks(
                    self.subscription_id,
                    self.access_token['access_token'])
            if 'tags' in data_selection:
                result['tags'] = extract_tags(resources)
            if 'storages' in data_selection:
                result['storages'] = get_storages(
                    self.subscription_id,
                    self.access_token['access_token']
                    )
            if 'subscriptions' in data_selection:
                result['subscriptions'] = get_subscriptions(
                    self.access_token['access_token']
                    )
        return dict(
            success=success,
            data=result
        )
