import { Route, Routes } from 'react-router';
import AuthPage from './components/Auth';
import Home from './components/Home';
import ProtectedLayout from './components/ProtectedLayout';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" Component={AuthPage}></Route>

        <Route element={<ProtectedLayout />}>
          <Route index Component={Home}></Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
