import React from 'react';
import './App.css';
import ResourceTable from './components/ResourceTable';
import { Route, Switch, Redirect } from "react-router-dom";
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProjectTable from './components/ProjectTable';
import NavBar from './components/NavBar';
import SkillTable from './components/SkillTable';
import TimeSheetPage from './components/TimeSheetPage';
import TimeSheetTable from './components/TimeSheetTable';
import ResourceForm from './components/Resource/resourceForm_new';
function App() {
  return (
    <div className='container'>
      <Switch>
        <Route path='/' component={LoginForm} exact />
        <Route path="/login" component={LoginForm} />
        <Route path='/RegisterForm' component={RegisterForm} />
        <Route path="/ResourceDetails" component={ResourceTable} />
        <Route path="/ProjectDetails" component={ProjectTable} />
        <Route path="/SkillDetails" component={SkillTable} />
        <Route path="/TimeSheetDetails" component={TimeSheetTable} />
        <Route path="/TimeSheetForm" component={TimeSheetPage} />
        <Route path="/Test" component={ResourceForm} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
