from flask import (
    Blueprint, render_template, abort, flash, request,  # is_safe_url,
    abort, redirect, url_for, current_app
)
from flask_login import login_required, logout_user, login_user
from jinja2 import TemplateNotFound

from app.models import User
from app.forms import LoginForm


bp = Blueprint('auth', __name__, template_folder='templates')


@bp.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if request.method == 'POST':
        current_app.logger.info(
            f'Logging in with "{form.email.data}" and "{form.password.data}"')
        if form.validate_on_submit():
            current_app.logger.debug([u.name for u in User.query.all()])
            user = User.query.filter_by(email=form.email.data).one_or_none()
            if user is not None:
                if user.check_password(form.password.data):
                    login_user(user)
                    flash('Logged in successfully.')
                    next = request.args.get('next')
                    # if not is_safe_url(next):
                    #    return abort(400)
                    return redirect(next or '/')
                else:
                    form.password.errors.append('Incorrect password')
            else:
                form.email.errors.append('Incorrect email')
    return render_template('auth/login.html', form=form)


@bp.route("/logout")
def logout():
    logout_user()
    return render_template('auth/logout.html')


@bp.route('/forgot-password')
def forgot_password():
    return render_template('auth/forgot-password.html')


@bp.route('/register')
def register():
    return render_template('auth/register.html')
