import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

const ChartComponent = ( props: any ) => {
    const chartRef = useRef(null);
    const { data } = props;
    const formatDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
    }


  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);
      const dataPrice = data.map((item: any) => item.Price)
      console.log(dataPrice, 'data');
      const minValue = Math.min(...dataPrice);
      console.log(minValue, 'min');
    const option = {
      xAxis: {
        type: 'category',
        data: data.map((item: any) => formatDate(item.Date)),
      },
      yAxis: {
          type: 'value',
          min: minValue - 30
      },
      series: [
        {
          data: data.map((item: any) => item.Price),
          type: 'line',
          smooth: true,
        },
      ],
    };
    myChart.setOption(option);
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default ChartComponent;
