import React, { useRef, useEffect,  } from "react";
// eslint-disable-next-line no-unused-vars
import {transition} from 'd3-transition';
import {min, max} from 'd3-array';
import {scaleTime, scaleLinear} from 'd3-scale';
import {select} from 'd3-selection';
import {line, curveMonotoneX} from 'd3-shape';
import '../scss/minigraph.scss'
import {PRIMARY_STATISTICS,COLORS,getStatistic,parseIndiaDate} from '../utils/commonfunc';

function MiniGraph({timeseries}) {
  const refs = useRef([]);
  const dates = Object.keys(timeseries || {});

  useEffect(() => {
    const T = dates.length;
    const margin = {top: 10, right: 5, bottom: 20, left: 5};
    const chartRight = 100 - margin.right;
    const chartBottom = 100 - margin.bottom;

    const xScale = scaleTime()
      .clamp(true)
      .domain([parseIndiaDate(dates[0]), parseIndiaDate(dates[T - 1])])
      .range([margin.left, chartRight]);

      const dailyMin = min(dates, (date) =>
      getStatistic(timeseries[date], 'delta', 'active')
    );

    const dailyMax = max(dates, (date) =>
      Math.max(
        getStatistic(timeseries[date], 'delta', 'confirmed'),
        getStatistic(timeseries[date], 'delta', 'recovered'),
        getStatistic(timeseries[date], 'delta', 'deceased')
      )
    );

    const domainMinMax = Math.max(-dailyMin, dailyMax);

    const yScale = scaleLinear()
      .clamp(true)
      .domain([-domainMinMax, domainMinMax])
      .range([chartBottom, margin.top]);

      refs.current.forEach((ref, index) => {
        const svg = select(ref);
        const statistic = PRIMARY_STATISTICS[index];
        const color = COLORS[statistic];
  
        const linePath = line()
          .curve(curveMonotoneX)
          .x((date) => xScale(parseIndiaDate(date)))
          .y((date) =>
            yScale(getStatistic(timeseries[date], 'delta', statistic))
          );

          let pathLength;
          svg
            .selectAll('path')
            .data(T ? [dates] : [])
            .join(
              (enter) =>
                enter
                  .append('path')
                  .attr('fill', 'none')
                  .attr('stroke', color + '99')
                  .attr('stroke-width', 2.5)
                  .attr('d', linePath)
                  .attr('stroke-dasharray', function () {
                    return (pathLength = this.getTotalLength());
                  })
                  .call((enter) =>
                enter
                  .attr('stroke-dashoffset', pathLength)
                  
                  .transition()
                  .delay(100)
                  .duration(2500)
                  .attr('stroke-dashoffset', 0)
              )
        );

            svg
            .selectAll('circle')
            .data(T ? [dates[T - 1]] : [])
            .join(
              (enter) =>
                enter
                  .append('circle')
                  .attr('fill', color)
                  .attr('r', 2.5)
                  .attr('cx', (date) => xScale(parseIndiaDate(date)))
                  .attr('cy', (date) =>
                    yScale(getStatistic(timeseries[date], 'delta', statistic))
                  )
                  .style('opacity', 0)
                  .call((enter) =>
                    enter
                      .transition()
                      .delay(2100)
                      .duration(500)
                      .style('opacity', 1)
                      .attr('cx', (date) => xScale(parseIndiaDate(date)))
                      .attr('cy', (date) =>
                        yScale(getStatistic(timeseries[date], 'delta', statistic))
                      )
                  ),
            );
          });
        });
    


  return (
    <div className="Minigraph">
      {PRIMARY_STATISTICS.map((statistic, index) => (
        <div key={statistic} className="svg-parent">
          <svg
            ref={(el) => {
              refs.current[index] = el;
            }}
            width="100"
            height="75"
            viewBox="0 0 100 75"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      ))}
    </div>

  );
}

export default MiniGraph;