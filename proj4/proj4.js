module.exports = function(RED) {
	"use strict";
	const proj4 = require("proj4");

	function Proj4Node(n) {
		RED.nodes.createNode(this,n);
		var node = this;

		node.on('input', function(msg, send, done) {
			//WKT OGC Strings
			proj4.defs([
				[
		        'EPSG:4326', 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]'],
		  		[
		        'EPSG:27700', 'PROJCS["OSGB 1936 / British National Grid",GEOGCS["OSGB 1936",DATUM["OSGB_1936",SPHEROID["Airy 1830",6377563.396,299.3249646,AUTHORITY["EPSG","7001"]],AUTHORITY["EPSG","6277"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4277"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",49],PARAMETER["central_meridian",-2],PARAMETER["scale_factor",0.9996012717],PARAMETER["false_easting",400000],PARAMETER["false_northing",-100000],AUTHORITY["EPSG","27700"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]'],
				[
		        'EPSG:4269', 'GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]]'],
		        [
		        'EPSG:2157', 'PROJCS["IRENET95 / Irish Transverse Mercator",GEOGCS["IRENET95",DATUM["IRENET95",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6173"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4173"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",53.5],PARAMETER["central_meridian",-8],PARAMETER["scale_factor",0.99982],PARAMETER["false_easting",600000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","2157"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]'],
				[
		        'EPSG:29903', 'PROJCS["TM75 / Irish Grid",GEOGCS["TM75",DATUM["Geodetic_Datum_of_1965",SPHEROID["Airy Modified 1849",6377340.189,299.3249646,AUTHORITY["EPSG","7002"]],AUTHORITY["EPSG","6300"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4300"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",53.5],PARAMETER["central_meridian",-8],PARAMETER["scale_factor",1.000035],PARAMETER["false_easting",200000],PARAMETER["false_northing",250000],AUTHORITY["EPSG","29903"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]'],
		        [
		        'EPSG:3857', 'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"],AUTHORITY["EPSG","3857"]]'
		        ]
	    	]);
			
			node.select = n.select;

			node.firstProjection = n.firstProjection;
      		node.secondProjection = n.secondProjection;

      		node.firstCRS = n.firstCRS;
      		node.secondCRS = n.secondCRS;
      
      		node.input_coords;
      		node.output_coords;
      		var err;

      		//console.log('Reading Incomming Payload');
  			if (msg.payload.x && msg.payload.y) {
	    		node.input_coords = {"x":msg.payload.x,"y":msg.payload.y};
	    	} else if (msg.payload.lon && msg.payload.lat) {
	    		node.input_coords = {"x":msg.payload.lon,"y":msg.payload.lat};
	  		} else if (msg.payload.longitude && msg.payload.latitude) {
	    		node.input_coords = {"x":msg.payload.longitude,"y":msg.payload.latitude};
	  		} else if (msg.payload.eastings && msg.payload.northings) {
	    		node.input_coords = {"x":msg.payload.eastings,"y":msg.payload.northings};
	  		} else {
	  			node.input_coords = msg.payload;
	  		}


			let fromCRS;
			let toCRS; 


			if (msg.firstCRS){
				fromCRS = msg.firstCRS
			} else {
				fromCRS = node.firstCRS ? node.firstCRS : proj4.defs[node.firstProjection];
			}

			if (msg.secondCRS){
				toCRS = msg.secondCRS
			} else {
				toCRS = node.secondCRS ? node.secondCRS : proj4.defs[node.secondProjection];
			}

			msg.firstCRS = fromCRS;
			msg.secondCRS = toCRS; 

		  	} else if (node.select === "crs_string") {
		  		
		  		//console.log('Converting using Proj / WKT Strings');
		  		node.output_coords = proj4(node.firstCRS,node.secondCRS,node.input_coords);
		  		msg.proj4_coords = node.output_coords;

		  	}

			if(err) {
				if (done) {
            		// Node-RED 1.0 compatible
           			done(err);
        		} else {
            		// Node-RED 0.x compatible
            		node.error(err, msg);
        		}
			}

			//console.log(node.output_coords);
			node.send(msg);
		});
	}
	RED.nodes.registerType("proj4",Proj4Node);
}