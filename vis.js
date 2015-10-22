/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1060 - margin.left - margin.right,
    height = 620 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 


var feature_num=0, feature_select;

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + 100 + "," + 70 + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("./feature.csv", function(error, data) {
  feature_num=d3.keys(data[0]).length-2;
  feature_select=new Array(feature_num);
  for(var i=0;i<feature_num;i++) feature_select[i]=0;
  
  //initiate feature bar
    d3.select("body").select(".feature_outer")
          .append("div").attr("class","feature").attr("id","feature-1")
          .style("top",(0)+"%")
          .style("left",0+"%")
          .attr("width",100+"%")
          .style("height",(13)+"%");
    d3.select("body").select(".feature_outer").select("#feature-1")
            .append("p").attr("class","feature_p").attr("id","feature_p-1")
            .text("Features");
    for(var p=0;p<feature_num;p++){
        d3.select("body").select(".feature_outer")
          .append("div").attr("class","feature").attr("id","feature"+p)
          .style("top",(14+86/feature_num*(p))+"%")
          .style("left",0+"%")
          .attr("width",100+"%")
          .style("height",(83/feature_num)+"%")
          .on("click",function(){
              if(feature_select[parseInt(this.id.substring(7,this.id.length))]==0){
                  var k=1;
                  for(var i=0;i<feature_select.length;i++){ if(feature_select[i]==1){ k++;} }
                  if(k==1){//this is the first selected feature
                    d3.select(this).style("background","rgb(230,230,230)"); 
                    feature_select[parseInt(this.id.substring(7,this.id.length))]=1;
                    d3.select("#feature_p"+(parseInt(this.id.substring(7,this.id.length)))).style("color","rgba(0,0,0,1)");
                  }
                  else if(k==2){//this is the second festure, draw graph
                    d3.select(this).style("background","rgb(230,230,230)");
                    feature_select[parseInt(this.id.substring(7,this.id.length))]=1;
                    d3.select("#feature_p"+(parseInt(this.id.substring(7,this.id.length)))).style("color","rgba(0,0,0,1)");
                    var t=0; var feature1, feature2;
                    for(var i=0;i<feature_select.length;i++){ if(feature_select[i]==1){ feature2=i; t++;} }
                    feature1=feature_select.indexOf(1);
                    draw(feature1, feature2);
                  }
              }
              else{
                  feature_select[parseInt(this.id.substring(7,this.id.length))]=0;
                  var name="#feature"+(this.id.substring(7,this.id.length));
                  d3.select(name).style("background","rgba(119,119,119,1)");
                  d3.select("#feature_p"+(parseInt(this.id.substring(7,this.id.length)))).style("color","white");
              }
          });
          d3.select("body").select(".feature_outer").select("#feature"+p)
            .append("p").attr("class","feature_p").attr("id","feature_p"+p)
            .text(d3.keys(data[0])[p+2]);
      }
 
    function draw(f1, f2){
//        d3.select("body").select("svg").selectAll("*").remove();
        // change string (from CSV) into number format
        svg.selectAll("*").remove();
        data.forEach(function(d) {
          d[d3.keys(data[0])[f1+2]] = +d[d3.keys(data[0])[f1+2]];
          d[d3.keys(data[0])[f2+2]] = +d[d3.keys(data[0])[f2+2]];
        //    console.log(d);
        });
        // setup x 
        var xValue = function(d) { return d[d3.keys(data[0])[f1+2]];}, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) { return xScale(xValue(d));}, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        // setup y
        var yValue = function(d) { return d[d3.keys(data[0])[f2+2]];}, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) { return yScale(yValue(d));}, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left");

        // setup fill color
        var cValue = function(d) { return d.Price;},
            color = d3.scale.category10();

      // don't want dots overlapping axis, so add in buffer to data domain
    //  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    //  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
      xScale.domain([0, d3.max(data, xValue)*1.1]);
      yScale.domain([d3.min(data, yValue), d3.max(data, yValue)*1.1]);

      // x-axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text(d3.keys(data[0])[f1+2]);

      // y-axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(d3.keys(data[0])[f2+2]);

      // draw dots
      svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 4.5)
          .attr("cx", xMap)
          .attr("cy", yMap)
          .style("fill", function(d) { return color(cValue(d));}) 
          .on("mouseover", function(d) {
              tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
              tooltip.html(d["Name"] + "<br/> (" + xValue(d) 
                    + ", " + yValue(d) + ")")
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
          });

      // draw legend
      var legend = svg.selectAll(".legend")
          .data(color.domain())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { 
                var ii=0;
                switch(d){
                  case "Economy": ii=0; break;
                  case "Premium": ii=1; break;
                  case "Luxury": ii=2; break;
              }
              return "translate(0," + ii * 24 + ")"; 
          });

      // draw legend colored rectangles
      legend.append("rect")
          .attr("x", width - 20)
          .attr("width", 20)
          .attr("height", 20)
          .style("fill", color);

      // draw legend text
      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d;})
    }
});
