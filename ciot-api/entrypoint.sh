#!/bin/sh

./wait-for-it.sh ${POSTGRES_HOST}:5432

exec uwsgi --http 0.0.0.0:8000 --master --processes 4 --threads 2 --wsgi-file admin/wsgi.py

