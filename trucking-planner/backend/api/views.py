from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from trips.hos import process_trip

class GenerateTripView(APIView):
    def post(self, request):
        current_loc = request.data.get("current_location")
        pickup_loc = request.data.get("pickup_location")
        dropoff_loc = request.data.get("dropoff_location")
        cycle_used = request.data.get("cycle_used", 0)
        
        if not all([current_loc, pickup_loc, dropoff_loc]):
            return Response({"error": "Missing locations"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            result = process_trip(current_loc, pickup_loc, dropoff_loc, cycle_used)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
