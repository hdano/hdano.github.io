from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate

from config import app_config

db = SQLAlchemy()
login_manager = LoginManager()


def create_app(config_name):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('config.py')
    db.init_app(app)

    login_manager.init_app(app)
    login_manager.login_message = 'You must be logged in to access this page'
    login_manager.login_view = 'auth.login'

    from .models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)

    migrate = Migrate(app, db)

    from .bp import pages, auth, youtube
    app.register_blueprint(pages.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(youtube.bp)

    # from app import models

    return app
