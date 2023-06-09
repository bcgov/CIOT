from django.contrib.gis.db import models

from pipeline.constants import WGS84_SRID

class IndianReserveBandName(models.Model):
    ID_FIELD = 'CLAB_ID'
    NAME_FIELD = 'BAND_NAME'

    name = models.CharField(max_length=127)
    band_name = models.CharField(max_length=127)
    english_name = models.CharField(max_length=127)
    band_number = models.IntegerField(null=True)
    area_id = models.IntegerField(null=True, help_text="Original ID of data point")
    feature_area_sqm = models.IntegerField(null=True)
    geom = models.MultiPolygonField(srid=WGS84_SRID, null=True)
    geom_simplified = models.MultiPolygonField(srid=WGS84_SRID, null=True)

    class Meta:
        ordering = ("id", )

    def __str__(self):
        return self.name
