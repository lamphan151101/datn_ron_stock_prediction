import React, { FC, memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Box from '../../Common/Box';
import MyAssetsRow from './MyAssetsRow';

interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  icon: string;
  amount: string;
  currency: string;
  change: string;
  changePeriod: string;
  barChartData: number[];
  lineChartData: number[];
  status: number;
}

const MyAssets: FC = memo(() => {
  const [data, setData] = useState<CryptoData[]>([]);
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    const dataArray: CryptoData[] = [
      {
        id: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        icon:
          'https://icons-for-free.com/iconfiles/png/512/btc+coin+crypto+icon-1320162856490699468.png',
        amount: '18.783,33',
        currency: 'TRY',
        change: '%45',
        changePeriod: 'Bu hafta',
        barChartData: [30, 20, 25, 35, 30],
        lineChartData: [5, 10, 5, 20, 8, 15, 22, 8, 12, 8, 32, 16, 29, 20, 16, 30, 42, 45],
        status: 1,
      },
      {
        id: 2,
        name: 'Etherium',
        symbol: 'ETH',
        icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png',
        amount: '3.125,25',
        currency: 'TRY',
        change: '-%30',
        changePeriod: 'Bu hafta',
        barChartData: [30, 20, 25, 35, 10],
        lineChartData: [5, 10, 5, 20, 8, 15, 22, 8, 12, 8, 32, 16, 29, 20, 16, 30, 42, 10],
        status: 2,
      },
      {
        id: 3,
        name: 'Tether',
        symbol: 'USDT',
        icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Tether-USDT-icon.png',
        amount: '125,12',
        currency: 'TRY',
        change: '%3',
        changePeriod: 'Bu hafta',
        barChartData: [30, 20, 25, 35, 30],
        lineChartData: [5, 10, 5, 20, 8, 15, 22, 8, 12, 8, 32, 16, 29, 20, 16, 30, 42, 43],
        status: 1,
      },
      {
        id: 4,
        name: 'Ripple',
        symbol: 'XRP',
        icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ripple-XRP-icon.png',
        amount: '10,05',
        currency: 'TRY',
        change: '%16',
        changePeriod: 'Bu hafta',
        barChartData: [30, 20, 25, 35, 30],
        lineChartData: [5, 10, 5, 20, 8, 15, 22, 8, 12, 8, 32, 16, 29, 20, 16, 30, 42, 44],
        status: 1,
      },
      {
        id: 5,
        name: 'Polkadot',
        symbol: 'DOT',
        icon: 'data:image/png;base64,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',
        amount: '2,05',
        currency: 'TRY',
        change: '%10',
        changePeriod: 'Bu hafta',
        barChartData: [30, 20, 25, 35, 35],
        lineChartData: [5, 10, 5, 20, 8, 15, 22, 8, 12, 8, 32, 16, 29, 20, 16, 30, 42, 30],
        status: 1,
      },
      {
        id: 8,
        name: 'Chainlink',
        symbol: 'LINK',
        icon: 'https://static.coindesk.com/wp-content/uploads/2021/01/chainlink-token-300x300.png',
        amount: '12,25',
        currency: 'TRY',
        change: '-%12',
        changePeriod: 'Bu hafta',
        barChartData: [30, 20, 25, 35, 35],
        lineChartData: [5, 10, 5, 20, 8, 15, 22, 8, 12, 8, 32, 16, 29, 20, 16, 30, 42, 30],
        status: 1,
      },
    ];

    setData(dataArray);
  }, []);

  const handleMenuOpen = () => {
    setMenuOpened(!menuOpened);
  };

  return (
    <Box>
      <div className='box-title box-vertical-padding box-horizontal-padding no-select'>
        <div className='flex flex-center flex-space-between'>
          <p>Kripto değerlerim</p>
          <div>
            <Link to='/' type='button' className='button button-purple button-small'>
              Kripto al
            </Link>
            <button type='button' className='box-icon pointer' onClick={() => handleMenuOpen()}>
              <i className='material-icons'>more_vert</i>
            </button>

            {menuOpened && (
              <div className='box-dropdown'>
                <ul>
                  <li>
                    <button type='button'>
                      <i className='material-icons'>settings</i>
                      Button 1
                    </button>
                  </li>
                  <li>
                    <button type='button'>
                      <i className='material-icons'>favorite</i>
                      Button 2
                    </button>
                  </li>
                  <li>
                    <button type='button'>
                      <i className='material-icons'>info</i>
                      Button 3
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='box-content box-content-height-nobutton'>
        {data && data.map((item) => <MyAssetsRow key={item.id.toString()} item={item} />)}
      </div>
    </Box>
  );
});

export default MyAssets;
