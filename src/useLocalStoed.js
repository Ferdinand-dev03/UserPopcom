import { useState, useEffect } from "react";

export function useLocalStored(initialState , key){

  const [value, setValue] = useState(()=>{
    const storedValue = localStorage.getItem('watched');
    return storedValue ? JSON.parse(storedValue) : initialState
    
  });

  useEffect( ()=>{
    localStorage.setItem('watched', JSON.stringify(value));
  },[value, key])
  return [value, setValue] ;
}