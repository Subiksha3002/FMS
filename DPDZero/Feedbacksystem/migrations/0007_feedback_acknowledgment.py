# Generated by Django 5.2.3 on 2025-06-25 07:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Feedbacksystem', '0006_feedback'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='acknowledgment',
            field=models.BooleanField(default=False),
        ),
    ]
