/* Backbone wrapped D3 components */

var JailView = Backbone.View.extend({
  dimensions: {},
  initialize: function(o) {
    this.options = $.extend(true, {
      base_chart_height: 450,
      break_points: {
        'tablet': 600,
        'phone': 380
      },
      margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      }
    }, o);

    $(window).on('resize', _.bind(this.render, this));
    this.render();
  },
  get_dimensions: function() {
    var window_width = $(window).width();
    this.dimensions.wrapperWidth = this.$el.width();
    this.dimensions.width = this.dimensions.wrapperWidth - this.options.margin.left - this.options.margin.right;
    this.dimensions.height = this.options.base_chart_height - this.options.margin.bottom - this.options.margin.top;

    // Break points at which chart height needs to be resized
    if (window_width <= this.options.break_points.tablet && window_width > this.options.break_points.phone)
      this.dimensions.height = (this.dimensions.height - this.options.margin.bottom - this.options.margin.top) * 0.75;
    if (window_width <= this.options.break_points.phone ){
      this.dimensions.width = this.dimension.wrapperWidth - this.options.margin.left - 7;
      this.dimensions.height = (this.dimensions.height - this.options.margin.bottom - this.options.margin.top) * 0.5;
    }

    this.dimensions.wrapperHeight = this.dimensions.height + this.options.margin.top + this.options.margin.bottom;
  }
});

var Barchart = JailView.extend({
  render: function() {
    this.$el.empty();
    this.get_dimensions();

    var dimensions = this.dimensions,
        options = this.options,
        dataset = this.collection.toJSON();

    var yScale = d3.scale.linear()
      .range([dimensions.height, 0]);

    var xScale = d3.time.scale()
      .range([0, dimensions.width])

    var startDate = new Date(dataset[0][options.xKey]);
    var endDate = new Date(dataset[dataset.length-1][options.xKey]);
    var endDate = new Date(endDate.getTime() + (24 * 60 * 60 * 1000))
    xScale.domain([startDate, endDate]);

    var yMax = d3.max(dataset, function(d) { return d[options.yKey]; });
    yScale.domain([0, yMax]);

    //create axes
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(d3.time.day, 1)
        //.tickFormat(function(d) {
          //if ( d > 1995 && d !== 2000 && d !== 2005 && d !== 2010 )
            //return formatNumber(d).replace(/^(19|20)/g, "'");
          //return formatNumber(d);
        //})
        .orient("bottom");

    //if (this.$el.width() <= 550)
      //xAxis.tickValues([1995, 2000, 2005, 2010]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickSize(1)
        //.tickFormat(function(d) {
          //return "$" + formatCommas(d);
        //})
        .orient("right");

    //create new svg for the bar chart
    var svg = d3.select(this.el).append("svg")
      .attr("width", this.dimensions.wrapperWidth)
      .attr("height", this.dimensions.wrapperHeight)
      .attr("class", "chart")
    .append("g")
      .attr("transform", "translate(" + this.options.margin.left + ", 20)");

    //create and sex x axis position
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.dimensions.height + ")")
      .attr("text-anchor", "middle")
      .call(xAxis);

    //create and set y axis positions
    var gy = svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-50, 0)")
      .attr("y", 6)
      .call(yAxis);

    gy.selectAll("g").filter(function(d) { return d; })
        .classed("minor", true);

    gy.selectAll("text")
        .attr("x", 4)
        .attr("dy", -4);

    //create a function to draw a line using the scales
    var line = d3.svg.line()
      .x(function(d) { return xScale(new Date(d.date)); })
      .y(function(d) { return yScale(+d.population); });

    //draw the fever line
    svg.append("path")
      .datum(dataset)
      .attr("class", "line")
      .attr("d", line);

    //draw bars
    //svg.selectAll("rect")
      //.data(dataset)
      //.enter()
      //.append("rect")
      //.attr("fill", "#A1B7CB")
      //.on("mouseover", function(d) {
        //d3.select(this)
          //.style("fill", "#436e96");

        ////update tool tip text
        //d3.select("#tooltip")
          //.select(".bold")
          //.text(d.yr);

        //d3.select(".value")
         //.text(formatBigCurrency(d.debt_per_capita));

        //return tooltip.style("visibility", "visible");
      //})
      //.on("mousemove", function() {
        //var svg_width = d3.select("#chart-wrapper")[0][0].clientWidth;
        //var tip_width = $(tooltip[0][0]).width();

      ////set position of the tooltip based on mouse position
      //if (d3.event.offsetX > ((svg_width - tip_width))) {
        //return tooltip
          //.style("top", (d3.event.pageY-10)+"px")
          //.style("left",(d3.event.pageX-(tip_width+32))+"px");
      //} else {
        //return tooltip
          //.style("top", (d3.event.pageY-10)+"px")
          //.style("left",(d3.event.pageX+10)+"px");
      //}
    //})
    //.on("mouseout", function(){
      //d3.select(this)
        //.style("fill", "#A1B7CB");

      //return tooltip.style("visibility", "hidden");
    //})
    //.attr("class", "bar")
    //.attr("text-anchor", "middle")
    //.attr("x", function(d) {
        //return xScale(new Date(d[options.xKey]));
    //})
    //.attr("y", function(d) {
      //return yScale(d[options.yKey]);
    //})
    //.attr("width", 0.75 * (dimensions.width / dataset.length) )
    //.attr("height", function(d) { return dimensions.height - yScale(d[options.yKey]) - 1; });

    svg.selectAll(".x.axis text")  // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
      });


    return this;
  }
});

var LineChart = JailView.extend({
  render: function() {
    this.$el.empty();
    this.get_dimensions();

    var dimensions = this.dimensions,
        options = this.options,
        dataset = this.collection.toJSON();

    var yScale = d3.scale.linear()
      .range([dimensions.height, 0]);

    var xScale = d3.scale.linear()
      .range([0, dimensions.width]);

    //determine y maxium
    var yMax = d3.max(dataset, function(d) { return d[yKey]; });

    //create a function to draw a line using the scales
    var line = d3.svg.line()
      .x(function(d) { return xScale(d.yr); })
      .y(function(d) { return yScale(d[lineKey]); });

    var totalLine = d3.svg.line()
      .x(function(d) { return xScale(d.yr); })
      .y(function(d) { return yScale(d[yKey]); });

    //create area 
    var area = d3.svg.area()
      .x(function(d) { return xScale(d.yr); })
      .y0(dimensions.height)
      .y1(function(d) { return yScale(d[yKey]); });

    //create a new svg element
    var svg = d3.select(container).append("svg")
        .attr("width", dimensions.wrapperWidth)
        .attr("height", dimensions.wrapperHeight)
      .append("g")
        .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")");

    //create axes
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickFormat(function(d) {
          if ( d > 1995 && d !== 2000 && d !== 2005 && d !== 2010 )
            return formatNumber(d).replace(/^(19|20)/g, "'");
          return formatNumber(d);
        })
        .ticks(( $(container).width() <=550 )? 5:18 )
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickSize(dimensions.wrapperWidth)
        .tickFormat(function(d) {
          var ticks = svg.select('g.y.axis').selectAll('g')[0],
              max_tick = d3.select(ticks[ticks.length - 1]).datum();

          if ( Number(d) >= Number(max_tick) )
            return formatBillions(d) + " billion";
          else
            return formatBillions(d);
        })
        .ticks(6)
        .orient("right");

    //set x and y scale values to map to the svg size
    xScale.domain(d3.extent(dataset, function(d) { return d.yr; }));
    yScale.domain([0, 14e9]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + dimensions.height + ")")
        .call(xAxis);

    //create and set y axis positions
    var gy = svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-50, 0)")
      .attr("y", 6)
      .call(yAxis);

    gy.selectAll("g").filter(function(d) { return d; })
        .classed("minor", true);

    gy.selectAll("text")
        .attr("x", 4)
        .attr("dy", -4);

    //draw the area chart
    svg.append("path")
      .datum(dataset)
      .attr("class", "area")
      .attr("fill", "#c7d9e9")
      .attr("opacity", ".3")
      .attr("d", area);

    //draw the fever line
    svg.append("path")
      .datum(dataset)
      .attr("class", "line baseline")
      .attr("d", line);

    svg.append("path")
      .datum(dataset)
      .attr("class", "line total")
      .style("stroke", "#A1B7CB")
      .attr("d", totalLine);

    //create a datapoint for each year on the line
    circles_one = svg.selectAll("circle.one")
      .data(dataset)
      .enter()
      .append("circle")
      .on("mouseover", function(d){
        d3.select(this)
         .attr("r", 6);

        //update tool tip text
        d3.select("#tooltip")
          .select(".bold")
          .text(d.yr);

        d3.select(".value")
         .text("Principal: " + formatBigCurrency(d[lineKey]));

        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){
        var svg_width = d3.select("#chart-wrapper")[0][0].clientWidth;
        var tip_width = $(tooltip[0][0]).width();

        //set position of the tooltip based on mouse position
        if (d3.event.offsetX > ((svg_width - tip_width))) {
          return tooltip
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX-(tip_width+32))+"px");
        } else {
          return tooltip
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
        }
      })
      .on("mouseout", function(d){
         d3.select(this)
          .attr("r", 3);

          return tooltip.style("visibility", "hidden");
      })
      .attr("class", "dot baseline")
      .attr("cx", function(d) { return xScale(d[xKey]); })
      .attr("cy", function(d) { return yScale(d[lineKey]); })
      .attr("r", 3);

    circles_two = svg.selectAll("circle.two")
      .data(dataset)
      .enter()
      .append("circle")
      .on("mouseover", function(d){
        d3.select(this)
         .attr("r", 6);

        //update tool tip text
        d3.select("#tooltip")
          .select(".bold")
          .text(d.yr);

        d3.select(".value")
         .text("Total: " + formatBigCurrency(d[yKey]));

        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){
        var svg_width = d3.select("#chart-wrapper")[0][0].clientWidth;
        var tip_width = $(tooltip[0][0]).width();

        //set position of the tooltip based on mouse position
        if (d3.event.offsetX > ((svg_width - tip_width))) {
          return tooltip
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX-(tip_width+32))+"px");
        } else {
          return tooltip
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
        }
      })
      .on("mouseout", function(d){
         d3.select(this)
          .attr("r", 3);

          return tooltip.style("visibility", "hidden");
      })
      .attr("class", "dot total")
      .attr("cx", function(d) { return xScale(d[xKey]); })
      .attr("cy", function(d) { return yScale(d[yKey]); })
      .attr("r", 3);

    // Mouseover interaction with labels
    var light_blue = $(container).parent().parent().find('.light-blue'),
        blue = $(container).parent().parent().find('.blue');

    light_blue.mouseover(function() {
      svg.classed("highlight total", true);
    }).mouseout(function() {
      svg.classed("highlight total", false);
    });

    blue.mouseover(function() {
      svg.classed("highlight baseline", true);
    }).mouseout(function() {
      svg.classed("highlight baseline", false);
    });


  }
});
