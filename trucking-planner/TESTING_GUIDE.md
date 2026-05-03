# 🚛 Trip & Compliance Planner: Testing Guide

Use these scenarios to verify that the application correctly calculates Hours of Service (HOS) compliance, inserts mandatory breaks, and logs fueling stops accurately.

---

## 🟢 Scenario 1: Standard Regional Trip (No Violations)
*Tests basic routing and automatic On-Duty logging.*

*   **Current Location:** Chicago, IL
*   **Pickup Location:** Milwaukee, WI
*   **Drop-off Location:** Indianapolis, IN
*   **Cycle Used:** 0
*   **What to look for:** 
    *   ~1.5h Driving to Milwaukee.
    *   **Automatic 1h On-Duty** for loading.
    *   ~4.5h Driving to Indianapolis.
    *   **Automatic 1h On-Duty** for unloading.
    *   *No violations or mandatory rests should appear.*

---

## 🟡 Scenario 2: The 8-Hour Rule (30-Min Break)
*Tests the mandatory 30-minute break after 8 hours of consecutive driving.*

*   **Current Location:** Dallas, TX
*   **Pickup Location:** Oklahoma City, OK
*   **Drop-off Location:** Denver, CO
*   **Cycle Used:** 10
*   **What to look for:**
    *   The total driving time will exceed 8 hours.
    *   Look for a **0.5h Off-Duty** entry titled "30-Minute Break" appearing automatically in the middle of the trip.

---

## 🟠 Scenario 3: Shift Limits (11h Drive / 14h On-Duty)
*Tests the mandatory 10-hour rest period.*

*   **Current Location:** Los Angeles, CA
*   **Pickup Location:** Las Vegas, NV
*   **Drop-off Location:** Salt Lake City, UT
*   **Cycle Used:** 45
*   **What to look for:**
    *   The driver will run out of shift time before reaching Salt Lake City.
    *   Look for a **10.0h Sleeper Berth** entry titled "10-Hour Rest" injected into the log.

---

## 🔴 Scenario 4: The 70-Hour Rule (34-Hour Restart)
*Tests the weekly cycle limit and the full reset logic.*

*   **Current Location:** Atlanta, GA
*   **Pickup Location:** Charlotte, NC
*   **Drop-off Location:** Washington, DC
*   **Cycle Used:** 68 (Only 2 hours remaining)
*   **What to look for:**
    *   The driver hits the limit almost immediately.
    *   Look for a massive **34.0h Off-Duty** entry titled "34-Hour Restart".
    *   The "Cycle Used" counter should reset to 0 after this rest.

---

## ⛽ Scenario 5: Transcontinental "Mega-Trip"
*Tests multiple fueling stops and stacked violations.*

*   **Current Location:** New York, NY
*   **Pickup Location:** Chicago, IL
*   **Drop-off Location:** Seattle, WA
*   **Cycle Used:** 20
*   **What to look for:**
    *   **Fueling:** Multiple **0.25h On-Duty** stops (every 1,000 miles).
    *   **Multiple Rests:** At least two or three **10-Hour Rests** will be required to cross the country.
    *   **Breaks:** 30-minute breaks required on every single day of the trip.

---

## 🔄 Scenario 6: High-Intensity Short Hauls
*Tests frequent On-Duty status changes without much driving.*

*   **Current Location:** Newark, NJ
*   **Pickup Location:** Jersey City, NJ
*   **Drop-off Location:** Brooklyn, NY
*   **Cycle Used:** 60
*   **What to look for:**
    *   Very short driving times but significant **On-Duty** time for loading/unloading in heavy traffic areas.
    *   Verification that the **14-hour daily window** is still enforced even if the **11-hour driving limit** is not reached.

---

## 📅 Scenario 7: Multi-Day Logistics (The Marathon)
*Tests how the application handles trips that span across multiple calendar days.*

*   **Current Location:** Miami, FL
*   **Pickup Location:** Minneapolis, MN
*   **Drop-off Location:** Phoenix, AZ
*   **Cycle Used:** 0
*   **What to look for:**
    *   The **Log Grid** should show multiple separate 24-hour grids (Day 1, Day 2, Day 3, etc.).
    *   Verify that the driver stops for a **10-hour rest** every single night.
    *   Check that the **Fueling stops** are correctly placed on the map across thousands of miles.

---

## 📈 Scenario 8: Cycle Recovery (Last Minute Restart)
*Tests a driver who is almost out of hours and needs a restart mid-trip.*

*   **Current Location:** Seattle, WA
*   **Pickup Location:** Portland, OR
*   **Drop-off Location:** Boise, ID
*   **Cycle Used:** 69.5 (Only 30 minutes remaining!)
*   **What to look for:**
    *   The driver will reach the 70-hour limit before even finishing the first leg to Portland.
    *   Look for a **34-Hour Restart** appearing very early in the logs.
    *   Verify that after the restart, the driver finishes the trip with a fresh 70-hour clock.

---


## 🛠️ How to Test
1.  Open the **Trip Planner** form.
2.  Enter the locations exactly as listed above.
3.  Set the **Cycle Used** hours.
4.  Click **Generate Route & Logs**.
5.  Check the **Log Grid** and **Summary Cards** to verify the numbers match the expectations.
