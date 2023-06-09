import axios from "axios";
import querystring from "querystring";
import Config from "../Config";

export async function getAddressData(address) {
  return axios
    .get(
      `https://geocoder.api.gov.bc.ca/addresses.json?addressString=${address}&autoComplete=true&matchPrecision=OCCUPANT,SITE,UNIT,CIVIC_NUMBER&maxResults=15`,
      {
        headers: {
          apikey: Config.geocoderKey,
        },
      }
    )
    .then((data) => data)
    .catch((err) => null);
}

export async function getAddressFromPoint(point) {
  return axios
    .get(
      `https://geocoder.api.gov.bc.ca/sites/nearest.json?point=${point[1]},${point[0]}&maxDistance=50`,
      {
        headers: {
          apikey: Config.geocoderKey,
        },
      }
    )
    .then((data) => data)
    .catch((err) => null);
}

export async function getResourceData(resourceId) {
  return axios
    .get(
      `https://catalogue.data.gov.bc.ca/api/3/action/datastore_search?resource_id=${resourceId}&limit=10000`
    )
    .then((data) => data.data.result.records)
    .catch(() => null);
}

export async function getDistanceViaRoutePlanner(mainCoords, resourceCoords) {
  const result = await axios.get(
    `https://router.api.gov.bc.ca/distance.json?points=${mainCoords[1]}%2C${mainCoords[0]}%2C${resourceCoords[1]}%2C${resourceCoords[0]}`,
    {
      headers: {
        apikey: Config.routePlannerKey,
      },
    }
  );
  return result;
}

function distanceBetween2Points(p1, p2) {
  try {
    const lat1 = p1[0] / (180 / Math.PI);
    const lat2 = p2[0] / (180 / Math.PI);
    const lon1 = p1[1] / (180 / Math.PI);
    const lon2 = p2[1] / (180 / Math.PI);
    const distance =
      6371 *
      Math.acos(
        Math.sin(lat1) * Math.sin(lat2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
      );
    return distance;
  } catch (error) {
    return null;
  }
}

export function addDistanceToResources(resources, coords) {
  return resources.map(async (resource) => {
    const distance = await getDistanceViaRoutePlanner(coords, [
      resource.LATITUDE || resource.Latitude || resource.SCHOOL_LATITUDE,
      resource.LONGITUDE || resource.Longitude || resource.SCHOOL_LONGITUDE,
    ]);
    const updatedResource = { ...resource, distance };
    return updatedResource;
  });
}

const addDistanceToResourcesMine = (resources, coords) =>
  resources.map((resource) => {
    const distance = distanceBetween2Points(coords, [
      resource.LATITUDE || resource.Latitude || resource.SCHOOL_LATITUDE,
      resource.LONGITUDE || resource.Longitude || resource.SCHOOL_LONGITUDE,
    ]);
    const updatedResource = { ...resource, distance };
    return updatedResource;
  });

function returnResourcesWithinMaxDistance(resources, maxDistance, coords) {
  const nearbyResources = resources.filter(
    (resource) =>
      distanceBetween2Points(coords, [
        resource.LATITUDE || resource.Latitude || resource.SCHOOL_LATITUDE,
        resource.LONGITUDE || resource.Longitude || resource.SCHOOL_LONGITUDE,
      ]) <= maxDistance
  );
  return nearbyResources;
}

export const getProximityData = async (coords, source) =>
  axios
    .get(
      `/api/opportunity/proximity/?${querystring.encode({
        lat: coords[0],
        lng: coords[1],
      })}`,
      {
        cancelToken: source.token,
      }
    )
    .then((data) => data.data)
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log("proximity request cancelled", thrown.message);
      }
      return null;
    });
