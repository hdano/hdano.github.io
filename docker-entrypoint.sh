#!/usr/bin/env bash

echo "Waiting for MySQL..."

while ! nc -z db 3306; do
  sleep 0.5
done

echo "MySQL started"

flask db init
flask db migrate
flask db upgrade

cd /Photos-Docker-Flask

# python run.py
# gunicorn run:app --bind=0.0.0.0:8000 --workers=2 --reload
uwsgi --py-autoreload=10 --ini deploy/uwsgi_config.ini 2>&1

