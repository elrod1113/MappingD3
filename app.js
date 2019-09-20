d3.select(window).on("resize", updateResize);
//Size is updated when browser loads
updateResize();
function updateResize() {
    console.log("inside updateResize")
var svgArea = d3.select("body").select("svg");
//Reload chart if needed
if (!svgArea.empty()) {
    svgArea.remove();
}

var svgWidth = 1000;
var svgHeight = 450;

var margin = {
    top: 20, 
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create SVG Wrapper
var svg = d3
.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

//Append
var ChartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, 
${margin.top})`);

//Initial Parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function xScale(data, chosenXAxis) {
    var XLinearScale = d3.scaleLinear()
    .domain(d3.min(data, d => d[chosenXAxis])  *0.8, d3.max(data, d => [chosenXAxis]) *1.2]).range()
}

function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear().domain([d3.min(data, d => d[chosenYAxis]) * 0.8, d3.max(data, d => d{chosenYAxis) * 1.2]).range([0, height]);
        return yLinearScale;
}

//Update Function
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}

//Update Y Axis
 renderYAxis(newYScale, yAxis) {
     var leftAxis = d3.axisLeft(newYScale);

     vAxis.transition()
        .duration(1000)
        .call(leftAxis);

        return yAxis;
}

//Update Circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[choseYAxis]));
    return circlesGroup;
}

//Update circle text
function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    textGroup.transition()     
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));
    return textGroup;
}
	//==========================================
	// function used for updating circles group with new tooltip
	function updateToolTip(chosenXAxis, chosenYAxis, textGroup) {
	

        if (chosenXAxis === "poverty") {
          var xlabel = "Poverty:";
        }
        else if (chosenXAxis === "age") {
            var xlabel = "Age:";
        }
        else {
          var xlabel = "Median Income:";
        }
      
  
      
  
        if (chosenYAxis === "healthcare") {
          var ylabel = "W/O Healthcare:";
        }
        else if (chosenYAxis === "smokes") {
          var ylabel = "Smokes:";
        }
      
  
        else {
          var ylabel = "Obese:";
        }
      
  
        var toolTip = d3.tip()
          .attr("class", "d3-tip")
          .offset([-8, 0])
          .html(function(d){
               return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
          });
      
  
        textGroup.call(toolTip);
      
  
        textGroup.on("mouseover", toolTip.show);
        textGroup.on("mouseout", toolTip.hide);
      }
      
  
      //==================================================
      //Import data from csv
      //==================================================
      
  
      
  
      // Retrieve data from the CSV file and execute everything below
      //d3.csv("assets/data/data.csv").then(sourceData => {
      
  
      var datafile = "./assets/data/data.csv"
      d3.csv(datafile).then(successHandle, errorHandle);
      function errorHandle(err){
        throw err;
      }
      
  
      var sourceData;
      
  
      function successHandle(data) {
      
  
      // parse data (x = poverty, age; y = healthcare )
      sourceData = data;
      data.forEach(function(data) {
          data.poverty = +data.poverty;
          data.age = +data.age;
          data.healthcare = +data.healthcare;
          data.income = +data.income;
          data.obesity = +data.obesity;
          data.smokes = +data.smokes;
          console.log(data.abbr);
        });
      
  
      
  
        //=============================================
      
  
        // x and y LinearScale function above csv import
        var xLinearScale = xScale(sourceData, chosenXAxis);
        var yLinearScale = yScale(sourceData, chosenYAxis);
      
  
        // Create yLinearScale function
        //var yLinearScale = d3.scaleLinear()
          //.domain([0, d3.max(sourceData, d => d.healthcare)])
         // .range([height, 0]);
      
  
        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
      
  
        // append x axis
        var xAxis = chartGroup.append("g")
          .classed("x-axis", true)
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
      
  
        // append y axis
        var yAxis = chartGroup.append("g")
          .classed("y-axis", true)
          .call(leftAxis);
      
  
        // append initial circles 
        var circlesGroup = chartGroup.selectAll(".stateCircle")
          .data(sourceData)
          .enter()
          .append("circle")
          .attr("class", "stateCircle")
          .attr("cx", d => xLinearScale(d[chosenXAxis]))
          .attr("cy", d => yLinearScale(d[chosenYAxis]))
          .attr("r", 20)
          //.attr("fill", "blue")
          //.attr("opacity", ".5");
      
  
        // Add state labels
        var textGroup = chartGroup.selectAll(".stateText")
          .data(sourceData)
          .enter()
          .append("text")
          .attr("class", "stateText")
          .text(function(d){return d.abbr})
          .attr("x", d => xLinearScale(d[chosenXAxis]))
          .attr("y", d => yLinearScale(d[chosenYAxis]))
      
  
      
  
      //===============================================
      //Make 3 x axis labels
      //===============================================
        var labelsGroup = chartGroup.append("g")
          .attr("transform", `translate(${width / 2}, ${height + 20})`);
        
        var povertyLabel = labelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("value", "poverty") // value to grab for event listener
          .classed("active", true)
          .text("In Poverty (%)");
      
  
        var ageLabel = labelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("value", "age") // value to grab for event listener
          .classed("inactive", true)
          .text("Age");
      
  
        var incomeLabel = labelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 60)
          .attr("value", "income") // value to grab for event listener
          .classed("inactive", true)
          .text("Household Income (Median)");
          
        //============================================
          //make 3 y axis labels
          //============================================
      // append y axis
        var ylabelsGroup = chartGroup.append("g")
          .attr("transform", "rotate(-90)")
          .attr("class", "axisText")
          .attr("x", 0 - (height / 2))
          .style("text-anchor", "middle");
      
  
        var obesityLabel = ylabelsGroup.append("text")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("value", "obesity")
          .classed("inactive", true)
          .attr("dy", "1em")
          .text("Obese (%)");
      
  
        var smokesLabel = ylabelsGroup.append("text")
          .attr("y", 20 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("value", "smokes")
          .classed("inactive", true)
          .attr("dy", "1em")
          .text("Smokes (%)");
      
  
          var healthcareLabel = ylabelsGroup.append("text")
          .attr("y", 40 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("value", "healthcare")
          .classed("inactive", true)
          .attr("dy", "1em")
          .text("W/O Healthcare (%)");
      
  
        //==============================================
      
  
        // updateToolTip function (above csv import)
        updateToolTip(chosenXAxis, chosenYAxis, textGroup);
        
        // x axis labels event listener
        labelsGroup.selectAll("text")
          .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
      
  
              // replaces chosenXAxis with value
              chosenXAxis = xvalue;
      
  
              // console.log(chosenXAxis)
      
  
              // functions here found above csv import
              // updates x scale for new data
              xLinearScale = xScale(data, chosenXAxis);
      
  
              // updates x axis with transition
              xAxis = renderAxes(xLinearScale, xAxis);
      
  
              // updates circles with new x values
              circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
      
  
              //update text in circles
              renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
      
  
              // updates tooltips with new info
              updateToolTip(chosenXAxis, chosenYAxis, textGroup);
      
  
              // changes classes to change bold text
              if (chosenXAxis === "poverty") {
                povertyLabel
                  .classed("active", true)
                  .classed("inactive", false);
                ageLabel
                  .classed("active", false)
                  .classed("inactive", true);
                incomeLabel
                  .classed("active", false)
                  .classed("inactive", true);
              }
              else if (chosenXAxis === "Age") {
                povertyLabel
                  .classed("active", false)
                  .classed("inactive", true);
                ageLabel
                  .classed("active", true)
                  .classed("inactive", false);
                incomeLabel
                  .classed("active", false)
                  .classed("inactive", true);
              } 
              else {  
                povertyLabel
                  .classed("active", false)
                  .classed("inactive", true);
                ageLabel
                  .classed("active", false)
                  .classed("inactive", true);
                incomeLabel
                  .classed("active", true)
                  .classed("inactive", false);
              }
            }
          });
      
  
          //======================================0000000
          ylabelsGroup.selectAll("text")
            .on("click", function() {
            var yvalue = d3.select(this).attr("value");
            if (yvalue !== chosenYAxis) {
      
  
            //replace the chosenYAxis with value
            chosenYAxis = yvalue;
          
            //update y value with new data
            yLinearScale = yScale(data, chosenYAxis);
      
  
            //Update y axis with transition
            yAxis = renderYAxis(yLinearScale, yAxis);
            
            //Update circles with new values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
      
  
            //Updates text and circles with new x values
            renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
      
  
            //update tooltips with new information
            updateToolTip(chosenXAxis, chosenYAxis, textGroup);
      
  
            //Change axis label to bold text
            if(chosenYAxis === "obesity") {
              obesityLabel
                .classed("active", true)
                .classed("inactive", false);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true);
              healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            }
          else if (chosenYAxis === "smokes") {
          obesityLabel
                .classed("active", false)
                .classed("inactive", true);
              smokesLabel
                .classed("active", true)
                .classed("inactive", false);
              healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true);
              healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
          }
          
          }
        });
      }
      };
  
   
  
