import React, { useReducer, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';

const ingredientReducer = (currentState,action) => {
  switch(action.type){
    case 'SET': return action.ingredients;
    case 'ADD': return [...currentState,action.ingredient];
    case 'DELETE': return currentState.filter(ing => ing.id !== action.id); 
    default: throw new Error('should not get there')
  }
};

const Ingredients = () => {
  //const [ingredients, setIngredients] = useState([]);
  const [ingredients,dispatch] = useReducer(ingredientReducer,[])
  const [isLoading,setLoading] = useState(false);
  const [error,setError] = useState(null);

  useEffect(() => {
    console.log("Rendering", ingredients)
  }, [ingredients]);

  const filterIngredientHandler = useCallback(ingredients => {
    //setIngredients(ingredients);
    dispatch({type:'SET', ingredients})
  }, []);

  const addIngredientHandler = ingredient => {
    setLoading(true);
    axios.post('https://react-hooks-9208e.firebaseio.com/ingredients.json', ingredient)
      .then(response => {
        setLoading(false);
        /* setIngredients(prevIngredients => [
          ...prevIngredients,
          {
            id: response.data.name,
            ...ingredient
          }
        ]) */
        dispatch({type:'ADD', ingredient: {id: response.data.name, ...ingredient}})

      })
      .catch(err => {
        console.log(err);
        setError(`Something whent wrong!`);
        setLoading(false);
      });
  }
  const removeIngredientHandler = id => {
    setLoading(true);
    axios.delete(`https://react-hooks-9208e.firebaseio.com/ingredients/${id}.json`)
      .then(response => {
        console.log('removeIngredient')
        setLoading(false);
        /* setIngredients(
          ingredients.filter(ingredient => ingredient.id !== id)
        ) */
        dispatch({type:'DELETE', id})
      }).catch(err =>{
        setError(`Something whent wrong!`);
        setLoading(false);
      })
  }

  const clearError = () =>{
    setError(null);
  };

  return (
    <div className="App">

  {error === null ? null : <ErrorModal onClose={clearError} >{error}</ErrorModal>}

      <IngredientForm addIngredient={addIngredientHandler} isLoading={isLoading} />

      <section>
        <Search onFilter={filterIngredientHandler} />
        <IngredientList

        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
