import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedLayout from './components/ProtectedLayout';
import VoteList from './components/VoteList';
import VoteDetail from './components/VoteDetail';
import CreateVote from './components/CreateVote';
import NoMatch from './components/NoMatch';

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={
            <ProtectedLayout>
              <VoteList />
            </ProtectedLayout>
          } />
          <Route path="/vote/:id" element={
            <ProtectedLayout>
              <VoteDetail />
            </ProtectedLayout>
          } />
          <Route path="/create" element={
            <ProtectedLayout>
              <CreateVote />
            </ProtectedLayout>
          } />
        <Route path='*' element={<NoMatch></NoMatch>}></Route>
        </Routes>
    </AuthProvider>
  );
};

export default App;