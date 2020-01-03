import React, { useState,useEffect } from 'react';
import axios from 'axios';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(()=>{
      axios.get('https://react-hooks-9208e.firebaseio.com/ingredients.json')
      .then(response=>{
        const fetchedIngredients=[];
        for(let key in response.data){
          fetchedIngredients.push({
            ...response.data[key],
                id:key
            });
            }
           setIngredients(fetchedIngredients);
      });
  },[])


  const addIngredientHandler = ingredient => {
    axios.post('https://react-hooks-9208e.firebaseio.com/ingredients.json', ingredient)
      .then(response => {
        setIngredients(prevIngredients => [
          ...prevIngredients,
          {
            id: response.data.name,
            ...ingredient
          }
        ])
       
      })
      .catch(err => {
        console.log(err);
      });
  }
  const removeIngredientHandler = id => {
    console.log('removeIngredient')
    setIngredients(
      ingredients.filter(ingredient => ingredient.id !== id)
    )

  }

  return (
    <div className="App">
      <IngredientForm addIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
