import secrets
import urllib
import logging

from flask import Flask, render_template
from flask_restful import Api

from resources.all_data import AllData

app = Flask(__name__)
api = Api(app)

app.logger.handlers.clear()
app.logger.addHandler(logging.StreamHandler())
app.logger.setLevel(logging.INFO)

app.secret_key = secrets.token_bytes(16)


template_context = dict(
    random_token=urllib.parse.quote_plus(secrets.token_bytes(16))
)


@app.route('/')
def home():
    return render_template('index.html', **template_context)


@app.route('/assessment')
def assessment():
    return render_template('assessment/index.html', **template_context)


@app.route('/scripts')
def scripts():
    return render_template('scripts.html', **template_context)


api.add_resource(AllData, '/api/all-data')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)
