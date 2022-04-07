"use strict";

console.log("hello world");
var view,csv;

require(["esri/config", "esri/Map",
	"esri/layers/CSVLayer", "esri/views/SceneView", "esri/layers/FeatureLayer",  "esri/widgets/Legend"
], function (esriConfig, Map, CSVLayer, SceneView,FeatureLayer, Legend) {

	esriConfig.apiKey = "AAPK7bca4554ce81481da9bd077a5ce49921m7riechcRqVQA434fxhQx90zc1N1Vv2zgTZSDjn9mutzoSH-S-YOrhS9XS8XOUF_";

	// const map = new Map("archgis", {
	// 	basemap: "gray-vector",
	// 	center: [ -60, -10 ],
	// 	zoom: 3
	// });

	
	const template = {
		title: "Checmical Info",
		content: [
			{
				type: "text",
				text: "In year {Year}"
			},
			{
				type: "fields",
				fieldInfos: [
					{
						fieldName: "TotalPhosphorus",
						label: "Total Phosphorous"
					},
					{
						fieldName: "TotalSuspendedSolids",
						label: "Total Suspended Solids"
					}
				]
			}
		]
	};
	const anotherTemp = {
		title: "Popup",
		content: "Hello world"
	}
	csv = new CSVLayer({

		url: "http://127.0.0.1:5000/get_csv",
		title: "Chemicals",
		popupTemplate: template
	}
	);

	csv.renderer = {
		type: "simple", // autocasts as new SimpleRenderer()
		symbol: {
			type: "point-3d", // autocasts as new PointSymbol3D()
			// for this symbol we use 2 symbol layers, one for the outer circle
			// and one for the inner circle
			symbolLayers: [{
				type: "icon", // autocasts as new IconSymbol3DLayer()
				material: { color: [255, 84, 54, 0] },
				outline: {
					width: 0.5,
					color: "red"
				},
				size: "12px"
			}]
		}
	};

	const popupTrailheads = {
		"title": "Trails Example using FeatureLayer",
		"content": ""
	}
	const featureLayer1 = new FeatureLayer({
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",
        outFields: ["TRL_NAME","CITY_JUR","X_STREET","PARKING","ELEV_FT"],
        popupTemplate: popupTrailheads
	});


	const map = new Map({
		basemap: "arcgis-topographic",
		layers: [csv, featureLayer1]
	});



	view = new SceneView({
		container: "archgis",
		qualityProfile: "high",
		map: map,
		alphaCompositingEnabled: true,
		highlightOptions: {
			fillOpacity: 0,
			color: "#ffffff"
		},
		constraints: {
			altitude: {
				min: 700000
			}
		},
		environment: {
			background: {
				type: "color",
				color: [0, 0, 0, 0]
			},
			lighting: {
				type: "virtual"
			}
		}
	});
	
	// Adding Legend widget
	const legend = new Legend ({
        view: view
      });
      view.ui.add(legend, "top-right");

	
	
	// Filtering p scale
	
	document.getElementById('filterme').onclick = function () {
		filterPhos();
	}

	function filterPhos() {
		view.whenLayerView(csv).then((layerView) => {
			layerView.filter = {
				where: "TotalPhosphorus > 0.2"
			};
		});
	}

});
