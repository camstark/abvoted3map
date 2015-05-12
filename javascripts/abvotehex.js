//map data
var mapdata = [
    '..','..','..','..','..','..','..','..','..','..',
       '..','01','74','50','02','59','58','..','..','..',
    '..','..','62','61','87','79','37','48','65','..',
       '..','..','80','29','30','32','28','52','..','..',
    '..','..','39','34','31','36','78','60','..','..',
       '..','..','44','42','45','35','40','84','..','..',
    '..','..','38','46','43','41','33','51','..','..',
       '..','85','81','56','67','66','86','..','..','..',
    '..','..','77','75','76','64','57','..','..','..',
       '..','..','49','47','73','54','83','..','..','..',
    '..','..','..','22','23','19','20','63','..','..',
       '..','..','..','15','11','17','06','69','..','..',
    '..','..','..','..','04','26','21','08','..','..',
       '..','..','..','27','07','05','14','68','..','..',
    '..','..','..','..','09','03','12','72','..','..',
       '..','..','..','..','13','10','16','55','..','..',
    '..','..','..','..','..','18','24','25','53','..',
       '..','..','..','..','..','71','73','70','..','..',
    '..','..','..','..','..','..','..','..','..','..',
       '..','..','..','..','..','..','..','..','..','..',
    
];

var partyColors = {
    '': '#fff',
    'PC': '#377eb8',
    'WRP': '#4daf4a',
    'NDP': '#ff7f00',
    'LIB': '#e41a1c',
    'IND': '#bdbdbd'
};

var regionColors = {
    '': '#fff',
    'Calgary': '#de2d26',
    'Edmonton': '#FF8500',
    'Rest of Alberta': '#2ca25f',//'#FF8500',
};

//svg sizes and margins
var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
}, 
//width = 1200,
//height = 2300;
//width = 960,
//height = 700;
width = $(window).width() - margin.left - margin.right - 40;
height = $(window).height() - margin.top - margin.bottom; //- 20;

//The number of columns and rows of the cartogram
var MapColumns = 10, MapRows = 20;
 
//The maximum radius the hexagons can have to still fit the screen
var hexRadius = d3.min([width/((MapColumns + 0.5) * Math.sqrt(3)),
   height/((MapRows + 1/3) * 1.5)]);

//Calculate the center positions of each hexagon 
//var points = [];
//for (var r = 0; r < MapRows; r++) {
//    for (var c = 0; c < MapColumns; c++) {
//        points.push([hexRadius * c * 1.75, hexRadius * r * 1.5]);
//    }//for c
//}//for r

var points = [];
var truePoints = [];
for (var i = 0; i < MapRows; i++) {
    for (var j = 0; j < MapColumns; j++) {
        points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
	truePoints.push([hexRadius * j * Math.sqrt(3), hexRadius * i * 1.5]);
    }//for j
}//for i

//Create SVG element
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Set the hexagon radius
var hexbin = d3.hexbin()
            .radius(hexRadius);

var radius = d3.scale.sqrt()
    .domain([1, electorates.max_turnout])
    .range([1, hexRadius]);

//Draw the hexagons
var hex = svg.selectAll(".hexagon")
      .data(hexbin(points))
    .enter().append("path")
      .attr("class", "hexagon")
      .attr("d", function(d, i) {
        /*if (i<mapdata.length) {
          electorate = electorates.results[mapdata[i]];
          if ("total_votes_cast" in electorate) { return hexbin.hexagon(radius(electorate.total_votes_cast)); }
        }
        return hexbin.hexagon(radius(2000));*/
        return hexbin.hexagon(radius(35000));
      })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .style("stroke", function (d, i) {
        if (i<mapdata.length) {
          electorate = electorates.results[mapdata[i]];
//          if (electorate.region != '') {
//            return regionColors[electorate.region];          };
			if (electorate.election_2012 != '') {
			  return partyColors[electorate.election_2012];          };
        }
        return '#fff';
       })
	   
      .style("stroke-width", "1px")

      .style("stroke-opacity", "0.5")

      .style("fill", function (d, i) {
        if (i<mapdata.length) {
          electorate = electorates.results[mapdata[i]];
          return partyColors[electorate.election_2012];
//          electorate = electorates.results[mapdata[i]];
//          return regionColors[electorate.region];
        }
        return 'none'; //'#fff';
       })
	.on("mouseover", mover)   //Mouseover Function
	.on("mouseout", mout);    //Mouseout Function

///////////////////////////////////////////////////////////////////////////
///////////////////////////// Mouseover functions /////////////////////////
///////////////////////////////////////////////////////////////////////////

//Function to call when you mouseover a node
function mover(d) {
  var el = d3.select(this)
		.transition()
		.duration(10)		  
		.style("fill-opacity", 0.3)
		;
}

//Mouseout function
function mout(d) { 
	var el = d3.select(this)
	   .transition()
	   .duration(1000)
	   .style("fill-opacity", 1)
	   ;
};

/////Labelling
	  
//a second layer of hexagons for labels
var labels = svg.selectAll(".labels")
    .data(hexbin(points))
  .enter()
    .append("foreignObject");

//label box scale factor
var sf = 1.75;

var labelAttributes = labels
    .attr('width', hexRadius*sf)
    .attr('height', hexRadius*sf)
    .attr("x", function (d) { return d.x - hexRadius*sf/2; })
    .attr("y", function (d) { return d.y - hexRadius*sf/2; })
    .append("xhtml:body")
    .html(function(d, i) {
        if (i<mapdata.length) {
          electorate = electorates.results[mapdata[i]];
		  increment = i;
          if (electorate.party == '') {return '';};
//          per = electorate.percentage_of_elected_candidate_votes_cast_in_electorate.replace('%', '');
//          per = parseInt(per);
//          return '<div class="hex-wrapper"><div class="hex-label">'
//            + electorate.electoral_district + '<br/>'
//            + '<small>' + electorate.party.substring(0,3) + ' ' + per + '%<small>'
//            + '</div></div>';
          return '<div class="hex-wrapper"><div class="hex-label">'
              + electorate.map_id + '<br/>'
//            + increment + '<br/>'  //Temporary use for finding nodes
            + '<small>' + electorate.current_party + '<small>'
//            + '<small>' + electorate.edname + '<small>'
            //+ '</div></div>'
			;
        }
      });
  //jquery hack to set the label wrapper heights
  $('.hex-wrapper').height( hexRadius*sf );
  
///////////////////////////////////////////////////////////////////////////
///// Function to calculate the line segments between two node numbers ////
///////////////////////////////////////////////////////////////////////////
//Which nodes are neighbours
var neighbour = 
[
	[25,26],[15,26],[16,26],[26,27],[36,27],[36,37],[36,47],[46,47],[46,46],[56,47],[56,57],[56,67],[66,67],[66,76],[66,75],[65,75],[65,74],[64,74],[64,73],[63,73],[63,72],[62,72],[62,71],[62,61],[62,51],[52,51],[42,51],[42,41],[42,31],[32,31],[32,22],[32,23],[33,23],[33,24],[34,24],[34,25],[35,25],
	
	[103,92],[103,93],[104,93],[104,94],[105,94],[105,95],[106,95],[106,96],[106,107],[116,107],[116,117],[127,117],[127,128],[127,137],[136,137],[136,147],[146,147],[156,147],[156,157],[167,157],[167,168],[167,177],[167,176],[166,176],[166,175],[165,175],[165,174],[165,164],[154,164],[154,153],[144,153],[144,143],[133,143],[133,132],[133,123],[124,123],[113,123],[113,112],[103,112],[103,102]
	
];


//Initiate some variables
var Sqr3 = 1/Math.sqrt(3);
var lineData = [];
var Node1,
	Node2,
	Node1_xy,
	Node2_xy,
	P1,
	P2;
				  
//Calculate the x1, y1, x2, y2 of each line segment between neighbours
for (var i = 0; i < neighbour.length; i++) {
	Node1 = neighbour[i][0];
	Node2 = neighbour[i][1];
	
	//An offset needs to be applied if the node is in an uneven row
 	if (Math.floor(Math.floor((Node1/MapColumns)%2)) != 0) {
		Node1_xy = [(truePoints[Node1][0]+(hexRadius/(Sqr3*2))),truePoints[Node1][1]];
	}
	else {
		Node1_xy = [truePoints[Node1][0],truePoints[Node1][1]];
	}
	
	//An offset needs to be applied if the node is in an uneven row
	if (Math.floor(Math.floor((Node2/MapColumns)%2)) != 0) {
		Node2_xy = [(truePoints[Node2][0]+(hexRadius/(Sqr3*2))),truePoints[Node2][1]];
	}
	else {
		Node2_xy = [truePoints[Node2][0],truePoints[Node2][1]];
	}//else
	
	//P2 is the exact center location between two nodes
	P2 = [(Node1_xy[0]+Node2_xy[0])/2,(Node1_xy[1]+Node2_xy[1])/2]; //[x2,y2]
	P1 = Node1_xy; //[x1,x2]
	
	//A line segment will be drawn between the following two coordinates
	lineData.push([(P2[0] + Sqr3*(P1[1] - P2[1])),(P2[1] + Sqr3*(P2[0] - P1[0]))]); //[x3_top, y3_top]
	lineData.push([(P2[0] + Sqr3*(P2[1] - P1[1])),(P2[1] + Sqr3*(P1[0] - P2[0]))]); //[x3_bottom, y3_bottom]
}//for i

///////////////////////////////////////////////////////////////////////////
/////////////////// Draw the black line segments //////////////////////////
///////////////////////////////////////////////////////////////////////////

var lineFunction = d3.svg.line()
		  .x(function(d) {return d[0];})
		  .y(function(d) {return d[1];})
		  .interpolate("linear");
				  
var Counter = 0;
//Loop over the linedata and draw each line
for (var i = 0; i < (lineData.length/2); i++) { 	
svg.append("path")
	.attr("d", lineFunction([lineData[Counter],lineData[Counter+1]]))
	.attr("stroke", "black")
	.attr("stroke-width", 3)
	.attr("fill", "none");
	
	Counter = Counter + 2;
} //for i 

