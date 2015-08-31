export function drawLines(marks){
  let config = this.config;
  let line = d3.svg.line()
    .interpolate(config.interpolate)
    .x(d => {
      return config.x.type === 'linear' ? this.x(+d.values.x) :
        config.x.type === 'time' ? this.x(new Date(d.values.x)) :
        this.x(d.values.x) + this.x.rangeBand()/2;
    })
    .y(d => {
      return config.y.type === 'linear' ? this.y(+d.values.y) :
        config.y.type === 'time' ? this.y(new Date(d.values.y)) :
        this.y(d.values.y) + this.y.rangeBand()/2;
    });

  let line_supergroups = this.svg.selectAll('.line-supergroup').data(marks, (d,i) => i+'-'+d.per.join('-'));
  line_supergroups.enter().append('g').attr('class', 'line-supergroup');
  line_supergroups.exit().remove();

  let line_grps = line_supergroups.selectAll('.line')
    .data(d => d.data, d => d.key);
  line_grps.exit().remove();
  let nu_line_grps = line_grps.enter().append('g').attr('class', d => d.key +' line');
  nu_line_grps.append('path');
  nu_line_grps.append('title');
  line_grps.select('path').attr('class', 'wc-data-mark')
    .datum(d => d.values)
    .attr('stroke', d => this.colorScale(d[0].values.raw[0][config.color_by]) )
    .attr('stroke-width', config.stroke_width ? config.stroke_width : config.flex_stroke_width)
    .attr('stroke-linecap', 'round')
    .attr('fill', 'none')
    .transition()
    .attr('d', line);

  line_grps.each(function(d){
    let mark = d3.select(this.parentNode).datum();
    d.tooltip = mark.tooltip;
    d3.select(this).select('path').attr(mark.attributes);
  });

  line_grps.select('title').text(d => {
    let tt = d.tooltip || '';
    let xformat = config.x.summary === 'percent' ? d3.format('0%') : d3.format(config.x.format);
    let yformat = config.y.summary === 'percent' ? d3.format('0%') : d3.format(config.y.format);
    return tt.replace(/\$x/g, xformat(d.values.x))
      .replace(/\$y/g, yformat(d.values.y))
      .replace(/\[(.+?)\]/g, (str, orig) => d.values[0].values.raw[0][orig] );
  });

  return line_grps;
}