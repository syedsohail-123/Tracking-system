import os
import openrouteservice

def get_ors_client():
    api_key = os.getenv("OPENROUTESERVICE_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTESERVICE_API_KEY is not set")
    return openrouteservice.Client(key=api_key)

def geocode_location(location_str):
    ors = get_ors_client()
    result = ors.pelias_search(text=location_str)
    if not result.get("features"):
        raise ValueError(f"Could not geocode location: {location_str}")
    coords = result["features"][0]["geometry"]["coordinates"]
    return coords # [lon, lat]

def get_route(coords_list):
    ors = get_ors_client()
    route = ors.directions(
        coordinates=coords_list,
        profile='driving-hgv',
        format='geojson',
        instructions=False
    )
    return route
