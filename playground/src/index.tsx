import './styles/index.less';
import { createRoot } from 'react-dom/client';

import App from './App';

const root = createRoot(document.getElementById('root') as HTMLElement);

const render = () => {
  root.render(<App></App>);
};

render();
