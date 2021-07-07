# Social Management

Flask + MySQL + Docker

## Running Locally

Create `.env` file for environment variables

```bash
cd <root folder>/
touch .env
```

Build and Run

```bash
docker-compose up --build
```

Migrate DB

```bash
docker-compose ps
docker exec -it <service name> flask db migrate
docker exec -it <service name> flask db upgrade
```

Create an account

```bash
docker exec -it <service name> python
```
```python
>>> from app import create_app, db, models
>>> app = create_app('development')
>>> with app.app_context():
...     u = models.User(email='')
...     u.set_password('')
...     db.session.add(u)
...     db.session.commit()
>>> 
```

Login to the webapp - http://localhost:8000