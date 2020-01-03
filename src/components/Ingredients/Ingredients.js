import React, { useState } from 'react';
import axios from 'axios';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const  Ingredients = () => {
  const [ingredients,setIngredients] = useState([]);

  const addIngredientHandler = ingredient => {
    axios.post('https://react-hooks-9208e.firebaseio.com/ingredients.json',ingredient)
    .then(response => {
      console.log(response)
      setIngredients(prevIngredients => [
        ...prevIngredients,
        {
          id: response.data.name,
          ...ingredient
        }
      ])
    })
    .catch(err =>{
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
      <IngredientForm  addIngredient={addIngredientHandler}/>

      <section>
        <Search />
       <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
