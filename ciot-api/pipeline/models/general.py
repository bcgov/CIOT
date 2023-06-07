from django.contrib.gis.db import models

from pipeline.constants import WGS84_SRID

class Hex(models.Model):
    # "PHH_ID","Avail_5_1_Dispo","Avail_10_2_Dispo","Avail_25_5_Dispo","Avail_50_10_Dispo","Avail_LTE_Mobile_Dispo"
    id = models.CharField(primary_key=True, max_length=12)
    geom = models.PolygonField()
    avail_5_1 = models.BooleanField(default=False)
    avail_10_2 = models.BooleanField(default=False)
    avail_25_5 = models.BooleanField(default=False)
    avail_50_10 = models.BooleanField(default=False)

class Road(models.Model):
    geom = models.MultiLineStringField(srid=WGS84_SRID, null=True)
    best_broadband = models.CharField(max_length=5)

class Municipality(models.Model):
    ID_FIELD = 'LGL_ADMIN_AREA_ID'
    NAME_FIELD = 'ADMIN_AREA_ABBREVIATION'

    area_id = models.IntegerField(null=True, help_text="Original ID of data point")
    name = models.CharField(max_length=127)
    geom = models.MultiPolygonField(srid=WGS84_SRID, null=True)
    geom_simplified = models.MultiPolygonField(srid=WGS84_SRID, null=True)
    oc_m_yr = models.CharField(
        max_length=4,
        help_text=
        "The four-digit year that the most recent Order-In-Council or Ministerial Order was approved, "
        " e.g., 2014.",
    )

    class Meta:
        ordering = ("id", )

    def __str__(self):
        return self.name

    """
    AA_ID 3
    * AA_NAME The Corporation of the Village of Burns Lake
    * ABRVN Burns Lake
    BDY_TYPE Legal
    AA_PARENT Regional District of Bulkley-Nechako
    CHNG_ORG MCSCD
    UPT_TYPE E
    UPT_DATE 20130429
    MAP_STATUS Not Appended
    OC_M_NMBR 1576
    * OC_M_YR 1994
    OC_M_TYPE OIC
    * WBST_RL
    IMAGE_URL
    AFCTD_AREA
    AREA_SQM 8986418.5648
    LENGTH_M 58666.4092
    * SHAPE 0
    OBEJCTID 1442
    """


class SchoolDistrict(models.Model):
    ID_FIELD = 'ADMIN_AREA_SID'
    NAME_FIELD = 'SCHOOL_DISTRICT_NAME'

    area_id = models.IntegerField(null=True, help_text="Original ID of data point")
    name = models.CharField(max_length=127)
    geom = models.MultiPolygonField(srid=WGS84_SRID, null=True)
    geom_simplified = models.MultiPolygonField(srid=WGS84_SRID, null=True)
    sd_num = models.CharField(max_length=5, )
    community = models.ManyToManyField('Community')

    class Meta:
        ordering = ("id", )

    def __str__(self):
        return self.name

    """
    {'ADMIN_SID': 121, 'SD_NAME': 'Southeast Kootenay', 'SD_NUM': 5, 'FCODE': 'FA91800600', 'SHAPE': 0, 'AREA_SQM': 12518364167.6713, 'FEAT_LEN': 729284.9581, 'OBJECTID': 1}
    """


class RegionalDistrict(models.Model):
    ID_FIELD = 'LGL_ADMIN_AREA_ID'
    NAME_FIELD = 'ADMIN_AREA_NAME'

    area_id = models.IntegerField(null=True, help_text="Original ID of data point")
    name = models.CharField(max_length=127)
    geom = models.MultiPolygonField(srid=WGS84_SRID, null=True)
    geom_simplified = models.MultiPolygonField(srid=WGS84_SRID, null=True)
    oc_m_yr = models.CharField(
        null=True,
        max_length=4,
        help_text=
        "The four-digit year that the most recent Order-In-Council or Ministerial Order was approved, "
        " e.g., 2014.",
    )

    class Meta:
        ordering = ("name", )

    def __str__(self):
        return self.name


class WildfireZone(models.Model):
    NAME_FIELD = 'FIRE_ZONE,LABEL'

    area_id = models.IntegerField(null=True, help_text="Original ID of data point")
    name = models.CharField(max_length=127)
    #zone_name = models.CharField(max_length=127, null=True)
    geom = models.MultiPolygonField(srid=WGS84_SRID, null=True)
    geom_simplified = models.MultiPolygonField(srid=WGS84_SRID, null=True)
    risk_class = models.CharField(
        max_length=1,
        help_text=
        "A class value signifying the communities WUI Risk Class rating between 1 (low) and 5 "
        "(extreme).",
    )  # 1-5

    def __str__(self):
        return self.name


class TsunamiZone(models.Model):
    NAME_FIELD = 'TSUNAMI_NOTIFY_ZONE_ID'

    area_id = models.IntegerField(null=True, help_text="Original ID of data point")
    name = models.CharField(max_length=127)
    tsunami_zone_name = models.CharField(max_length=127, null=True)
    geom = models.MultiPolygonField(srid=WGS84_SRID, null=True)
    geom_simplified = models.MultiPolygonField(srid=WGS84_SRID, null=True)
    zone_class = models.CharField(
        max_length=1,
        help_text=
        "See https://www2.gov.bc.ca/gov/content/safety/emergency-preparedness-response-recovery/"
        "preparedbc/know-your-hazards/tsunamis - A-C:moderate D,E:low",
    )

    # "Tsunamis are rare but serious events. Many areas of coastal B.C. may be threatened in the event
    # of a tsunami. However, it is generally accepted by scientific and technical experts that Victoria,
    # eastern Vancouver Island, Vancouver and the lower mainland are low-risk areas."
    # --
    # Intretation for labelling purpose:
    # A-C moderate
    # D,E, low
    # otherwise, none.

    def __str__(self):
        return self.name
