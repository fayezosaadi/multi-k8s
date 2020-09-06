import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([])
  const [values, setValues] = useState({})
  const [index, setIndex] = useState('')

  useEffect(() => {
    const fetchIndexes = async () => {
      const indexes = await axios('/api/values/all')
      setSeenIndexes(indexes.data)
    }
    const fetchValues = async () => {
      const values = await axios('/api/values/current')
      setValues(values.data)
    }

    fetchIndexes()
    fetchValues()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post('/api/values', { index })
    setIndex('')
  }

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(', ')
  }

  const renderValues = () => {
    const entries = [];

    for (let key in values) {
      entries.push(<div key={key}>
        For index {key} I calculated {values[key]}
      </div>);
    }

    return entries
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <label>Enter your index </label>
        <input
          value={index}
          onChange={e => setIndex(e.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      { renderSeenIndexes() }

      <h3>Calculated Values:</h3>
      { renderValues() }
    </Fragment>
  );
};

export default Fib;
