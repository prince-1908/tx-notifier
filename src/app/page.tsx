'use client';
import axios from 'axios';
import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Process not started');
  const [walletAddress, setWalletAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [disableBtn, setDisableBtn] = useState(false);

  const startMonitoring = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus("Initializing...")
    axios.get('/api/monitor', {
      params: {
        address: walletAddress,
        num: phoneNumber
      }
    })
      .then(data => {
        setStatus(data.data.status);
        setDisableBtn(true);
      })
      .catch(() => setStatus('Error starting monitor'));
  }

  const handleStop = async () => {
    await axios.get('/api/monitor', {
      params: { stop: true }
    }).then(() => {
      setDisableBtn(false);
      setStatus('Monitoring stopped');
    }).catch(() => {
      setStatus('Error stopping monitor');
    });

    // window.location.reload();
  };

  return (
    <main className='h-screen flex-col flex justify-evenly items-center'>
      <h1 className='text-5xl font-bold'>
        TON Wallet Monitor
      </h1>
      <p className='absolute right-4 top-4'>
        Status :
        <span className={`${status === "Error starting monitor" || status === "Something went wrong while initializing monitor" ? "text-red-500" : status === "Monitoring started" ? "text-green-400" : "text-white"} `}>
          {' '}{status}
        </span>
      </p>
      <div className='border rounded-2xl w-lg p-8'>
        <form
          onSubmit={startMonitoring}
          className='flex flex-col gap-4'
        >
          <input
            type="text"
            placeholder='Ton Wallet Address'
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className='bg-white/10 p-4 rounded-lg'
            required
          />
          <input
            type="text"
            placeholder='Phone Number (eg. +91XXXXXXXXXX)'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className='bg-white/10 p-4 rounded-lg'
            required
          />
          <button
            type="submit"
            className={`${disableBtn && "hidden"} bg-green-400/50 hover:bg-green-400/75 p-4 text-black rounded-lg cursor-pointer`}
            disabled={disableBtn}
          >
            Start
          </button>
        </form>

        <button
          className={`${!disableBtn && "hidden"} bg-red-500/50 hover:bg-red-500/75 cursor-pointer w-full mt-4 rounded-lg p-4`}
          onClick={handleStop}
        >
          Stop
        </button>
      </div>
    </main>
  );
}
