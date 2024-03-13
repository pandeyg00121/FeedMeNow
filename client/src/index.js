import { ColorModeScript, theme } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import {ApiProvider} from "@reduxjs/toolkit/query/react"
import { myApi } from './redux/api';
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
     <ApiProvider api={myApi}>
    <ChakraProvider theme={theme}>
    <ColorModeScript />
    <App />
    </ChakraProvider>
    </ApiProvider>
  </StrictMode>
);

