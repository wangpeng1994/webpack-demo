import { helloworld } from './helloworld';

document.write(helloworld());

let arr = [1,2,3]

let [one, two] = arr

let foo = () => console.log(one, two)

foo()

console.log(555)