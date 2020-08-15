import React from 'react';

const inserting = 0;
const editing = 1;

//Data atual
function today() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const today = `${year}-${month}-${day}`;

  return today;
}

export default function MaintenanceScreen({ transaction, onCancel, onSave }) {
  const [description, setDescription] = React.useState('Novo Lançamento');
  const [value, setValue] = React.useState(0);
  const [category, setCategory] = React.useState('Nova Categoria');
  const [date, setDate] = React.useState(today());
  const [type, setType] = React.useState('-');
  const [mode, setMode] = React.useState(inserting);

  React.useEffect(() => {
    if (!transaction) {
      return;
    }

    const { description, value, category, yearMonthDay, type } = transaction;

    setDescription(description);
    setValue(value);
    setDate(yearMonthDay);
    setCategory(category);
    setType(type);
    setMode(editing);
  }, [transaction]);

  const handleDescription = (event) => {
    const newDescription = event.target.value.trim();
    setDescription(newDescription);
  };

  const handleValue = (event) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
  };

  const handleCategory = (event) => {
    const newCategory = event.target.value.trim();
    setCategory(newCategory);
  };

  const handleDate = (event) => {
    const newDate = event.target.value.trim();
    setDate(newDate);
  };

  const handleType = (event) => {
    const newType = event.target.value;
    setType(newType);
  };

  const handleClickCancel = () => {
    onCancel();
  };

  const handleClickSave = () => {
    const newTransaction = {
      _id: !!transaction ? transaction._id : null,
      description,
      value,
      type,
      yearMonthDay: date,
      category,
    };
    onSave(newTransaction);
  };

  return (
    <div>
      <span>
        <label>
          <input
            type="radio"
            name="expense_earning"
            checked={type === '-'}
            value="-"
            onChange={handleType}
          />
          <span>Despesa</span>
        </label>
      </span>
      <span style={{ marginLeft: '15px' }}>
        <label>
          <input
            type="radio"
            name="expense_earning"
            checked={type === '+'}
            value="+"
            onChange={handleType}
          />
          <span>Receita</span>
        </label>
      </span>

      <div className="input-field">
        <input
          type="text"
          value={description}
          onChange={handleDescription}
          id="inputDescription"
        />
        <label htmlFor="inputDescription" className="active">
          Descrição:
        </label>

        <div className="input-field">
          <input
            type="number"
            value={value}
            onChange={handleValue}
            id="inputValue"
          />
          <label htmlFor="inputValue" className="active">
            Valor:
          </label>
        </div>

        <div className="input-field">
          <input
            type="text"
            value={category}
            onChange={handleCategory}
            id="inputCategory"
          />
          <label htmlFor="inputCategory" className="active">
            Categoria:
          </label>
        </div>

        <div className="input-field">
          <input
            type="date"
            value={date}
            onChange={handleDate}
            id="inputDate"
          />
          <label htmlFor="inputDate" className="active">
            Data:
          </label>
        </div>

        <button
          className="waves-effect waves-light btn"
          onClick={handleClickSave}
        >
          Salvar
        </button>
        <button
          className="waves-effect waves-light btn red darken-4"
          style={{ marginLeft: '10px' }}
          onClick={handleClickCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
