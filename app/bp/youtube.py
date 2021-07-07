from flask import Blueprint, render_template, abort, flash, request, redirect
from flask_login import login_required, current_user
from jinja2 import TemplateNotFound

from app.models import User
from app.forms import ProfileForm
from app import db


bp = Blueprint('youtube', __name__, template_folder='templates')


@bp.route('/youtube')
@login_required
def youtube():
    return render_template('youtube/index.html')
