from datetime import datetime, timedelta
from .services import geocode_location, get_route
import math

class HOSSimulator:
    def __init__(self, cycle_used):
        self.cycle_used = float(cycle_used)
        self.shift_driving_time = 0
        self.shift_on_duty_time = 0
        self.consecutive_driving_time = 0
        self.current_time = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) # Start at midnight
        self.logs = []
        self.map_markers = []
        self.distance_since_fuel = 0
        self.total_distance = 0
        
        # Add initial 8-hour off duty log so the grid isn't empty from Midnight to 8 AM
        self.add_log("Off Duty", 8, "Pre-trip off duty")
        
    def add_log(self, status, duration_hours, description, location_coords=None):
        start_time = self.current_time
        self.current_time += timedelta(hours=duration_hours)
        self.logs.append({
            "status": status,
            "start": start_time.isoformat(),
            "end": self.current_time.isoformat(),
            "duration_hours": duration_hours,
            "description": description
        })
        
        if status in ["Driving", "On Duty"]:
            self.cycle_used += duration_hours
            self.shift_on_duty_time += duration_hours
            if status == "Driving":
                self.shift_driving_time += duration_hours
                self.consecutive_driving_time += duration_hours
        elif status in ["Off Duty", "Sleeper Berth"]:
            if duration_hours >= 10:
                self.shift_driving_time = 0
                self.shift_on_duty_time = 0
            if duration_hours >= 34:
                self.cycle_used = 0
            self.consecutive_driving_time = 0
            
        if location_coords and status in ["Off Duty", "Sleeper Berth", "On Duty"] and "Fuel" in description:
            self.map_markers.append({
                "type": "Fuel",
                "coordinates": location_coords,
                "description": description
            })
        elif location_coords and status in ["Off Duty"] and "Break" in description:
            self.map_markers.append({
                "type": "Break",
                "coordinates": location_coords,
                "description": description
            })
        elif location_coords and status in ["Sleeper Berth", "Off Duty"] and "Rest" in description:
            self.map_markers.append({
                "type": "Rest",
                "coordinates": location_coords,
                "description": description
            })

    def check_violations_and_rest(self, coords):
        # 70-Hour Rule
        if self.cycle_used >= 70:
            self.add_log("Off Duty", 34, "34-Hour Restart", coords)
            
        # 14-Hour Window or 11-Hour Driving Limit
        if self.shift_on_duty_time >= 14 or self.shift_driving_time >= 11:
            self.add_log("Sleeper Berth", 10, "10-Hour Rest", coords)
            
        # 30-Minute Break
        if self.consecutive_driving_time >= 8:
            self.add_log("Off Duty", 0.5, "30-Minute Break", coords)

def process_trip(current_loc, pickup_loc, dropoff_loc, cycle_used):
    coords_current = geocode_location(current_loc)
    coords_pickup = geocode_location(pickup_loc)
    coords_dropoff = geocode_location(dropoff_loc)
    
    sim = HOSSimulator(cycle_used)
    
    # Simple logic: we won't interpolate exact coordinates for breaks, we'll just put them at the start or end of a leg
    # or interpolate linearly between the start and end of a leg.
    
    def simulate_leg(start_coords, end_coords, label):
        try:
            route = get_route([start_coords, end_coords])
            props = route['features'][0]['properties']
            duration_hours = props['summary']['duration'] / 3600
            distance_miles = props['summary']['distance'] / 1609.34
            geometry = route['features'][0]['geometry']
        except Exception as e:
            print(f"!!! openRoutesService Error: {e}")
            # Fallback if routing fails
            duration_hours = 2
            distance_miles = 100
            geometry = {"type": "LineString", "coordinates": [start_coords, end_coords]}
        
        sim.total_distance += distance_miles
        
        # Simulate driving in 1-hour chunks
        chunks = int(math.ceil(duration_hours))
        for i in range(chunks):
            sim.check_violations_and_rest(start_coords)
            
            chunk_time = min(1.0, duration_hours - i)
            sim.add_log("Driving", chunk_time, f"Driving {label}")
            
            sim.distance_since_fuel += (distance_miles / duration_hours) * chunk_time
            if sim.distance_since_fuel >= 1000:
                sim.add_log("On Duty", 0.25, "Fueling Stop", start_coords)
                sim.distance_since_fuel = 0
                
        return geometry
        
    sim.map_markers.append({"type": "Start", "coordinates": coords_current, "description": current_loc})
    
    # Drive to pickup
    geom1 = simulate_leg(coords_current, coords_pickup, "to Pickup")
    
    sim.map_markers.append({"type": "Pickup", "coordinates": coords_pickup, "description": pickup_loc})
    sim.add_log("On Duty", 1.0, "Loading at Pickup", coords_pickup)
    
    # Drive to dropoff
    geom2 = simulate_leg(coords_pickup, coords_dropoff, "to Drop-off")
    
    sim.map_markers.append({"type": "Dropoff", "coordinates": coords_dropoff, "description": dropoff_loc})
    sim.add_log("On Duty", 1.0, "Unloading at Drop-off", coords_dropoff)
    
    sim.add_log("Off Duty", 0, "Trip End") # Marker for end of trip
    
    # Format the daily logs array
    # Group logs by day (24-hour periods) relative to the start time
    start_date = sim.logs[0]["start"][:10]
    
    return {
        "total_distance": round(sim.total_distance, 1),
        "map_data": {
            "route_geometry": [geom1, geom2],
            "markers": sim.map_markers
        },
        "log_data": sim.logs
    }
