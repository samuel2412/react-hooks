import React,{ useState,useEffect,useRef } from 'react';
import axios from 'axios';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enteredFilter,setEnteredFilter] = useState('');
  const { onFilter } = props;
  const inputRef = useRef();

  useEffect(()=>{
    const timer =setTimeout(()=>{
      if(enteredFilter === inputRef.current.value){
      const queryParams= enteredFilter.length === 0 ? '' :
      `?orderBy="title"&equalTo="${enteredFilter}"`;
      axios.get(`https://react-hooks-9208e.firebaseio.com/ingredients.json${queryParams}`)
        .then(response=>{
          const fetchedIngredients=[];
          for(let key in response.data){
            fetchedIngredients.push({
              ...response.data[key],
                  id:key
              });
              }
             onFilter(fetchedIngredients);
        }).catch(err =>{
          console.log(err)
        });
      }
    },500)

    return () => {
      clearTimeout(timer)
    };

  },[enteredFilter,onFilter]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
          ref={inputRef} 
          type="text" value={enteredFilter} 
          onChange={event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
