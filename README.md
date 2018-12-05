# tap-pagerduty
Pagerduty tap for singer.io

# Get a Pager Duty API key
https://support.pagerduty.com/v1/docs/using-the-api

# Running
`node tap-pagerduty.js | target-csv`

# Notes
- The tap pages through and retrieves every incident in your history. The config file requires a start date for replication, because the list endpoint only allows you to offset 10,000 records. The config property is called `since.
- There are lots of fields the tap ignores for simplicity, but adding the ones you need is fairly straight forward
- Currently it only retrieves incident data
