// Using the D3 library to read in samples.json
d3.json("data/samples.json").then(function (data) {
    console.log(data);
});

function charts(sample) {
    d3.json("data/samples.json").then(function (data) {

        // Build the panel with metadata
        var metadata = data.metadata;
        // Filter the data for the object with the selected sample number
        var selectArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var select = selectArray[0];
        // select the location of the demographic info panel
        var panel = d3.select("#sample-metadata");
        // Use `.html("") to clear any existing metadata
        panel.html("");
        // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(select).forEach(([key, value]) => {
            panel
                .append('p')
                .text(`${key.toUpperCase()}: ${value}`)
        });


        // Build the BAR CHART - TOP 10 VALUES:
        var samples = data.samples;
        // Filter the data for the object with the selected sample number
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var otuIds = result.otu_ids;
        var labels = result.otu_labels;
        var sampleValues = result.sample_values;

        // log out to check
        console.log(`Sample values for ${sample}: ${sampleValues}`);
        console.log(`OTU ids for ${sample}: ${otuIds}`);
        console.log(`OTU labels for ${sample}: ${labels}`);

        // Sorting the array of sample values in descending order
        var sampleValuesSorted = Array.from(sampleValues).sort((a, b) => b - a);
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
            title: `Top 10 OTU's for ID No.${sample}`,
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
                color: otuIds,
                colorscale: 'Electric'
            }
        };

        var dataTwo = [trace2];

        var layout2 = {
            title: `All OTU's for ID No.${sample}`,
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

// Create the drop down
function dropdown() {
    // Reference to the dropdown select element
    var dDown = d3.select("#selDataset")

    // Use the list of sample names to populate the select options
    d3.json("data/samples.json").then((data) => {
        // pulling out the names
        var names = data.names;

        names.forEach((sample) => {
            // appends the rows in html with option tag
            dDown
                .append("option")
                .text(sample)
                .property("value", sample)
        });

        // Use the first sample from the list to build the initial plots
        var firstSample = names[0];
        charts(firstSample);
    });
};

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    charts(newSample);
}

dropdown();


