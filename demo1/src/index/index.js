import { common } from '../../common';
import { helloworld } from './helloworld';
import * as largeNumber from 'xiaofeng-large-number';

var sum = largeNumber.add('1', '999');

console.log(sum);

common();

document.write(helloworld());
