import axios from 'axios';

let lastTxHash: string | null = null;

export async function checkTonTransactions(address: string | null) {
  const res = await axios.get('https://toncenter.com/api/v2/getTransactions', {
    params: {
      address: address,
      limit: 1,
      api_key: process.env.TON_API_KEY
    }
  });

  const [tx] = res.data.result;
  if (!tx) return null;

  if (tx.transaction_id.hash !== lastTxHash) {
    lastTxHash = tx.transaction_id.hash;
    return {
      hash: tx.transaction_id.hash,
      value: tx.in_msg.value / 1e9,
      from: tx.in_msg.source,
      to: tx.in_msg.destination
    };
  }

  return null;
}
