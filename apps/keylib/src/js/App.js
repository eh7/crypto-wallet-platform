// App.js
import { Routes, Route } from 'react-router-dom';

import NavMain from './components/NavMain';

import Home from './pages/Home';
import About from './pages/About';
import Applications from './pages/Applications';

import Setup from './pages/Setup';
import SetupPhrase from './pages/SetupPhrase';
import SetupSeed from './pages/SetupSeed';
import SetupImportKeystore from './pages/SetupImportKeystore';
import SetupExportKeystore from './pages/SetupExportKeystore';

const App = () => {
 return (
    <>
       <NavMain/>
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Applications" element={<Applications />} />
          <Route path="/setup" element={<Setup />} /> 
          <Route path="/setup/phrase" element={<SetupPhrase />} /> 
          <Route path="/setup/seed" element={<SetupSeed />} /> 
          <Route path="/setup/import/keystore" element={<SetupImportKeystore />} /> 
          <Route path="/setup/export/keystore" element={<SetupExportKeystore />} /> 
       </Routes>
    </>
 );
};
//          <Route path="/products" element={<Applications />} />
//          <Route path="/about" element={<About />} />

export default App;