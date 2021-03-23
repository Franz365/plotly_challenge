// Using the D3 library to read in samples.json
d3.json("data/samples.json").then(function(data){ 
    console.log(data);
}); 

// Create the drop down
function dropdown() {
    var dDown = d3.select("#selDataset")
    d3.json("data/samples.json").then((data => {
        // pulling out the names
        var names = data.names; 
        names.forEach((sample) => {
            // appends the rows in html with option tag
            dDown.append("option").text(sample).property("value", sample)
        })
    }))
};
dropdown()

function init() {
    d3.json("data/samples.json").then(function(data) {
        // start info:
        var startInfo = data.metadata[0];
        // then appending it to the demographic info panel
        var select = d3.select("#sample-metadata");
        Object.entries(startInfo).forEach(([key,value]) =>{
            select
              .append('p').text(`${key} : ${value}`)
            });

        // EXTRACTING DATA FOR ID 940:
        var sample = data.samples[0];
        var idNumber = sample.id;        
        var sampleValues = sample.sample_values;
        var otuIds = sample.otu_ids;
        var labels = sample.otu_labels;

        // log out to check
        console.log(`Sample values for ${idNumber}: ${sampleValues}`);
        console.log(`OTU ids for ${idNumber}: ${otuIds}`);
        console.log(`OTU labels for ${idNumber}: ${labels}`);

        // BAR CHART - TOP 10 VALUES:
        // Sorting the array of sample values in descending order
        var sampleValuesSorted = Array.from(sampleValues).sort((a, b) => b-a);
        // Slicing the first 10 objects for plotting
        var sampleValuesSliced = sampleValuesSorted.slice(0, 10);
        // Reverse the array to accommodate Plotly's defaults
        var sampleValuesReversed = sampleValuesSliced.reverse();

        // Doing the same for the labels
        var otuIdsSliced = otuIds.slice(0, 10);
        var otuIdsReversed = otuIdsSliced.reverse();
        // Using map to create a new array with OTU added as a string infront of each ID 
        var otuIdLabels = otuIdsReversed.map(y => "OTU " + y);
        
        // Doing the same for the hover text
        var labelsSliced = labels.slice(0, 10);
        var labelsReversed = labelsSliced.reverse();

        // PLOTTING BAR CHART:
        var trace1 = {
            type: "bar",
            x: sampleValuesReversed,
            y: otuIdLabels,
            text: labelsReversed, 
            orientation: 'h'
        }

        var data = [trace1];

        var layout = {
            title: `Top 10 OTU's for ID No.${idNumber}`,
            margin: {
                l: 100,
                r: 100,
                b: 100,
                t: 100
            }
        } 

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", data, layout);

        
        // PLOTTING BUBBLE CHART 
        var trace2 = {
            x: otuIds, 
            y: sampleValues, 
            text: labels,
            mode: 'markers',
            marker: {
              size: sampleValues,
              color: otuIds
            }
          };
          
        var dataTwo = [trace2];
          
        var layout2 = {
            title: `All OTU's for ID No.${idNumber}`,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values"
            },
            showlegend: false,
            height: 600,
            width: 1000
          };
          
          // Render the plot to the div tag with id "bubble"
          Plotly.newPlot('bubble', dataTwo, layout2);

    });
}
init() 