import {CodeLocator} from '../index.js'

const test3 = () => {

  const math = (prop, ...args) => {
    if (!Reflect.has(Math,prop)) {
      CodeLocator.whoCalled()
    }
    else {
      return Math[prop] (...args)
    } 
  }

  math ("sqrt", 2)
  math ("rubbish", 0)
  math ("pow", 2, 3)
  math ("nonsense")
  math ("round", 1.3)

}

const test4 = () => {

  const math = (prop, ...args) => {
    if (!Reflect.has(Math,prop)) {
      CodeLocator.whoCalled(0, {
        brief: true
      })
    }
    else {
      return Math[prop] (...args)
    } 
  }

  math ("sqrt", 2)
  math ("rubbish", 0)
  math ("pow", 2, 3)
  math ("nonsense")
  math ("round", 1.3)

}




if (!CodeLocator.isGas) test4()
if (!CodeLocator.isGas) test3()


// note in apps script it has to be coerced to run and
// the main is __GS_INTERNAL_top_function_call__.gs so it can't get the code for that 