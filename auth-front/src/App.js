import './App.scss';
import {useState, useEffect} from "react"
import axios from "axios"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Home from "./components/pages/Home"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Header from "./components/layout/Header"
import UserContext from "./context/UserContext"

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  })

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem('auth-token')
      if (token === null) {
        localStorage.setItem('auth-token', '')
        token = ''
      }
      const tokenRes = await axios.post('https://localhost:5000/users/tokenIsValid', null, {
        headers: {'x-auth-token': token}
      })
      if (tokenRes.data) {
        const userRes = await axios.get('localhost:5000/users/', {headers: {"x-auth-token": token}})
        setUserData({
          token,
          user: userRes.data
        })
      }
      console.log(tokenRes.data);
    }

    checkLoggedIn()
  }, [])

  console.log(userData);

  return (
    <BrowserRouter>
    <UserContext.Provider value={{userData, setUserData}}>
    <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
