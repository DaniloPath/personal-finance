import React from 'react';

export default function MaintenanceScreen({ transaction }) {
  const [description, setDescription] = React.useState('');
  const [value, setValue] = React.useState(0);
  const [category, setCategory] = React.useState('');
  const [date, setDate] = React.useState('');
  const [type, setType] = React.useState('-');

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
      <span>
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
            Descrição:
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

        <button className="waves-effect waves-light btn">Salvar</button>
        <button
          className="waves-effect waves-light btn red darken-4"
          style={{ marginLeft: '10px' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
