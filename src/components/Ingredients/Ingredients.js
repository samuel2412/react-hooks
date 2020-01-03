import React, { useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';

const ingredientReducer = (currentState, action) => {
  switch (action.type) {
    case 'SET': return action.ingredients;
    case 'ADD': return [...currentState, action.ingredient];
    case 'DELETE': return currentState.filter(ing => ing.id !== action.id);
    default: throw new Error('should not get there')
  }
};
const httpReducer = (currentState, action) => {
  switch (action.type) {
    case 'SEND': return { isLoading: true, error: null }
    case 'RESPONSE': return { ...currentState, isLoading: false }
    case 'ERROR': return { isLoading: false, error: action.messege }
    case 'CLEAR': return {...currentState,error: null}
    default: throw new Error('should not get there')
  }
}

const Ingredients = () => {
  //const [ingredients, setIngredients] = useState([]);
  //const [isLoading, setLoading] = useState(false);
  //const [error, setError] = useState(null);
  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, httpDispatch] = useReducer(httpReducer,{isLoading:false,error:null})

  useEffect(() => {
    console.log("Rendering", ingredients)
  }, [ingredients]);

  const filterIngredientHandler = useCallback(ingredients => {
    //setIngredients(ingredients);
    dispatch({ type: 'SET', ingredients })
  }, []);

  const addIngredientHandler = ingredient => {
    httpDispatch({type:'SEND'})
    axios.post('https://react-hooks-9208e.firebaseio.com/ingredients.json', ingredient)
      .then(response => {
        httpDispatch({type:'RESPONSE'})
        /* setIngredients(prevIngredients => [
          ...prevIngredients,
          {
            id: response.data.name,
            ...ingredient
          }
        ]) */
        dispatch({ type: 'ADD', ingredient: { id: response.data.name, ...ingredient } })

      })
      .catch(err => {
        console.log(err);
        httpDispatch({type:'ERROR',messege: 'Something whent wrong!'})
      });
  }
  const removeIngredientHandler = id => {
    httpDispatch({type:'SEND'})
    axios.delete(`https://react-hooks-9208e.firebaseio.com/ingredients/${id}.json`)
      .then(response => {
        httpDispatch({type:'RESPONSE'})
        /* setIngredients(
          ingredients.filter(ingredient => ingredient.id !== id)
        ) */
        dispatch({ type: 'DELETE', id })
      }).catch(err => {
        httpDispatch({type:'ERROR',messege: 'Something whent wrong!'})
      })
  }

  const clearError = () => {
    httpDispatch({type:'CLEAR'})
  };

  return (
    <div className="App">

      {httpState.error === null ? null : <ErrorModal onClose={clearError} >{httpState.error}</ErrorModal>}

      <IngredientForm addIngredient={addIngredientHandler} isLoading={httpState.isLoading} />

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
