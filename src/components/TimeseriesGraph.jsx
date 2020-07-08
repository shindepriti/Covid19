import React, { useCallback, useEffect, useRef, useMemo, useState} from "react";
import {min, max, bisector} from 'd3-array';
import {axisBottom, axisRight} from 'd3-axis';
import {interpolatePath} from 'd3-interpolate-path';
import {scaleTime, scaleLinear} from 'd3-scale';
import {select, mouse} from 'd3-selection';
import {line, curveMonotoneX} from 'd3-shape';

import {PRIMARY_STATISTICS,COLORS,getStatistic,parseIndiaDate,formatDate,capitalize} from '../utils/commonfunc';

function TimeseriesGraph({stateCode,timeseries}) {

    const refs = useRef([]);

    const wrapperRef = useRef();
  
    const selectedTimeseries = useMemo(() => {
        return timeseries?.[stateCode]?.dates;
    },[stateCode,timeseries]);
    
    const dates = useMemo(() => {
        return Object.keys(selectedTimeseries || {});
    },[selectedTimeseries]);

    const [highlightedDate, setHighlightedDate] = useState();

    useEffect(() => {
        setHighlightedDate(dates[dates.length - 1]);
    }, [dates]);

    useEffect(() => {
        const T = dates.length;
    
        const {width, height} = wrapperRef.current.getBoundingClientRect();
    
        // Margins
        const margin = {top: 15, right: 35, bottom: 25, left: 25};
        const chartRight = width - margin.right;
        const chartBottom = height - margin.bottom;
    
        const yBufferTop = 1.2;
        const yBufferBottom = 1.1;
    
        const xScale = scaleTime()
          .clamp(true)
          .domain([parseIndiaDate(dates[0]), parseIndiaDate(dates[T - 1])])
          .range([margin.left, chartRight]);
    
        // Number of x-axis ticks
        const numTicksX =  7;
    
        const xAxis = (g) =>
          g.attr('class', 'x-axis').call(
            axisBottom(xScale)
              .ticks(numTicksX)
              .tickFormat((date) => formatDate(date, 'dd MMM'))
          );
    
        const yAxis = (g, yScale) =>
          g.attr('class', 'y-axis').call(
            axisRight(yScale)
            .ticks(4, '0~s').tickPadding(4)
          );
    
        const generateYScale = (statistic) => {    
          return scaleLinear()
            .clamp(true)
            .domain([
              yBufferBottom *
                Math.min(
                  0,
                  min(dates, (date) =>
                    getStatistic(selectedTimeseries[date], 'total', statistic)
                  )
                ),
              Math.max(
                1,
                yBufferTop *
                  max(dates, (date) =>
                    getStatistic(selectedTimeseries[date], 'total', statistic)
                  )
              ),
            ])
            .nice(4)
            .range([chartBottom, margin.top]);
        };
    
        function mousemove() {
          const xm = mouse(this)[0];
          const date = xScale.invert(xm);
          const bisectDate = bisector((date) => parseIndiaDate(date)).left;
          const index = bisectDate(dates, date, 1);
          const dateLeft = dates[index - 1];
          const dateRight = dates[index];
          setHighlightedDate(
            date - parseIndiaDate(dateLeft) < parseIndiaDate(dateRight) - date
              ? dateLeft
              : dateRight
          );
        }
    
        function mouseout() {
          setHighlightedDate(dates[T - 1]);
        }
    
        /* Begin drawing charts */
        refs.current.forEach((ref, i) => {
          const svg = select(ref);
          const t = svg.transition().duration(1000);
    
          const statistic = PRIMARY_STATISTICS[i];
          const yScale = generateYScale(statistic);
          const color = COLORS[statistic];
    
          /* X axis */
          svg
            .select('.x-axis')
            .style('transform', `translateY(${chartBottom}px)`)
            .transition(t)
            .call(xAxis);

          /* Y axis */
          svg
            .select('.y-axis')
            .style('transform', `translateX(${chartRight}px)`)
            .transition(t)
            .call(yAxis, yScale);
    
          /* Path dots */
          svg
            .selectAll('circle')
            .data(dates, (date) => date)
            .join((enter) =>
              enter
                .append('circle')
                .attr('fill', color)
                .attr('stroke', color)
                .attr('r', 2)
                .attr('cy', chartBottom)
                .attr('cx', (date) => xScale(parseIndiaDate(date)))
            )
            .transition(t)
            .attr('cx', (date) => xScale(parseIndiaDate(date)))
            .attr('cy', (date) =>
              yScale(getStatistic(selectedTimeseries[date], 'total', statistic))
            );
       
            const linePath = line()
              .curve(curveMonotoneX)
              .x((date) => xScale(parseIndiaDate(date)))
              .y((date) =>
                yScale(getStatistic(selectedTimeseries[date], 'total', statistic))
              );
    
            let pathLength;
    
            svg
              .selectAll('.trend')
              .data(T ? [dates] : [])
              .join(
                (enter) =>
                  enter
                    .append('path')
                    .attr('class', 'trend')
                    .attr('fill', 'none')
                    .attr('stroke', color + '50')
                    .attr('stroke-width', 4)
                    .attr('d', linePath)
                    .attr('stroke-dasharray', function () {
                      return (pathLength = this.getTotalLength());
                    })
                    .call((enter) =>
                      enter
                        .attr('stroke-dashoffset', pathLength)
                        .transition(t)
                        .attr('stroke-dashoffset', 0)
                    ),
                (update) =>
                  update
                    .attr('stroke-dasharray', null)
                    .transition(t)
                    .attrTween('d', function (date) {
                      const previous = select(this).attr('d');
                      const current = linePath(date);
                      return interpolatePath(previous, current);
                    })
              );
    
            svg
              .selectAll('.trend')
              .data(T ? [dates] : [])
              .join(
                (enter) =>
                  enter
                    .append('path')
                    .attr('class', 'trend')
                    .attr('fill', 'none')
                    .attr('stroke', color + '50')
                    .attr('stroke-width', 4)
                    .attr('d', linePath)
                    .attr('stroke-dasharray', function () {
                      return (pathLength = this.getTotalLength());
                    })
                    .call((enter) =>
                      enter
                        .attr('stroke-dashoffset', pathLength)
                        .transition(t)
                        .attr('stroke-dashoffset', 0)
                    ),
                (update) =>
                  update
                    .attr('stroke-dasharray', null)
                    .transition(t)
                    .attrTween('d', function (date) {
                      const previous = select(this).attr('d');
                      const current = linePath(date);
                      return interpolatePath(previous, current);
                    })
              );
        
    
          svg.selectAll('*').attr('pointer-events', 'none');
          svg
            .on('mousemove', mousemove)
            .on('touchmove', mousemove)
            .on('mouseout', mouseout)
            .on('touchend', mouseout);
        });
      }, [selectedTimeseries, dates]);
    
      useEffect(() => {
        refs.current.forEach((ref) => {
          const svg = select(ref);
          svg
            .selectAll('circle')
            .attr('r', (date) => (date === highlightedDate ? 4 : 2));
        });
      }, [highlightedDate]);
    
      const getStatisticDelta = useCallback(
        (statistic) => {
          if (!highlightedDate) return;
          const deltaToday = getStatistic(
            selectedTimeseries?.[highlightedDate],
            'delta',
            statistic
          );
        
           return deltaToday;
        },
        [selectedTimeseries, highlightedDate]
      );


        return (
            <React.Fragment>
                <div className="Timeseries">
                {PRIMARY_STATISTICS.map((statistic, index) => {
                     const delta = getStatisticDelta(statistic, index);
                     return (
                        <div
                        key={statistic}
                        className={`svg-parent fadeInUp is-${statistic}`}
                        ref={wrapperRef}
                      >
                        {highlightedDate && (
                          <div className={`stats is-${statistic}`}>
                            <h5 className="title">{capitalize(statistic)}</h5>
                            <h5 className="title">
                              {formatDate(highlightedDate, 'dd MMMM')}
                            </h5>
                            <div className="stats-bottom">
                              <h2>
                                {getStatistic(selectedTimeseries?.[highlightedDate],'total',statistic)}
                              </h2>
                              <h6>{`${delta >= 0 ? '+' : ''}${delta}`}</h6>
                            </div>
                          </div>
                        )}
                        <svg
                          ref={(element) => {
                            refs.current[index] = element;
                          }}                        >
                          <g className="x-axis" />
                          <g className="y-axis" />
                        </svg>
                      </div>
                     );
                     })}
                </div>
            </React.Fragment>
        )
}
export default TimeseriesGraph