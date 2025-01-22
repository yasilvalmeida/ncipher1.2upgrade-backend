import { useCallback, useEffect, useState } from 'react';
import Button from '../common/buttons/clipButton';
import axios from 'axios';
import moment from 'moment';
import { BACKEND_API_URL } from '../../constants/constants';

const ExchangeCurrency = () => {
  const [currencyIn, setCurrencyIn] = useState();
  const [currencyOut, setCurrencyOut] = useState();
  const [valueIn, setValueIn] = useState('1');
  const [valueOut, setValueOut] = useState('');
  const [error, setError] = useState('');
  const [currencies, setCurrencies] = useState(['USD', 'EUR', 'GBP']);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_API_URL}/currency/currencies`).then((res) => {
      const currencies = res.data;
      if (currencies?.length > 0) {
        setCurrencyIn(currencies[0]);
        setCurrencyOut(currencies[0]);
        setCurrencies(currencies);
      }
    });
  }, []);

  const handleConvert = useCallback(() => {
    setError('');
    axios
      .post(`${BACKEND_API_URL}/currency/exchange`, {
        currencyIn,
        currencyOut,
        valueIn,
      })
      .then((res) => {
        const exchange = res.data;
        setValueOut(exchange.valueOut);
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError(error.message);
        }
        console.log(error.config);
      });
  }, [valueIn, currencyIn, currencyOut]);

  const handleHistory = (e) => {
    e.preventDefault();
    axios.get(`${BACKEND_API_URL}/currency/history`).then((res) => {
      const history = res.data;
      setHistory(history);
    });
  };

  return (
    <div className='nyxBorderTop nyxContainer' id='exchange-currency'>
      <div className='nyxBorderX relative'>
        <div className='flex flex-row pt-[42px] sm:pt-[50px] md:pt-[60px] lg:pt-[80px] xl:pb-[82px] xl:pt-[134px]'>
          <div className='lg:pl-[20px]] bg-right-bottom bg-no-repeat pb-0 pe-[6px] pl-[6px] pt-0 sm:pe-[6px] sm:pl-[6px] md:pe-[12px] md:pl-[12px] lg:pe-[20px] xl:pb-[118px] xl:pe-[45%] xl:pl-[58px] xl:pt-[66px]'>
            <p className='mb-[12px] inline-block bg-gradient-to-r from-[#5AB0FF] to-[#01FFC2] bg-clip-text font-[RobotoMono] text-[16px] font-medium text-transparent sm:mb-[12px] sm:text-[16px] md:mb-[16px] md:text-[20px]'>
              Exchange Currency
            </p>
            <h1 className='mb-[12px] font-[VioletSans] text-[26px] text-white sm:mb-[12px] sm:text-[35px] md:mb-[16px] md:text-[57px]'>
              Exchange Currency in Real Time
            </h1>
            <p className='font-[RobotoMono] text-white sm:text-[14px] md:text-[18px]'>
              We offer an exchange rate currency API.
            </p>

            <div className='flex flex-row justify-between gap-8'>
              <div className='mt-8 h-[460] w-[600px] rounded border-2 border-white p-2 text-white'>
                <div className='flex flex-row justify-between'>
                  <div className='mb-6 w-full px-3 md:mb-0'>
                    <label
                      className='mb-2 block text-xs font-bold uppercase tracking-wide text-white'
                      htmlFor='grid-state'
                    >
                      Value Input
                    </label>
                    <div className='relative'>
                      <input
                        type='number'
                        aria-label='valueIn'
                        name='valueIn'
                        value={valueIn}
                        onChange={(e) => setValueIn(e.target.value)}
                        className='text-black'
                      />
                    </div>
                  </div>

                  <div className='mb-6 w-full px-3 md:mb-0'>
                    <label
                      className='mb-2 block text-xs font-bold uppercase tracking-wide text-white'
                      htmlFor='grid-state'
                    >
                      Currency Input
                    </label>
                    <div className='relative'>
                      <select
                        className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                        id='currencyIn'
                        value={currencyIn}
                        onChange={(e) => setCurrencyIn(e.target.value)}
                      >
                        {currencies?.map((currency) => (
                          <option key={currency}>{currency}</option>
                        ))}
                      </select>
                      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'></div>
                    </div>
                  </div>
                </div>

                <div className='flex flex-row justify-between'>
                  <div className='mb-6 w-full px-3 md:mb-0'>
                    <label
                      className='mb-2 block text-xs font-bold uppercase tracking-wide text-white'
                      htmlFor='grid-state'
                    >
                      Value Output
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        aria-label='valueOut'
                        name='valueOut'
                        disabled={true}
                        value={valueOut}
                        onChange={(e) => setValueOut(e.target.value)}
                        className='text-black'
                      />
                    </div>
                  </div>

                  <div className='mb-6 w-full px-3 md:mb-0'>
                    <label
                      className='mb-2 block text-xs font-bold uppercase tracking-wide text-white'
                      htmlFor='grid-state'
                    >
                      Currency Output
                    </label>
                    <div className='relative'>
                      <select
                        className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                        id='currencyOut'
                        value={currencyOut}
                        onChange={(e) => setCurrencyOut(e.target.value)}
                      >
                        {currencies?.map((currency) => (
                          <option key={currency}>{currency}</option>
                        ))}
                      </select>
                      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'></div>
                    </div>
                  </div>
                </div>

                {error && (
                  <span className='my-2 flex flex-row justify-center text-xs italic text-red-600'>
                    {error}
                  </span>
                )}

                <div className='mt-4 flex flex-row items-end justify-end gap-2 pr-3'>
                  <Button
                    onClick={handleHistory}
                    detail={{ value: 'History' }}
                  />
                  <Button
                    onClick={handleConvert}
                    detail={{ value: 'Convert' }}
                  />
                </div>
              </div>

              <div className='mt-8 h-[300px] w-[700px] overflow-y-auto rounded border-2 border-white p-2 text-white'>
                <label htmlFor=''>Exchange History</label>
                <div className='mt-5 flex h-32 w-auto flex-col overflow-y-auto'>
                  {history?.length > 0 && (
                    <table className='mt-5 w-full table-auto overflow-auto'>
                      <thead>
                        <td className='text-nowrap px-2 text-end'>Value In</td>
                        <td className='text-nowrap px-2 text-end'>
                          Currency In
                        </td>
                        <td className='text-nowrap px-2 text-end'>Value Out</td>
                        <td className='text-nowrap px-2 text-end'>
                          Currency Out
                        </td>
                        <td className='text-nowrap px-2'>Created At</td>
                      </thead>
                      <tbody className='mt-5 w-full table-auto overflow-auto'>
                        {history?.map((exchange) => (
                          <tr key={exchange.id}>
                            <td className='px-2 text-end'>
                              {(exchange?.valueIn || 0).toFixed(2)}
                            </td>
                            <td className='px-2 text-end'>
                              {exchange.currencyIn}
                            </td>
                            <td className='px-2 text-end'>
                              {(exchange?.valueOut || 0).toFixed(2)}
                            </td>
                            <td className='px-2 text-end'>
                              {exchange.currencyOut}
                            </td>
                            <td className='px-2'>
                              {moment(exchange.createdAt).format('YYYY-MM-DD')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeCurrency;
