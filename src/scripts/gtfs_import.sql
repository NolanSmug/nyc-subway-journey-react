.mode csv

.import gtfs_subway/stops.txt stop
.import gtfs_subway/routes.txt route
.import gtfs_subway/trips.txt trip
.import gtfs_subway/transfers.txt transfer
.import gtfs_subway/stop_times.txt stop_time

CREATE INDEX idx_stop_time_trip
ON stop_time(trip_id);

CREATE INDEX idx_stop_time_stop
ON stop_time(stop_id);

CREATE INDEX idx_trip_id
ON trip(trip_id);

CREATE INDEX idx_trip_route
ON trip(route_id);

CREATE INDEX idx_stop_id
ON stop(stop_id);