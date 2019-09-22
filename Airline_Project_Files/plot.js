var width = 960,
    height = 500;

var projection = d3.geo.equirectangular()
    .scale(153)
    .rotate([115, 0])
    .translate([width / 2, height / 2])
    .precision(.1);

var geo_path = d3.geo.path()
    .projection(projection);

function transition(path) {
  path.transition().duration(2000)
        .attrTween("stroke-dasharray", tweenDash)
        .styleTween("opacity", tweenOpacity)
      .transition().delay(2100).duration(100)
        .style("opacity", 0)
        .remove();
}

function tweenDash() {
  var l = this.getTotalLength(),
      i = d3.interpolateString("0," + l, l + "," + l);
  return function(t) { return i(t); };
}

function tweenOpacity() {
  return function(t) { return 1; };
}

var svg3 = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var current_pairs = [];

d3.json("world-50m.json", function(error, topology) {
  if (error) throw error;

  svg3.append("path")
      .datum(topojson.feature(topology, topology.objects.land))
      .attr("d", geo_path)
      .attr("class", "land");

  svg3.append("path")
      .datum(topojson.mesh(topology, 
                           topology.objects.countries, 
                           function(a, b) { 
                             return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); 
                           }))
      .attr("d", geo_path)
      .attr("class", "boundary");

  d3.csv("passenger_trips.csv", function(error, pairs) {
    if (error) throw error;
        
    i = 0;
    setInterval(function(){
      var r = Math.random();
      var new_k = pairs.length-1;
      for (var k=0; k<pairs.length; k++){
        if (r < +pairs[k].cumsum_proportion) {
          new_k = k;
          break;
        }
      }
      var new_pair = pairs[new_k];
      new_pair.i = i;
      current_pairs.push(new_pair);
      if (current_pairs.length >= 50) { current_pairs.shift(); }

      var linestring_data = [];
      current_pairs.forEach(function(d){
        linestring_data.push({type: "LineString", 
                              coordinates: [[d.Longitude_x, d.Latitude_x], 
                                            [d.Longitude_y, d.Latitude_y]],
                              i: d.i})
      })
    
      var arcs = svg3.selectAll(".arc")
          .data(linestring_data, function(d){return d.i;});
      arcs.enter().append("path")
            .attr("class", "arc")
            .style("opacity", 0)
            .attr("d", geo_path)
            .call(transition);
    
      var mapdot_from = svg3.selectAll(".mapdot_from")
          .data(current_pairs, function(d){return d.i;});
      mapdot_from.enter().append("circle")
            .attr("class", "mapdot_from")
            .attr("cx", function(d) { return projection([d.Longitude_x, d.Latitude_x])[0]; })
            .attr("cy", function(d) { return projection([d.Longitude_x, d.Latitude_x])[1]; })
            .attr("r", 2)
            .transition().delay(2100).duration(100)
              .style("opacity", 0)
              .remove();
    
      var mapdot_to = svg3.selectAll(".mapdot_to")
          .data(current_pairs, function(d){return d.i;});
      mapdot_to.enter().append("circle")
            .attr("class", "mapdot_to")
            .style('opacity', 1e-6)
            .attr("cx", function(d) { return projection([d.Longitude_y, d.Latitude_y])[0]; })
            .attr("cy", function(d) { return projection([d.Longitude_y, d.Latitude_y])[1]; })
            .attr("r", 2)
            .transition().delay(1000).duration(1500)
              .style('opacity', 1)
            .transition().delay(2100).duration(100)
              .style("opacity", 0)
              .remove();
      
      i += 1;

    }, 10);
  
  });
  
});