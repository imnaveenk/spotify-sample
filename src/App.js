import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <div className="mb-8">
        {/*
        A <Switch> looks through all its children <Route>
        elements and renders the first one whose path
        matches the current URL. Use a <Switch> any time
        you have multiple routes, but you want only one
        of them to render at a time
      */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
        <footer>
          <div className="fixed bottom-0 h-10 p-2 bg-gray-200 w-full  text-center">
            Powered by <a href="http://www.thecodemesh.com">TheCodeMesh</a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
