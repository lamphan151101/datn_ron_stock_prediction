import React from 'react';
import SiteLayout from '../../layouts/SiteLayout';
import Header from '../../components/Header/Header';

import Box from '../../components/Common/Box';
import BankProcess from '../../components/Widgets/BankProcess/BankProcess';
import RecentActivity from '../../components/Widgets/RecentActivity/RecentActivity';

const DashboardScreen: React.FC = () => (
  <SiteLayout>
    <Header icon='sort' title='Deposit and Withdraw' />
    <div className='flex flex-destroy flex-space-between'>
      <div className='flex-1 box-right-padding'>
        <BankProcess />
      </div>
      <div className='flex-1'>
        <Box>
          <div className='box-title box-vertical-padding box-horizontal-padding no-select'>
            <div className='flex flex-center flex-space-between'>
              <p>Important</p>
            </div>
          </div>
          <div className='box-content box-text box-horizontal-padding box-content-height-nobutton'>
            <p>
              &bull; For EFT transfers, you need to write "Crypto Exchange" in the recipient's name.
            </p>
            <p>
              &bull; You can perform wire transfers from all your individual, current, and Turkish Lira accounts listed under your name to the listed accounts. Transfers from accounts belonging to different persons will not be accepted.
            </p>
            <p>
              &bull; Transfers made using an ATM (with or without a card) will not be accepted as it is not possible to verify sender information.
            </p>
            <p>
              &bull; The amount you send will be automatically credited to your account after checks, and you do not need to provide any notifications.
            </p>
            <p>
              &bull; You do not need to enter a fixed deposit code in the explanation section because you have completed the identity verification process.
            </p>
          </div>
        </Box>
      </div>
    </div>
    <div className='flex flex-destroy flex-space-between'>
      <div className='flex-1 box-right-padding'>
        <RecentActivity />
      </div>
      <div className='flex-1'>
        <Box>
          <div className='box-title box-vertical-padding box-horizontal-padding no-select'>
            <div className='flex flex-center flex-space-between'>
              <p>Important</p>
            </div>
          </div>
          <div className='box-content box-text box-horizontal-padding box-content-height-nobutton'>
            <p>
              &bull; You can make withdrawals to all your bank accounts opened in your name (individual, current, TL). The transfer will not be made to a different person.
            </p>
            <p>
              &bull; The minimum withdrawal amount is 10 TL.
            </p>
            <p>
              &bull; A transaction fee of 3 TL is charged during the withdrawal process.
            </p>
            <p>
              &bull; When you give a withdrawal order, this amount will be deducted from your available balance.
            </p>
            <p>
              &bull; You can cancel your unprocessed orders. In this case, the order amount will be transferred back to your available balance.
            </p>
            <p>
              &bull; Withdrawal orders given outside of bank business hours are processed when the banks start their business hours.
            </p>
          </div>
        </Box>
      </div>
    </div>
  </SiteLayout>
);

export default DashboardScreen;
