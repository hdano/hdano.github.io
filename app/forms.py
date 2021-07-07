from flask_wtf import FlaskForm
from wtforms import Form, BooleanField, StringField, PasswordField, validators


class LoginForm(FlaskForm):
    email = StringField('Email Address', [validators.Length(min=6, max=35)])
    password = PasswordField('New Password', [validators.DataRequired()])


class ProfileForm(FlaskForm):
    name = StringField('Phone')
    email = StringField('Email Address', [validators.Length(min=6, max=35)])
    phone = StringField('Phone')
    address = StringField('Phone')
