SELECT
    T.route_id,
    T.trip_headsign,
    T.trip_id,
    COUNT(DISTINCT P.stop_id) AS station_count
FROM Trip AS T
JOIN StopTime AS ST
    ON T.trip_id = ST.trip_id
JOIN Stop AS S
    ON S.stop_id = ST.stop_id
JOIN Stop AS P
    ON P.stop_id = S.parent_station
WHERE T.service_id = 'Weekday'
  AND P.location_type = 1
GROUP BY T.route_id, T.trip_headsign
ORDER BY T.route_id, station_count DESC;