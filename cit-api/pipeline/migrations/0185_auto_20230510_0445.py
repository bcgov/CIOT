# Generated by Django 2.2.28 on 2023-05-10 04:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pipeline', '0184_auto_20230426_2114'),
    ]

    operations = [
        migrations.AddField(
            model_name='indianreservebanddistance',
            name='community_id',
            field=models.ForeignKey(db_column='community_id', null=True, on_delete=django.db.models.deletion.SET_NULL, to='pipeline.Community'),
        ),
        migrations.AddField(
            model_name='municipalitydistance',
            name='community_id',
            field=models.ForeignKey(db_column='community_id', null=True, on_delete=django.db.models.deletion.SET_NULL, to='pipeline.Community'),
        ),
    ]