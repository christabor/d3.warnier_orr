function d3_warnier_orr(settings) {
    var PADDING  = 100;
    var nub_size = settings.nub_size || 12;
    var width    = settings.width || window.innerWidth / 2;
    var height   = settings.height || window.innerHeight / 2;
    var cluster  = d3.layout.cluster()
    .size([height, width - PADDING])
    .separation(function(a, b){
        return a.parent == b.parent ? 1 : 4;
    });
    var diagonal = d3.svg.diagonal().projection(function(d) {return [d.y, d.x];});
    var svg = d3.select(settings.container || 'body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + PADDING / 2 + ',0)');

    function buildDiagram(data) {
        var nodes = cluster.nodes(data);
        var links = cluster.links(nodes);
        var link = svg.selectAll('.link')
        .data(links).enter().append('path')
        .attr('fill', 'none')
        .attr('class', 'link')
        .attr('d', function(d){
            return [
                'M' + d.source.y + ',' + d.source.x,
                d.source.y + nub_size + ',' + d.source.x,
                d.source.y + nub_size + ',' + d.target.x,
                (d.target.y - (d.target.y - d.source.y) + nub_size / 2) + nub_size + ',' + d.target.x,
            ].join(' ')
        });

        var node = svg.selectAll('.node')
        .data(nodes).enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) { return 'translate(' + (!d.children ? d.y / 1.2 : d.y) + ',' + d.x + ')'; })

        node.append('text')
        .attr('dx', function(d){
            return d.root ? 0 : -nub_size * 1.2;
        })
        .attr('dy', function(d){
            if(d.root) return -nub_size * 1.2;
            return d.children ? 4: 4;
        })
        .attr('font-size', function(d){return d.children ? 14 : 12;})
        .attr('transform', function(d){
            return d.root ? 'rotate(-90)' : '';
        })
        .attr('font-weight', function(d){return d.children ? 'bold' : 'normal';})
        .style('text-anchor', function(d) {
            if(d.root) return 'middle';
            return d.children ? 'end' : 'start';
        })
        .text(function(d) {return d.name;});
    }

    if(settings.json) {
        d3.json(settings.json, function(error, root) {
            if (error) throw error;
            buildDiagram(root);
        });
    } else if(settings.data) {
        buildDiagram(settings.data);
    } else {
        throw new Error('No data specified!');
    }
}
