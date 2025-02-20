//import { CodeLocator } from '../index.js'




const test3 = () => {
  if (CodeLocator.isGas) setFetcher()

  const math = (prop, ...args) => {
    if (!Reflect.has(Math, prop)) {
      CodeLocator.whoCalled()
    }
    else {
      return Math[prop](...args)
    }
  }

  math("sqrt", 2)
  math("rubbish", 0)
  math("pow", 2, 3)
  math("nonsense")
  math("round", 1.3)

}

const test4 = () => {
  if (CodeLocator.isGas) setFetcher()

  const math = (prop, ...args) => {
    if (!Reflect.has(Math, prop)) {
      CodeLocator.whoCalled(0, {
        brief: true
      })
    }
    else {
      return Math[prop](...args)
    }
  }

  math("sqrt", 2)
  math("rubbish", 0)
  math("pow", 2, 3)
  math("nonsense")
  math("round", 1.3)

}


const setFetcher = () => {
  // because a GAS library cant get its caller's code
  CodeLocator.setGetResource(ScriptApp.getResource)
  // optional - generally not needed - only necessary if you are using multiple libraries and some file sahre the same ID
  CodeLocator.setScriptId(ScriptApp.getScriptId())
}

// note in apps script it has to be coerced to run and
// the main is __GS_INTERNAL_top_function_call__.gs so it can't get the code for that 

if (!CodeLocator.isGas) {

  test3()
  test4()
}

