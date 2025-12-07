import { useEffect, useState } from "react";

export function useDebounce(value:string, delay:number=500){
  const [debounceQuery, setDebounceQuery] = useState(value);
  
  useEffect(()=>{
    const timer = setTimeout(() => setDebounceQuery(value), delay);
    
    return () => clearTimeout(timer);
  },[value,delay])
  
  return debounceQuery;
}