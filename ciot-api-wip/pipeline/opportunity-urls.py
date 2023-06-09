from django.urls import path, re_path, include

from rest_framework.routers import DefaultRouter

from pipeline.views.opportunity.create import OpportunityCreateView
from pipeline.views.opportunity.edit import OpportunityView
from pipeline.views.opportunity.get import OpportunityGetView
from pipeline.views.opportunity.list import OpportunitiesList
from pipeline.views.opportunity.export import OpportunitiesListExport

from pipeline.views.options import OptionsView

from pipeline.views.users.user import UserListView
from pipeline.views.users.user import UserView
from pipeline.views.proximity import ProximityView

router = DefaultRouter()

urlpatterns = [
    path("", include(router.urls)),
    re_path(r"^export/$", OpportunitiesListExport.as_view()),
    re_path(r"^list/$", OpportunitiesList.as_view()),
    re_path(r"^single/$", OpportunityCreateView.as_view()),
    re_path(r"^single/(?P<id>\w+)/$", OpportunityGetView.as_view()),
    re_path(r"^single/edit/(?P<id>\w+)/$", OpportunityView.as_view()),
    re_path(r"^options/$", OptionsView.as_view()),
    # re_path(r"^options/census-economic-regions/$", CensusEconomicRegionOptions.as_view()),
    # url(r"^options/census-subdivisions/$", CensusSubdivisionOptions.as_view()),
    # url(r"^options/communities/$", CommunityOptions.as_view()),
    # re_path(r"^options/health-authority-boundaries/$", HealthAuthorityBoundaryOptions.as_view()),
    # url(r"^options/natural-resource-regions/$", NaturalResourceRegionOptions.as_view()),
    # url(r"^options/regional-districts/$", RegionalDistrictOptions.as_view()),
    # url(r"^options/school-districts/$", SchoolDistrictOptions.as_view()),
    # url(r"^options/tourism-regions/$", TourismRegionOptions.as_view()),
    # url(r"^options/tsunami-zones/$", TsunamiZoneOptions.as_view()),
    # url(r"^options/wildfire-zones/$", WildfireZoneOptions.as_view()),
    re_path(r"^proximity/$", ProximityView.as_view()),
    re_path(r"^users/$", UserListView.as_view()),
    re_path(r"^user/$", UserView.as_view()),
    # url(r"^user/tracking/$", pipeline.views.users.tracking.UserTrackingView.as_view()),
]