from flask import Blueprint, render_template, abort
from flask_login import login_required
from jinja2 import TemplateNotFound

from app.models import User


bp = Blueprint('pages', __name__, template_folder='templates')


@bp.route('/', defaults={'page': 'index'})
@bp.route('/<page>')
@login_required
def pages(page):
    try:
        return render_template(f'pages/{page}.html')
    except TemplateNotFound:
        abort(404)
