from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from app import db, login_manager


class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Text, nullable=False)
    password = db.Column(db.Text, nullable=False)
    name = db.Column(db.Text)
    phone = db.Column(db.Text)
    address = db.Column(db.Text)
    discipler_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    discipler = db.relationship(
        'User', primaryjoin='User.discipler_id == User.id')
    '''
    hostings = db.relationship(
        'LifeGroup', backref=db.backref('host_id'))
    leadings = db.relationship(
        'LifeGroup', backref=db.backref('leader_id'))
    lifegroups = db.relationship('LifeGroup', secondary='LifeGroupMember')
    hostings = db.relationship('LifeGroup', secondary='LifeGroupHost')
    '''

    @property
    def disciples(self):
        return User.query.findall(discipler_id=self.id)

    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(
            password,
            method='sha256'
        )

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return True

    def get_id(self):
        return self.id

    def can_edit_profile(self, user_id):
        if user_id != self.id:
            disciple_ids = [d.id for d in self.disciples]
            return user_id in disciple_ids
        return True


'''
class LifeGroup(UserMixin, db.Model):
    __tablename__ = 'lifegroup'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    address = db.Column(db.Text)
    schedule = db.Column(db.Text)
    host_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    leader_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    host = db.relationship('User', back_populates='hostings')
    leader = db.relationship('User', back_populates='leadings')
    members = db.relationship('User', secondary='LifeGroupMember')
    hosts = db.relationship('User', secondary='LifeGroupHost')


class LifeGroupMember(UserMixin, db.Model):
    __tablename__ = 'lifegroup_member'
    id = db.Column(db.Integer, primary_key=True)
    lifegroup_id = db.Column(db.Integer, db.ForeignKey("lifegroup.id"))
    member_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    lifegroup = db.relationship(LifeGroup, backref=db.backref(
        "members", cascade="all, delete-orphan"))
    member = db.relationship(User, backref=db.backref(
        "lifegroups", cascade="all, delete-orphan"))


class LifeGroupHost(UserMixin, db.Model):
    __tablename__ = 'lifegroup_host'
    id = db.Column(db.Integer, primary_key=True)
    lifegroup_id = db.Column(db.Integer, db.ForeignKey("lifegroup.id"))
    host_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    lifegroup = db.relationship(LifeGroup, backref=db.backref(
        "hosts", cascade="all, delete-orphan"))
    host = db.relationship(User, backref=db.backref(
        "hostings", cascade="all, delete-orphan"))
'''
