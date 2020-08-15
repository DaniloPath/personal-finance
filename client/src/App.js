import React from 'react';
import axios from 'axios';
import ListScreen from './components/ListScreen';
import MaintenanceScreen from './components/MaintenanceScreen';

const api = axios.create({ baseURL: 'api' });
const root = '/transaction';

//Data atual, tipo ano-mes
function today() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  const today = `${year}-${month}`;

  return today;
}

const PERIODS = [
  '2019-01',
  '2019-02',
  '2019-03',
  '2019-04',
  '2019-05',
  '2019-06',
  '2019-07',
  '2019-08',
  '2019-09',
  '2019-10',
  '2019-11',
  '2019-12',
  '2020-01',
  '2020-02',
  '2020-03',
  '2020-04',
  '2020-05',
  '2020-06',
  '2020-07',
  '2020-08',
  '2020-09',
  '2020-10',
  '2020-11',
  '2020-12',
  '2021-01',
  '2021-02',
  '2021-03',
  '2021-04',
  '2021-05',
  '2021-06',
  '2021-07',
  '2021-08',
  '2021-09',
  '2021-10',
  '2021-11',
  '2021-12',
];

const LIST_SCREEN = 0;
const MAINTENANCE_SCREEN = 1;

export default function App() {
  const [transactions, setTransactions] = React.useState([]);
  const [filteredTransactions, setFilteredTransactions] = React.useState([]);
  const [currentPeriod, setCurrentPeriod] = React.useState(today());
  const [currentScreen, setCurrentScreen] = React.useState(0);
  const [filteredText, setFilteredText] = React.useState('');
  const [selectedTransaction, setSelectedTransaction] = React.useState(null);
  const [newTransaction, setNewTransaction] = React.useState(false);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await api.get(`/transaction?period=${currentPeriod}`);

      setTransactions(data.transactions);
    };

    fetchTransactions();
  }, [currentPeriod]);

  React.useEffect(() => {
    let newFilter = [...transactions];

    if (filteredText.trim() !== '') {
      newFilter = newFilter.filter((transaction) => {
        return transaction.description.toLowerCase().includes(filteredText);
      });
    }

    setFilteredTransactions(newFilter);
  }, [transactions, filteredText]);

  React.useEffect(() => {
    const newScreen =
      selectedTransaction !== null || newTransaction
        ? MAINTENANCE_SCREEN
        : LIST_SCREEN;

    setCurrentScreen(newScreen);
  }, [selectedTransaction, newTransaction]);

  const handlePeriodChange = (event) => {
    const newPeriod = event.target.value;
    setCurrentPeriod(newPeriod);
  };

  const handleDeleteTransaction = async (event) => {
    const id = event.target.id;
    await api.delete(`${root}/${id}`);

    const newTransactions = transactions.filter((transaction) => {
      return transaction._id !== id;
    });

    setTransactions(newTransactions);
  };

  const handleEditTransaction = async (event) => {
    const id = event.target.id;

    const newSelectedTransaction = filteredTransactions.find((item) => {
      return item._id === id;
    });

    setSelectedTransaction(newSelectedTransaction);
  };

  const handleFilterChange = (event) => {
    const text = event.target.value.trim();
    setFilteredText(text.toLowerCase());
  };

  const handleCancel = () => {
    setNewTransaction(false);
    setSelectedTransaction(null);
  };

  const handleSave = async (newTransaction) => {
    const { _id } = newTransaction;

    if (!_id) {
      const insertingTrasanction = {
        ...newTransaction,
        year: Number(newTransaction.yearMonthDay.substring(0, 4)),
        month: Number(newTransaction.yearMonthDay.substring(5, 7)),
        day: Number(newTransaction.yearMonthDay.substring(8, 10)),
      };

      const { data } = await api.post(`${root}/`, insertingTrasanction);

      const newTransactions = [...transactions, data.transaction];
      newTransactions.sort((a, b) => {
        return a.yearMonthDay.localeCompare(b.yearMonthDay);
      });

      setTransactions(newTransactions);
      setNewTransaction(false);
    } else {
      const completeTransaction = {
        ...newTransaction,
        year: Number(newTransaction.yearMonthDay.substring(0, 4)),
        month: Number(newTransaction.yearMonthDay.substring(5, 7)),
        day: Number(newTransaction.yearMonthDay.substring(8, 10)),
      };

      await api.put(`${root}/${_id}`, completeTransaction);

      const newTransactions = [...transactions];
      const index = newTransactions.findIndex((transaction) => {
        return transaction._id === completeTransaction._id;
      });
      newTransactions[index] = completeTransaction;
      setTransactions(newTransactions);
      setSelectedTransaction(null);
    }
  };

  const handleNewTransaction = async () => {
    setNewTransaction(true);
  };

  return (
    <div className="container">
      <h1 className="center">Finanças Pessoais</h1>

      {currentScreen === LIST_SCREEN ? (
        <ListScreen
          transactions={filteredTransactions}
          periods={PERIODS}
          currentPeriod={currentPeriod}
          filteredText={filteredText}
          onDeleteTransaction={handleDeleteTransaction}
          onEditTransaction={handleEditTransaction}
          onFilterChange={handleFilterChange}
          onPeriodChange={handlePeriodChange}
          onNewTransaction={handleNewTransaction}
        />
      ) : (
        <MaintenanceScreen
          transaction={selectedTransaction}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
