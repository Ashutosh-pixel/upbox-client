import { api } from "@/lib/api";
import { searching, Setter } from "@/types/global";

export async function globalSearch(baseUrl: string, query: string, setResults: Setter<searching[]>, setSearching: Setter<boolean>) {
  setSearching(true);
  try {
    const res = await api.get(`${baseUrl}/search?query=${query}`);
    setResults(res.data.data);
  }
  catch (error) {
    console.log('error searching', error)
  }
  finally {
    setSearching(false);
  }
}