import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const GithubContext = createContext();

export const GithubProvider = ({children}) => {
  const initialState= {
    users: [],
    loading: false
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  // Get search results
  const searchUsers = async (text) => {
    setLoading();

    const params = new URLSearchParams({
      q: text
    });

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`,{
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`
      }
    });
    const {items} = await response.json();
    dispatch({
      type: 'GET_USERS',
      payload: items
    })
  };

  // Set loading
  const setLoading = () => dispatch({type:'SET_LOADING'});

  // Clear users from state
  const clearUsers = () => dispatch({
    type:'CLEAR_USERS'
  });

  return <GithubContext.Provider value={{
    users: state.users,
    loading: state.loading,
    searchUsers,
    clearUsers
  }}>{children}</GithubContext.Provider>
};

export default GithubContext;