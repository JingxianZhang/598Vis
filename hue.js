/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var price;
d3.csv("./feature.csv", function(error, data) {
    price=new Array(item_num);
    for(var i=0;i<item_num;i++) price[i]=data[i]['Price'];
});

var hue=1, saturation=0;
var csv_file="./hsv2.csv";
var brand=0;
d3.select("body").select("#gobutton").style("background","#399630");
draw_histo(0);
function f_hue(){
    hue = 1;
    saturation = 0;
    csv_file="./hsv2.csv";
    d3.select("body").select("#gobutton").style("background","#399630");
    d3.select("body").select("#gobutton1").style("background","#35b128");
    d3.select("body").select("#gobutton1").on("mouseover",function(){
        d3.select("body").select("#gobutton1").style("background","#399630");
    })
    .on("mouseout",function(){
        d3.select("body").select("#gobutton1").style("background","#35b128");
    });
    d3.select("body").select("#gobutton").on("mouseover",function(){
        return null;
    })
    .on("mouseout",function(){
        return null;
    });
    draw_histo(brand);
    d3.select("#feature"+brand).style("background","rgb(230,230,230)");
    d3.select("#feature_p"+brand).style("color","rgba(0,0,0,1)");
                  
}
function f_saturation(){
    hue = 0;
    saturation = 1;
    csv_file="./hsv3.csv";
    d3.select("body").select("#gobutton1").style("background","#399630");
    d3.select("body").select("#gobutton").style("background","#35b128");
    d3.select("body").select("#gobutton").on("mouseover",function(){
        d3.select("body").select("#gobutton").style("background","#399630");
    })
    .on("mouseout",function(){
        d3.select("body").select("#gobutton").style("background","#35b128");
    });
    d3.select("body").select("#gobutton1").on("mouseover",function(){
        return null;
    })
    .on("mouseout",function(){
        return null;
    });
    draw_histo(brand);
}
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1060 - margin.left - margin.right,
    height = 620 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 


var item_num=0, item_select;

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + 100 + "," + 70 + ")");
d3.select("body").select(".feature_outer").style("overflow-y", "auto")
// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv(csv_file, function(error, data) {
  item_num=d3.keys(data[0]).length;
  item_select=new Array(item_num);
  for(var i=0;i<item_num;i++) item_select[i]=0;
  
  //initiate feature bar
    d3.select("body").select(".feature_outer").select(".svg1")
          .append("div").attr("class","feature").attr("id","feature-1")
          .style("top",(0)+"%")
          .style("left",0+"%")
          .attr("width",100+"%")
          .style("height",(45)+"px");
    d3.select("body").select(".feature_outer").select(".svg1").select("#feature-1")
            .append("p").attr("class","feature_p").attr("id","feature_p-1")
            .text("Features");
    for(var p=0;p<item_num;p++){
        d3.select("body").select(".feature_outer").select(".svg1")
          .append("div").attr("class","feature").attr("id","feature"+p)
          .style("top",(46*p+65)+"px")
          .style("left",0+"%")
          .attr("width",100+"%")
          .style("height",(45)+"px")
          .on("click",function(){
              if(item_select[parseInt(this.id.substring(7,this.id.length))]==0){
                  var k=1;
                  for(var i=0;i<item_select.length;i++){ item_select[i]==0;}
                  d3.selectAll(".feature").style("background","rgb(119,119,119)"); 
                  d3.select(this).style("background","rgb(230,230,230)");
//                  d3.select("#feature_p"+(parseInt(this.id.substring(7,this.id.length)))).style("color","rgba(0,0,0,1)");
                  item_select[parseInt(this.id.substring(7,this.id.length))]==1;
                  brand=parseInt(this.id.substring(7,this.id.length));
                  draw_histo(brand);
              }
          });
          d3.select("body").select(".feature_outer").select(".svg1").select("#feature"+p)
            .append("p").attr("class","feature_p").attr("id","feature_p"+p)
            .text(d3.keys(data[0])[p])
            .style("color",function(){
                if(price[p]=="Luxury") return "#1f77b4";
                else if(price[p]=="Premium") return "#2ca02c";
                else if(price[p]=="Economy") return "#ff7f0e";
          });
    }
    d3.select("#feature0").style("background","rgb(230,230,230)");
});

function draw_histo(nn){
//        d3.select("body").select("svg").selectAll("*").remove();
    // change string (from CSV) into number format
    d3.csv(csv_file, function(error, data) {
        item_num=d3.keys(data[0]).length;
        item_select=new Array(item_num);
        for(var i=0;i<item_num;i++) item_select[i]=0;
        svg.selectAll("*").remove();
        data.forEach(function(d) {
          d[d3.keys(data[0])[nn]] = +d[d3.keys(data[0])[nn]];
        //    console.log(d);
        });
//        var x = d3.scale.ordinal()
//            .rangeRoundBands([0, width], .1);
        var x = d3.scale.linear()
            .domain([0, 101+80*(hue)])
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

//        x.domain(d3.keys(data[0]).map(function(d, i) { return i; }));

        y.domain([0, d3.max(data, function(d) { return d[d3.keys(data[0])[nn]];})]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(function(){
                return hue==0? "Saturation":"Hue";
        });

        function HSVtoRGB(h, s, v) {
            var r, g, b, i, f, p, q, t;
            if (arguments.length === 1) {
                s = h.s, v = h.v, h = h.h;
            }
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
            return "rgba("+Math.round(r * 255)+","+Math.round(g * 255)+","+Math.round(b * 255)+",0.7)";
        }

        svg.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) {return x(i); })
            .attr("width", width/(180-76*saturation))
            .attr("y", function(d) { return y(d[d3.keys(data[0])[nn]]); })
            .attr("height", function(d) { return height - y(d[d3.keys(data[0])[nn]]); })
            .attr("fill",function(d,i){
                if(hue==1)
                    return HSVtoRGB(parseFloat(i/180), 1, 1);
                else return "rgba(130,130,130,0.8)";
        });
    });
}

