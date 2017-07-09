function PagerDuty() {
  var https = require('https');
  var config = require('./config.json');

  var options = {
    host: 'api.pagerduty.com',
    port: 443,
    path: '/incidents?date_range=all',
    method: 'GET',
    headers: {
      "Authorization": `Token token=${config.key}`,
      "Accept": "application/vnd.pagerduty+json;version=2"
    }
  };

  var schema = {
    "type": "SCHEMA",
    "stream": "incidents",
    "key_properties": ["incident_number"],
    "schema": {
      "type": "object",
      "properties": {
        "incident_number": {"type": "integer"},
        "incident_key": {"type": "string"},
        "title": {"type": "string"},
        "description": {"type": "string"},
        "status": {"type": "string"},
        "last_status_change_at": {"type": "string", "format": "date-time"},
        "urgency": {"type": "string"},
        "service_summary": {"type": "string"},
      }
    }
  };

  function getRecord(inc) {
    return {
      type: "RECORD",
      stream: "incidents",
      record: inc
    };
  }

  function convertIncident(inc) {
    var incident = {
      "incident_number": inc.incident_number,
      "incident_key": inc.incident_key == null ? "" : inc.incident_key,
      "title": inc.title,
      "description": inc.description,
      "status": inc.status,
      "last_status_change_at": inc.last_status_change_at,
      "urgency": inc.urgency,
      "service_summary": inc.last_status_change_by.summary
    };
    return incident;
  }

  function requestData(page, limit) {
    options.path = `/incidents?limit=${limit}&offset=${page*limit}&date_range=all`;
    var req = https.request(options, function(res) {
      var response = "";

      res.on('data', function(d) {
        response += d;
      });

      res.on('end', function(d) {
        var incidents = JSON.parse(response).incidents;
        var more = JSON.parse(response).more;
        incidents.forEach( function(inc) {
          console.log(JSON.stringify(getRecord(convertIncident(inc))));
        });

        if (more && page < 2) {
          requestData(page+1, limit);
        }

      });
    });

    req.end();

    req.on('error', function(e) {
        console.error(e);
    });
  }

  var pd = {};

  pd.getIncidents = function() {
    console.log(JSON.stringify(schema));
    requestData(0, 100);
  }

  return pd;
}

var pd = new PagerDuty();
pd.getIncidents();
