import logo from "./logo.svg";

import Orders from "./components/pages/Orders";
import Menu from "./components/pages/Menu";
import NewDish from "./components/pages/NewDish";
import { Route, Link, Switch } from "react-router-dom";
import SideMenu from "./components/ui/SideMenu";
import firebase, { FirebaseContext } from "./firebase";
function App() {
  return (
    <FirebaseContext.Provider
      value={{
        firebase,
      }}
    >
      <div className="md:flex min-h-screen">
        <SideMenu />
        <div className="md:w-3/5 xl:w-4/5 p-6">
          <Switch>
            <Route exact path="/">
              <Orders />
            </Route>
            <Route path="/menu">
              <Menu />
            </Route>
            <Route path="/newdish">
              <NewDish />
            </Route>
          </Switch>
        </div>
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;
