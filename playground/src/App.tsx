import { HashRouter } from 'react-router-dom';
import { RouterList, routes } from './routes';

const App = () => (
  <HashRouter>
    <RouterList routes={routes}></RouterList>
  </HashRouter>
);

export default App;
