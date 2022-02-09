
function buildMetaData(sample) {
    d3.json("samples.json").then((data) => {
      const metadata = data.metadata;
      console.log(metadata);

    const otuArray = metadata.filter(sampleObj => sampleObj.id == sample);
    const result = otuArray[0];
    const panelData = d3.select("#sample-metadata");
    panelData.html("");
    Object.entries(result).forEach(([key, value]) => {
      panelData.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}
//declaring variables to use in charts
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      const sampleData = data.samples;
      const otuArray = sampleData.filter(sampleObj => sampleObj.id == sample);
      const result = otuArray[0];
  
      const otu_ids = result.otu_ids;
      const otu_labels = result.otu_labels;
      const sample_values = result.sample_values;

      //bubble chart
    const bubbleChart = {
        title: "Bacteria Per Sample",
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
      };
      const bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];
      Plotly.newPlot("bubble", bubbleData, bubbleChart);
      
      //horizontal bar chart
      const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      const barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      const chartLayout = {
        title: "Top 10 Operational Taxonomic Units",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, chartLayout);
    });
  };
//dropdown menu
  function init() {
    const selectDropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
      const name = data.names;
  
      name.forEach((sample) => {
        selectDropdown
          .append("option")
          .text(sample)
          .property("value", sample);
      })
      const sampleData = name[0];
      buildCharts(sampleData);
      buildMetaData(sampleData);
    });
  };
  //changing data when user picks different sample
  function optionChange(newSample) {
    buildCharts(newSample);
    buildMetaData(newSample);
  };

  init()