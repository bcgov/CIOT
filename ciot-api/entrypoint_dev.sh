#!/bin/sh

./wait-for-it.sh ${POSTGRES_HOST}:5432

python3 manage.py runserver 0.0.0.0:8000

