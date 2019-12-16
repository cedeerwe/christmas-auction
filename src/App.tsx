import React from 'react';
import { MainView } from './components/MainView';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <div
      style={{
        left: 0,
        right: 0,
        width: '100%',
        height: '100vh',
        backgroundImage: 'url(background.jpg)',
        backgroundColor: 'hsla(0,0%,100%,0.85)',
        backgroundBlendMode: 'overlay',
        opacity: 1,
        fontFamily: 'Mountains of Christmas',
        fontSize: 25
      }}
    >
      <MainView />
    </div>
  );
};

export default App;
