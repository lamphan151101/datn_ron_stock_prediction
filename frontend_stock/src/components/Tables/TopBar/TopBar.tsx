import React, { FC, ChangeEvent, FormEvent } from 'react';

interface TopBarProps {
  searchValue: string;
  searchSubmit: (e: FormEvent) => void;
  searchOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TopBar: FC<TopBarProps> = ({ searchValue, searchOnChange, searchSubmit }) => (
  <div className='top-buttons flex flex-destroy flex-center flex-space-between'>
    <div>
      <div className='top-search no-select nowrap'>
        <form onSubmit={searchSubmit} noValidate>
          <input
            type='text'
            id='search'
            name='search'
            autoComplete='off'
            placeholder='Aranacak kelime'
            onChange={searchOnChange}
            value={searchValue}
          />
          <button type='submit' className='pointer'>
            <i className='material-icons'>search</i>
          </button>
        </form>
      </div>
    </div>
    <div>
      <button type='button' className='button button-white button-large'>
        <i className='material-icons button-icon-left'>event</i>
        Periyod
        <i className='material-icons button-icon-right'>keyboard_arrow_down</i>
      </button>
      <button type='button' className='button button-purple button-large'>
        <i className='material-icons button-icon-left'>download</i>
        CSV indir
      </button>
    </div>
  </div>
);

export default TopBar;