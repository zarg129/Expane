import React from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import Clients from './components/Clients';
import './App.scss';

function App() {
  const queryClient = new QueryClient();
  
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
       <Clients />
       <ReactQueryDevtools initialIsOpen />
     </QueryClientProvider>
    </div>
  );
};

export default App;
