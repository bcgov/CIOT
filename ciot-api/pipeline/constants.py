WGS84_SRID = 4326

SOURCE_INTERNAL = 'internal'
SOURCE_DATABC = 'databc'
SOURCE_STATSCAN = 'statscan'
SOURCE_OPENCA = 'openca'
SOURCE_OTHER = 'other'

DATA_SOURCE_TYPE_CHOICES = (
    ("csv", "CSV"),
    ("api", "DATABC API"),
    ("shp", "SHP"),
)

DATA_SOURCE_CHOICES = (
    (SOURCE_INTERNAL, "Provided by Network BC team"),
    (SOURCE_DATABC, "BC Data Catalogue"),
    (SOURCE_STATSCAN, "Statistics Canada"),
    (SOURCE_OPENCA, "Open Government (Canada)"),
    (SOURCE_OTHER, "Other"),
)

LOCATION_TYPES = [
    'first_responders',
    'diagnostic_facilities',
    'timber_facilities',
    'civic_facilities',
    'airports',
    'port_and_terminal',
    'eao_projects',
    'laboratory_service',
    'economic_projects',
    'local_govt_offices',
    'emergency_social_service_facilities',
    'customs_ports_of_entry',
    'pharmacies',
    'public_library',
]
