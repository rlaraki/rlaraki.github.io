
class MapPlot {

	makeColorbar(svg, color_scale, top_left, colorbar_size, scaleClass=d3.scaleLog) {



	constructor(svg_element_id) {
		this.svg = d3.select('#' + svg_element_id);



		// D3 Projection
		// similar to scales
		const projection = d3.Patterson()


		// path generator to convert JSON to SVG paths
		const path_generator = d3.geoPath()
			.projection(projection);



function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

whenDocumentLoaded(() => {
	plot_object = new MapPlot('map-plot');
	// plot object is global, you can inspect it in the dev-console
});
