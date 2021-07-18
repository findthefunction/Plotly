function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    var washingFreq = result.wfreq;
    
    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
     gaugeChart(washingFreq);

  });
}

//Bar Chart 
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesNumber = samplesArray.filter(sampleObj => sampleObj.id == sample); 


    //  5. Create a variable that holds the first sample in the array.
    var initialSample = samplesNumber[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = initialSample.otu_ids;
    var otu_labels = initialSample.otu_labels;
    var sample_values = initialSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(otu_id => 'OTU' + otu_id).reverse();
        
// check with map/slice switched
    
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      //text = hovertext
      type: 'bar',
      orientation: 'h',
      marker: {
        color: [],
         }
    }];

    for(let i=0; i<10; i++){
      barData[0].marker.color.push(`cornflowerblue`);
    }
    
    

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "<span style= 'color: rgb(192, 4, 98)'><b> Top 10 Bacteria Cultures Found </b> </span> ",
     xaxis: {title: "Bacteria OTU ID"},
   

      

    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
 



//Bubble Chart

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: 'bubble',
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Picnic'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<span style= 'color: rgb(192, 4, 98)'><b> Bacteria Cultures per Belly Button Sample </b></span>",
      xaxis: {title: "Bacteria Cultures"},
      yaxis: {title: "Bacteria OTU ID"},
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)

  });
}

//Gauge Chart
//3.select
    // var samplesNumber = samplesArray.filter(sampleObj => sampleObj.id == sample); 
    // Create a variable that holds the first sample in the array.
    // var initialSample = samplesNumber[0];

    // 4. Create the trace for the gauge chart.
  function gaugeChart (washingFreqval) {
  
    var gaugeData = [{
      domain: { x:[0,1], y:[0,1]},
      value: washingFreqval,
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
        bar: {color:'rgb(253, 141, 197)'},
        axis: {range: [0,10]},
        steps: [
        {range: [0,2], color: 'ghostwhite'},
        {range: [2,4], color: 'lavender'}, 
        {range: [4,6], color: 'cornflowerblue'},
        {range: [6,8], color: 'royalblue'},
        {range: [8,10], color: 'slateblue'} ]
      },
     
    }];
    



    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: { text: "<span style= 'color: rgb(192, 4, 98)'><b> Belly Button Washing Frequency</b> </span> <br> <span style= 'font-size: .8em; color: hotpink'> Scrubs per Week </span>"} ,
      width: 550,
      height: 400,

    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)


  }
