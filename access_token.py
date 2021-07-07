import requests

from flask import session, request


def clear_access_token(request):
    json = request.get_json()
    subscription_id = json['subscription_id']
    app_id = json['app_id']
    session_name = 'access_token-%s-%s' % (subscription_id, app_id)
    session[session_name] = None


def get_access_token(request):
    json = request.get_json()
    subscription_id = json['subscription_id']
    tenant_id = json['tenant_id']
    app_id = json['app_id']
    client_secret = json['client_secret']
    session_name = 'access_token-%s-%s' % (subscription_id, app_id)
    if session.get(session_name) is None:
        session[session_name] = None
        url = 'https://login.microsoftonline.com/%s/oauth2/token' % tenant_id
        post_data = dict(
            grant_type='client_credentials',
            client_id=app_id,
            client_secret=client_secret,
            resource='https://management.azure.com/'
        )
        r = requests.post(url, data=post_data)
        try:
            rdata = r.json()
        except Exception as e:
            pass
            # app.logger.info('Unexpected response: %s' % r.text)
        else:
            if 'access_token' in rdata:
                session[session_name] = rdata
    return session.get(session_name)
