/* eslint-disable */

// The total number of tweets from Columbia
const query = "SELECT count(*) AS n FROM tweets_nov_feb WHERE country='CO'"
// try changing airtime to arrdelay in the query
const query2 =
  "SELECT carrier_name as key0, AVG(airtime) AS val FROM flights_donotmodify WHERE airtime IS NOT NULL GROUP BY key0 ORDER BY val DESC LIMIT 100"
const defaultQueryOptions = {}
const connector = new window.MapdCon()

connector
  .protocol("https")
  .host("metis.mapd.com")
  .port("443")
  .dbName("mapd")
  .user("mapd")
  .password("HyperInteractive")
  .connectAsync()
  .then(session =>
    // now that we have a session open we can make some db calls:
    Promise.all([
      session.getTablesAsync(),
      session.getFieldsAsync("flights_donotmodify"),
      session.queryAsync(query, defaultQueryOptions),
      session.queryAsync(query2, defaultQueryOptions)
    ])
  )
  // values is an array of results from all the promises above
  .then(values => {
    // handle result of getTablesAsync
    console.log(values)
    console.log(
      "All tables available at metis.mapd.com:",
      values[0].map(x => x.name)
    )


    // handle result of getFieldsAsync
    console.log(
      "All fields for 'flights_donotmodify':",
      values[1].reduce((o, x) => Object.assign(o, { [x.name]: x }), {})
    )

    // handle result of first query
    document.getElementById("result-async").innerHTML =
      "There are " + values[2][0].n + " tweets from Columbia."
    console.log("Query 1 results:", Number(values[2][0].n))

    // handle result of 2nd query
    createRowChart(JSON.stringify(values[3]));
    console.log(
      "Query 2 results:",
      values[3].reduce((o, x) => Object.assign(o, { [x.key0]: x.val }), {})
    )
  })
  .catch(error => {
    console.error("Something bad happened: ", error)
  })

function createRowChart(data) {

   var vlSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
    "data": {
      "name": "table",
      "values":data
    },
    "mark": "bar",
    "encoding": {
      "y": {"field": "key0", "type": "nominal"},
      "x": {
        "aggregate": "average", "field": "val", "type": "quantitative",
        "axis": {
          "title": "Average of b"
        }
      }
    }
  };
  vegaEmbed("#vis", vlSpec);
}
