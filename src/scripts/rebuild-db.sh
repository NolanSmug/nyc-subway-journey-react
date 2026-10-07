#!/bin/bash
set -e

rm -f gtfs.db
sqlite3 gtfs.db < gtfs_import.sql