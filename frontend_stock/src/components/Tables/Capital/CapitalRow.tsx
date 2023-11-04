import React, { FC, useState, useEffect } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

interface CapitalRowProps {
  item: {
    id: number;
    name: string;
    symbol: string;
    icon: string;
    amount: string;
    currency: string;
    change: string;
    weight: string;
    lineChartData: number[];
    status: number;
  };
  index: number;
}

const CapitalRow: FC<CapitalRowProps> = ({ item, index }) => {
  const [color, setColor] = useState('');
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    if (item.status === 1) {
      setColor('green');
    } else {
      setColor('red');
    }
  }, [item.status]);

  const handleMenuOpen = () => {
    setMenuOpened(!menuOpened);
  };

  return (
    <tr>
      <td>
        <div className='rank accent no-select'>#{index}</div>
      </td>
      <td className='nowrap'>
        <div className='icon cover' style={{ backgroundImage: `url('${item.icon}')` }} />
        <strong>{item.name}</strong>
      </td>
      <td className='center'>
        <strong>
          {item.amount} {item.currency}
        </strong>
      </td>
      <td className='center'>
        <strong className={color}>{item.change}</strong>
      </td>
      <td className='center responsive-hide2'>{item.weight}</td>
      <td className='responsive-hide'>
        <div className='line-chart'>
          <Sparklines data={item.lineChartData} width={150} height={50}>
            <SparklinesLine style={{ strokeWidth: 4 }} color={color} />
          </Sparklines>
        </div>
      </td>
      <td className='right'>
        <button type='button' className='pointer' onClick={handleMenuOpen}>
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
      </td>
    </tr>
  );
};

export default CapitalRow;
