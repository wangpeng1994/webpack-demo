import { common } from '../../common';
import { helloworld } from './helloworld';

common();

document.write(helloworld());

let foo = () => console.log(1, 2)

foo()

function App() {
  return 'App';
}
