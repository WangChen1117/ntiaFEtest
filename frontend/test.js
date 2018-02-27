// $.ajax({
//     url: "https://opendata.fcc.gov/resource/if4k-kzsc.json",
//     type: "GET",
//     data: {
//       "$limit" : 10000000,
//       "$$app_token" : "ZL92qzxCeaspFljCkIH1XQBkh",
//       "$$$query": "select *"
//     }
// }).done(function(data) {
//   alert("Retrieved " + data.length + " records from the dataset!");
//   console.log(data);
// });

$.get("https://opendata.fcc.gov/resource/if4k-kzsc.json?$select=providername&$where=stateabbr='WA'&$limit=10000000",function(data){
    console.log(data)
})

var margin = {top: 10, right: 10, bottom: 10, left: 10};
var width = 600;
var height = 400; 
 

var color = d3.scaleThreshold()
    .domain([1,5,10,15,20])
    .range(["#f7fbff","#9ecae1","#6baed6","#4292c6","#2171b5","#08306b"]);

var active = d3.select(null);

var svg = d3.select("#mapVis").append("svg").attr("width",600).attr("height",400)
    .on("click", stopped, true);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var projection = d3.geoAlbersUsa().scale(100).translate([width/2, height/2]);

// var path = d3.geoPath().projection(projection);

var path = d3.geoPath();

var zoom = d3.zoom()
    .scaleExtent([0.5, 4])
    .on("zoom", zoomed);

var g = svg.append("g");

svg.call(zoom)

d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    //.defer(d3.json, "data/county.json")
    .defer(d3.csv, "data/providerNumberByCountyAll.csv", function(d) { 
        d.provider = d.provider; 
        if (d.geo_id.length<5){
            str1 = '0'
            d.id = str1.concat(d.geo_id)
        }
        else{
            d.id = d.geo_id
        }
        d.num = +d.num;
        d.state = d.state;
        return d; 
    })
    .defer(d3.csv,'data/5-digit-code.csv')
    .await(ready);

function ready(error,us, providers,county_code) {
  if (error) throw error;

  var div = d3.select("body")
  .append("div")
  .attr("class","tooltip")
  .style("opacity", 0);

  console.log(county_code)

    g.selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("d", path)
      .attr('class','feature')
      .attr('fill',function(d){
          return color(get_count_provider(providers,d.id))
      })
      .on('mouseover',function(d){
          div.transition().duration(200).style('opacity',0.9);
          div.html('State: '+get_names(providers, d.id,county_code)[0]+'<br> County: ' + get_names(providers, d.id,county_code)[1]+'<br>No of Providers: '+get_count_provider(providers,d.id ));
          div.style('left',(d3.mouse(this)[0]+'px'))
            .style('top',(d3.mouse(this)[1])+'px');

      })
      .on('mouseout',function(d){
          div.transition().duration(100).style('opacity',0)

      })
      .on("click", clicked)


  g.append("path")
      .attr("class", "county-borders")
      .attr("d", path(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b; })));

  g.append("path")
      .attr("class", "state-borders")
       .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
};

function get_count_provider(data,id){
    var total_count = 0
    for (n=0;n<data.length;n++){
        if (data[n].id==id){
            total_count =  total_count +1 
        }
    }

    return total_count
}

function get_names(data, id,county){
    for (n=0;n<data.length;n++){
        if (data[n].id==id){
            var state = data[n].state
        }
    }
    for (n=0;n<county.length;n++){
        if (county[n].id==id){
            var county_name = county[n].COUNTY
        }
    }
    return [state,county_name]

}

function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  
  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4

}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  g.attr("transform", d3.event.transform); // updated for d3 v4
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

