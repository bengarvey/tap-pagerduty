# tap-pagerduty
Pagerduty tap for singer.io

# Get a Pager Duty API key
https://support.pagerduty.com/v1/docs/using-the-api

# Running
`node tap-pagerduty.js | target-csv`

# Notes
- The tap pages through and retrives every incident in your history
- There are lots of fields the tap ignores for simplicity, but adding the ones you need is fairly straight forward
- Currently it only retrieves incident data
