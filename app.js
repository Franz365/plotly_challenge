// Helper function
function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
}


function init () {

    // Use d3.json() to fetch data from JSON file
    // The data from the JSON file is arbitrarily named importedData as the argument
    d3.json("data/samples.json").then((importedData) => {
        // console.log(importedData);
        var data = importedData

        var values = unpack(data.samples, "sample_values");
        var id = unpack(data.samples, "otu_ids");
        var labels = unpack(data.samples, "otu_labels" );
        
        // Trace1 for the bar chart
        var Trace1 = {
            x: values [0],
            y: id [0],
            name: labels [0],
            type: "bar",
            orientation: "h"
        };

        // chartData
        var chartData = [Trace1]

        // layout 

        // Render the plot
        Plotly.newplot("bar", chartData)
    });
}

init();