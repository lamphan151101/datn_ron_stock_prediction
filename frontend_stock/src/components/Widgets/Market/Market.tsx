import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '../../Common/Box';
import MarketRow from './MarketRow';

interface MarketData {
  id: number;
  name: string;
  icon: string;
  date: string;
  amount: string;
  currency: string;
  change: string;
  lineChartData: number[];
  status: number;
}

const Market: React.FC = memo(() => {
  const [data, setData] = useState<MarketData[]>([]);

  useEffect(() => {
    const dataArray: MarketData[] = [
      {
        id: 1,
        name: 'BTC/USD',
        icon:
          'https://icons-for-free.com/iconfiles/png/512/btc+coin+crypto+icon-1320162856490699468.png',
        date: 'September 2021',
        amount: '18,783.33',
        currency: 'TRY',
        change: '%45',
        lineChartData: [10, 15, 10, 15, 15, 18],
        status: 1,
      },
      {
        id: 2,
        name: 'ETH/USD',
        icon:
          'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png',
        date: 'September 2021',
        amount: '3,125.25',
        currency: 'TRY',
        change: '-%30',
        lineChartData: [30, 20, 25, 35, 10, 8],
        status: 2,
      },
      {
        id: 3,
        name: 'USDT/USD',
        icon:
          'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Tether-USDT-icon.png',
        date: 'September 2021',
        amount: '125.12',
        currency: 'TRY',
        change: '%3',
        lineChartData: [30, 20, 25, 35, 30, 35],
        status: 1,
      },
      {
        id: 4,
        name: 'XRP/USD',
        icon:
          'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ripple-XRP-icon.png',
        date: 'September 2021',
        amount: '10.05',
        currency: 'TRY',
        change: '%16',
        lineChartData: [30, 20, 25, 35, 30, 35],
        status: 1,
      },
      {
        id: 5,
        name: 'DOT/USD',
        icon:
          'Data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEUAAAD////u7u6+vr7y8vLQ0NB6enrT09OHh4eXl5dtbW21tbX8/Pz19fUhISFwcHBfX18/Pz+QkJDg4OBRUVHLy8vp6ekmJiY0NDTAwMAtLS22trakpKQQEBDc3NxXV1dkZGRLS0usrKwMDAyNjY1+fn45OTmfn58aGhoXFxdEREQhoCuoAAAM6klEQVR4nN1d6YKqOgwGN9wAFcVlXHHOMPr+D3jBtSktBJIKc7+/5wz2gzZ7E8s2jVbgtLff/eFhuvS8nWVZO8/zpge/P4vbTtAx/vuWwWe3nKg/+TlbeditJv3ICQ2uwhBD14mG13xuIs7XXuQY+pwmGDqz+Q5NTqA5HzgGVsPNMIz8CuTe8EfcO5aV4T4+kOjdcYj3nIviY9gZnRjo3TEf8R1KJobj9YSN3h3H9ZhnaSwMW4MNM78Um7jFsTgGhl2abMmD320Aw8XcGL8UczJHIsP21Ci/FNN2jQzXfNIzD6dFTQy7HMoPhwOBY2WGwfFj/FIMK5s6FRm6s4/ySzFwP8mwvfo4wUQ/VhM5VRi2hjXwSzGsYgJUYBjVxC9F9AGGIbcBWg6T0hKnLMPRpVaClvX7ZZThuFczvxS9ck5HKYaOCReiPDalPOQyDEd1U3uhzE4twfBf3bwE9PE7Fc2wY9ZLKos5OsyBZRgs6+YkYRnwMlzXTSiL3ZqT4VfddJTA2akohoO6uWgQczFsKsHEo+Jh2K+bRw7+cTBsgqGmR4/OsNkEERSLGDZ5i97RpzFsrpB5o0Dc5DP8CwSLlEYuw2Yq+ixGVRk20FTTIC9gnMMwqHvdeFxyzHA9w07TvIk8LPVxRj3DZvmDRZiXZ9gkjx4DrVrUMWxOTAYLnUDVMHTqXm8FaMqN1AzHzQgblsOmDENT5vbv9ej7Pd+fTKuUhRVB7UopGRo4hKtjvAjEEKAbrAdHZoWkPIoqhiFzbuJyHAXq+OZ4H3Gmyi+qtI2KIW926fCVn/ULt3z1DhMcQ9b84AwT1nTYzr0iv5hl2OL6tUSwoHPvLS5PO7tfsgz5UtizMtnMgOc7DosZtll+KMEBG3Z/wmGpr8qEiWWGLlOVxblsqjbBOGb44ZV8MGSGTHUyh2qFkwHDZ5TDNhJDJq8XE4tWwmU4jdLplxge6T+QAJkVUoKuq455DLsM9CyPVohOjw7BklTIkMOEWuXI0LEbBvv9Pgjz9OSCajQe9Aw5gms/OiXYWQyG183dpzhvTsO4q6O5pzoe4JQAhgwG4k4tRN2vefaO0G6oqcen+t8nHUMGZb9TfsGcWve+8tBS5YGo9kWGDMpIFZotqCU+qjgSJepUzXBBe2oKhWkfHgv/qqf48N+0hQjiVGBID5Aqcnk4Q0zhnNNWI4RP3wzpunCVkRshVv34GQHVognU90d8M6TffMmE8xYe+m+zWpQWLHpvpxd',
        date: 'September 2021',
        amount: '3.05',
        currency: 'TRY',
        change: '-3%',
        lineChartData: [30, 20, 25, 35, 20, 10],
        status: 2,
      },
      {
        id: 6,
        name: 'DOGE/USD',
        icon:
          'https://www.kindpng.com/picc/m/202-2028344_dogecoin-doge-icon-metro-symbole-hd-png-download.png',
        date: 'September 2021',
        amount: '1.05',
        currency: 'TRY',
        change: '-6%',
        lineChartData: [30, 20, 25, 35, 25, 30],
        status: 2,
      },
      {
        id: 7,
        name: 'ADA/USD',
        icon:
          'https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/cardano_ada-512.png',
        date: 'September 2021',
        amount: '10.12',
        currency: 'TRY',
        change: '6%',
        lineChartData: [30, 20, 25, 35, 25, 30],
        status: 1,
      },
    ];

    setData(dataArray);
  }, []);

  return (
    <Box>
      <div className='box-title box-vertical-padding box-horizontal-padding no-select'>
        Markets
      </div>
      <div className='box-content box-content-height'>
        {data && data.map((item) => <MarketRow key={item.id.toString()} item={item} />)}
      </div>
      <div className='box-button box-vertical-padding box-horizontal-padding'>
        <Link to='/capital' className='button button-purple button-medium button-block'>
          More
          <i className='material-icons button-icon-right'>chevron_right</i>
        </Link>
      </div>
    </Box>
  );
});

export default Market;
