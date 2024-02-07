import './App.css'
 import Context from './components/Context'
import Users from "./pages/Users";
import Posts from "./pages/Posts";

function App() {
    //To Do
  const userInfo = {

  }

  return (
    <>
      <Context.Provider value={userInfo}>
        <Users />
          <Posts />
      </Context.Provider>
    </>
  );
}

export default App;
