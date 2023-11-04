import React, { useState, useEffect } from 'react';
import SiteLayout from '../../layouts/SiteLayout';
import Header from '../../components/Header/Header';
import TopBar from '../../components/Tables/TopBar/TopBar';
import TransactionRow from '../../components/Tables/Transactions/TransactionRow';

interface TransactionData {
  id: number;
  type: number;
  transaction: string;
  date: string;
  from: string;
  to: string;
  toPicture: string;
  coin: string;
  icon: string;
  amount: string;
  status: number;
}

const TransactionsScreen: React.FC = () => {
  const [data, setData] = useState<TransactionData[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    const dataArray: TransactionData[] = [
      {
        id: 1,
        type: 2,
        transaction: '12415346563475',
        date: '2/5/2020 06:24:45',
        from: 'Tarik',
        to: 'Cenk',
        toPicture: 'https://pbs.twimg.com/profile_images/1265581417364369408/b7CxjEfi_400x400.jpg',
        coin: 'Bitcoin',
        icon: 'https://icons-for-free.com/iconfiles/png/512/btc+coin+crypto+icon-1320162856490699468.png',
        amount: '5.553',
        status: 1,
      },
      {
        id: 2,
        type: 2,
        transaction: '12453465987451',
        date: '3/5/2020 18:35:12',
        from: 'Tarik',
        to: 'Cenk',
        toPicture: 'https://pbs.twimg.com/profile_images/1265581417364369408/b7CxjEfi_400x400.jpg',
        coin: 'Ethereum',
        icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png',
        amount: '3.000',
        status: 2,
      },
      {
        id: 3,
        type: 1,
        transaction: '24153459987415',
        date: '4/5/2020 13:42:01',
        from: 'Cenk',
        to: 'Tarik',
        toPicture: '',
        coin: 'Tether',
        icon: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Tether-USDT-icon.png',
        amount: '158',
        status: 3,
      },
    ];

    setData(dataArray);
  }, []);

  const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setKeyword(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <SiteLayout>
      <Header icon='sort' title='Transactions' />
      <TopBar
        searchValue={keyword}
        searchOnChange={handleSearchValue}
        searchSubmit={handleSearchSubmit}
      />

      {data && data.length > 0 && (
        <table className='data-table'>
          <thead>
            <tr>
              <th className='left'>&nbsp;</th>
              <th className='left responsive-hide'>Transaction</th>
              <th className='left responsive-hide'>Date</th>
              <th className='left'>From</th>
              <th className='left'>To</th>
              <th className='left'>Coin</th>
              <th className='center'>Amount</th>
              <th className='center'>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <TransactionRow key={item.id.toString()} item={item} />
            ))}
          </tbody>
        </table>
      )}
    </SiteLayout>
  );
};

export default TransactionsScreen;
