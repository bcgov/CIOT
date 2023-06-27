import datetime

from django.apps import apps
from django.db.models import Q, F, Sum, Avg, FloatField

from pipeline.constants import LOCATION_TYPES

def serialize_community_detail_fields(obj):
    return [{
        "key": "place_name",
        "value": obj.place_name,
        "metadata": {
            "name": "Community Name",
        },
    }, {
        "key": "population",
        "value": obj.incorporated and obj.census_subdivision.population,
        "metadata": {
            "name": "Population",
            "description": "Number of people living here",
        },
    }, {
        "key":
        "population_percentage_change",
        "value":
        obj.incorporated and (str(obj.census_subdivision.population_percentage_change) + "%"),
        "metadata": {
            "name": "Population Change",
            "description": "Change in # of people living here",
        },
    }, {
        "key": "priv_dwel",
        "value": obj.incorporated and obj.census_subdivision.priv_dwel,
        "metadata": {
            "name": "Homes",
            "description": "Number of homes build in this community",
        },
    }, {
        "key": "fn_community_name",
        "value": obj.fn_community_name,
        "metadata": {
            "name": "Indigenous Community Name",
        },
    }, {
        "key": "incorporated",
        "value": obj.incorporated,
        "metadata": {
            "name": "Incorporated",
        },
    }, {
        "key": "census_subdivision_id",
        "value": obj.census_subdivision_id,
        "metadata": {
            "name": "Census Subdivision",
        },
    }, {
        "key": "wildfire_zone_risk_class",
        "value": obj.wildfire_zone.risk_class if obj.wildfire_zone else "N/A",
        "metadata": {
            "name": "Wildfire Risk",
            "description": "WUI Risk Class rating between 1 (low) and 5 (extreme)",
        },
    }, {
        "key": "tsunami_zone",
        "value": obj.tsunami_zone.zone_class if obj.tsunami_zone else None,
        "metadata": {
            "name": "Tsunami Zone",
            "description": "A - C (moderate); D and E (low)",
        },
    }, {
        "key": "percent_50_10",
        "value": (commaize(obj.percent_50_10 * 100) if obj.percent_50_10 else "0") + "%",
        "metadata": {
            "name": "% of Community with High-Speed Internet (> 50/10 mbps)",
        }
    }]

def get_community_type_display_name(community_type):
    # TODO SY - move this into constants.py after resolving circular import
    COMMUNITY_TYPES = {
        "Urban": "Urban",
        "Rural": "Rural",
        "Remote Community": "Rural",
        "Urban First Nations Reserve": "Indigenous",
        "Rural First Nations Reserve": "Indigenous",
        "Urban First Nations Primary Reserve": "Indigenous",
        "Urban First Nations Secondary Reserve": "Indigenous",
        "Rural First Nations Primary Reserve": "Indigenous",
        "Rural First Nations Secondary Reserve": "Indigenous",
        "Remote First Nations Primary Reserve": "Indigenous",
    }
    return COMMUNITY_TYPES[community_type]

def serialize_location_assets(obj):
    from pipeline.models.general import DataSource

    locations = []
    for location_type in LOCATION_TYPES:
        data_source = DataSource.objects.get(name=location_type)
        model_class = apps.get_model("pipeline", data_source.model_name)
        location_assets = get_location_assets_for_community(model_class, obj)

        for location_asset in location_assets:
            temp = {
                "type":
                location_asset.location_type,
                "latitude":
                location_asset.get_latitude(),
                "longitude":
                location_asset.get_longitude(),
                "driving_distance":
                location_asset.driving_distance,
                "distance":
                location_asset.driving_distance
                if location_asset.driving_distance is not None else location_asset.distance,
                "travel_time":
                location_asset.travel_time,
                "within_municipality":
                location_asset.within_municipality,
                **{
                    field: getattr(location_asset, field)
                    for field in get_fields_for_location_type(location_asset.location_type)
                },
            }

            if hasattr(location_asset, 'project_name'):
                temp['project_name'] = location_asset.project_name

            locations.append(temp)

    return locations


def get_fields_for_location_type(location_type):
    common_fields = ["name", "location_phone", "location_email", "location_website"]

    return common_fields


def get_location_assets_for_community(model_class, community):
    from pipeline.models.location_assets import School, Project

    if model_class == School:
        school_districts = community.schooldistrict_set.all()
        return School.objects.filter(
            Q(distances__community=community) & Q(school_district__in=school_districts)
            & (Q(distances__driving_distance__lte=50)
               | (Q(distances__driving_distance__isnull=True) & Q(distances__distance__lte=50)))
        ).annotate(driving_distance=F('distances__driving_distance'),
                   distance=F('distances__distance'),
                   travel_time=F('distances__travel_time'),
                   within_municipality=F('distances__within_municipality'))
    if model_class == Project:
        return Project.objects.filter(
            Q(distances__community=community) & (
                Q(distances__driving_distance__lte=50) |
                (Q(distances__driving_distance__isnull=True) & Q(distances__distance__lte=50))
            )).annotate(
                driving_distance=F('distances__driving_distance'),
                distance=F('distances__distance'),
                travel_time=F('distances__travel_time'),
                within_municipality=F('distances__within_municipality'))\
            .order_by(
                'project_id', '-source_date').distinct('project_id')
    else:
        return model_class.objects.filter(
            Q(distances__community=community)
            & (Q(distances__driving_distance__lte=50)
               | (Q(distances__driving_distance__isnull=True) & Q(distances__distance__lte=50)))
        ).annotate(driving_distance=F('distances__driving_distance'),
                   distance=F('distances__distance'),
                   travel_time=F('distances__travel_time'),
                   within_municipality=F('distances__within_municipality'))

def get_quarterly_date_str_as_date(quarterly_date_str):
    """
    Get a quarterly date string, such as "2020-Q1" and return a Date object corresponding to
    the start date of the quarter (2020-01-01).
    """
    QUARTERLY_DATE_MAPPING = {
        "q1": {
            "month": 1,
            "day": 1,
        },
        "q2": {
            "month": 4,
            "day": 1,
        },
        "q3": {
            "month": 7,
            "day": 1,
        },
        "q4": {
            "month": 10,
            "day": 1,
        }
    }

    year_str, quarter = quarterly_date_str.split("-")
    year = int(year_str)
    try:
        month = QUARTERLY_DATE_MAPPING[quarter.lower()]["month"]
        day = QUARTERLY_DATE_MAPPING[quarter.lower()]["day"]
        return datetime.date(year, month, day)
    except KeyError:
        return None

def commaize(number):
    if number is None:
        return

    if isinstance(number, float):
        return '{:,.2f}'.format(number)
    elif isinstance(number, int):
        return '{:,}'.format(number)
