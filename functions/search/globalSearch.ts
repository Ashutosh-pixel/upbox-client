import { searching, Setter } from "@/types/global";
import axios from "axios";

export async function globalSearch(baseUrl: string, query: string, setResults: Setter<searching[]>, setSearching: Setter<boolean>) {
  setSearching(true);
  try{
    const res = await axios.get(`${baseUrl}/search?query=${query}`);
    setResults(res.data.data);
  }
  catch(error){
    console.log('error searching', error)
  }
  finally{
    setSearching(false);
  }
}