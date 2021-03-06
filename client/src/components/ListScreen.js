import React from 'react';

const receita_color = '#81ecec';
const despesa_color = '#fab1a0';

export default function ListScreen({
  transactions,
  periods,
  filteredText,
  onFilterChange,
  onDeleteTransaction,
  onPeriodChange,
  onNewTransaction,
  currentPeriod,
  onEditTransaction,
}) {
  const { transactionStyle, buttonStyle } = styles;
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <div className="input-field col s12">
          <select
            className="browser-default"
            value={currentPeriod}
            onChange={onPeriodChange}
            style={{ width: '100px' }}
          >
            {periods.map((period) => {
              return <option key={period}>{period}</option>;
            })}
          </select>
        </div>

        <input
          type="text"
          placeholder="Filtro..."
          value={filteredText}
          onChange={onFilterChange}
          style={{
            marginLeft: '10px',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        />
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button
          className="waves-effect waves-light btn"
          onClick={onNewTransaction}
        >
          Novo Registro...
        </button>
      </div>

      {transactions.map((transaction) => {
        const currentColor =
          transaction.type === '+' ? receita_color : despesa_color;
        return (
          <div
            key={transaction._id}
            style={{ ...transactionStyle, backgroundColor: currentColor }}
          >
            <span style={buttonStyle}>
              <button
                className="waves-effect waves-light btn"
                onClick={onEditTransaction}
                id={transaction._id}
              >
                Editar
              </button>
              <button
                className="waves-effect waves-light btn red darken-4"
                onClick={onDeleteTransaction}
                id={transaction._id}
              >
                X
              </button>
            </span>

            <span>
              {transaction.yearMonthDay} -{' '}
              <strong>{transaction.category}</strong> -{' '}
              {transaction.description} - {transaction.value}
            </span>
          </div>
        );
      })}
    </>
  );
}
const styles = {
  transactionStyle: {
    padding: '5px',
    margin: '5px',
    border: '1px solid lightgray',
    borderRadius: '5px',
  },
  buttonStyle: {
    margin: '10px',
  },
};
