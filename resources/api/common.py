import json
import requests

from flask import current_app, jsonify, session, request

from access_token import clear_access_token, get_access_token


def call_api(url, access_token, http_method=None):
    current_app.logger.info('-------call_api start-----------')
    current_app.logger.info('API Call: %s %s' % (
        http_method or 'get', url))
    result = None
    headers = {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
        }
    if http_method == 'post':
        r = requests.post(url, headers=headers)
    else:
        r = requests.get(url, headers=headers)
    current_app.logger.info('Status Code: %s' % r.status_code)
    try:
        rdata = r.json()
    except Exception as e:
        current_app.logger.info('Did not return JSON: %s' % r.text)
        rdata = r.text
    if 'error' in rdata:
        current_app.logger.info(rdata['error'])
        if rdata['error'] == 'ExpiredAuthenticationToken':
            clear_access_token(request)
            access_token = get_access_token(request)
            result = call_api(url, access_token, http_method, request)
        else:
            result = dict(error=rdata['error'])
            if 'error_description' in rdata:
                result[name]['error_description'] = rdata['error_description']
    else:
        current_app.logger.info('Response Preview: %s' % (
            json.dumps(rdata)[:100]))
        result = rdata
        if 'value' in rdata:
            result = rdata['value']
    return result
