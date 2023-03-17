import * as d3 from 'd3';

export const fitGraphViewbox = (
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  zoom : number
) => {
  const { x, y, width, height } = svg.node()?.getBBox() || {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }

  const svgWidth = svg.node()?.parentElement?.getBoundingClientRect().width || 0
  const svgHeight = svg.node()?.parentElement?.getBoundingClientRect().height || 0

  const ratio =  Math.max(width / svgWidth, height / svgHeight) / zoom

  const midX = x + width / 2
  const midY = y + height / 2

  svg.attr('viewBox', `${midX - svgWidth * ratio / 2} ${midY - svgHeight * ratio / 2} ${svgWidth * ratio} ${svgHeight * ratio}`)
  svg.attr('height',svgHeight)
  svg.attr('width',svgWidth)
};