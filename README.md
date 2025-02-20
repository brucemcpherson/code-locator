# Code Locator

This can find the code at the currently executing line (or further up the call stack), and retrieve and report on that line. It should work on both Node and Google Apps Script. 

Here's an example of the output.
````
/home/bruce/bm/code-locator/test/test.js
  13:    
  14:      math ("sqrt", 2)
  15:-->   math ("rubbish", 0)
  16:      math ("pow", 2, 3)
  17:      math ("nonsense")
/home/bruce/bm/code-locator/test/test.js
  15:      math ("rubbish", 0)
  16:      math ("pow", 2, 3)
  17:-->   math ("nonsense")
  18:      math ("round", 1.3)
  19:  
````


## Installation 

### Node

````
npm i @mcpher/code-locator
import {CodeLocator} from '@mcpher/code-locator'
````

### Google Apps Script

Include this library - bmCodeLocator

```
14Je2i7tUrYJ7ZfAsKuaLQg72otSojKzaZpY7RmiIjqABoE-UdsgmslG9
const {CodeLocator} = bmCodeLocator

// see notes below for why....
CodeLocator.setGetResource (ScriptApp.getResource)
````



## API

Normally you'll use CodeLocator.whoCalled ([depth, options]) to log where you are, or CodeLocator.getCode ([depth,options]) if you want to handle the logging yourself. Here's the full list of exposed functions, and the options available.

All methods are prefixed by CodeLocator (eg CodeLocator.whoCalled())

### Methods and properties

### isGas 

Indicate whether we're running in gas (true) or Node (false)

#### returns

Boolean


### getLocations () 


Formats the stack into an array of CodeLocations.

#### returns 


[CodeLocation](#codelocation) []


### getCode ([depth, options])

Gets information about the code at the requested depth. Depth 1 (default) would be the call to the function containing the call to this function. 0 would be the actual call to CodeLocator. Higher than 1 would move up the call stack and report on the caller's caller etc.


| parameter | type | default | description |
| --------- | ---- | ------- | ----------- |
|depth|number|1|the stack depth to report at. |
|options|[CodeLocationFormatOptions](CodeLocationFormatOptions)|[formatting defaults](CodeLocationFormatOptions)| how to format the code locator report string |

#### returns 

[CodeReport](#codereport)


### whoCalled ([depth, options])

This is the same as [CodeLocator.getCode()](#getcode) except it also logs the result to console.info

| parameter | type | default | description |
| --------- | ---- | ------- | ----------- |
|depth|number|1|the stack depth to report at. |
|options|[CodeLocationFormatOptions](CodeLocationFormatOptions)|[formatting defaults](CodeLocationFormatOptions)| how to format the code locator report string |

#### returns 

[CodeReport](#codereport)

### setFormatOptions ([options])

You can permanently reset some of the [default options](#codelocationformatoptions).

| parameter | type | default | description |
| --------- | ---- | ------- | ----------- |
|options|[CodeLocationFormatOptions](CodeLocationFormatOptions)|[formatting defaults](CodeLocationFormatOptions)| how to format the code locator report string |

#### returns 

[CodeLocationFormatOptions](CodeLocationFormatOptions)


### getCodeContent (fileName)

It uses a cache to store the code from files. This function will retrieve the code either from cache if it can, or will read from a file. It'll automatically adjust its fetch technique according to whether we're using Gas or Node. You don't normally need to call this unless you want to do something special with all the code content. 


| parameter | type | default | description |
| --------- | ---- | ------- | ----------- |
|filename|string||the filename to get the content for |

#### returns 

[CodeContent](#codecontent) []


## Additional methods to handle Google Apps Script ScriptApp

This only applies to Apps Script. Ignored in Node.

### setGetResource (ScriptApp.getResource)

To retrieve the code for a script file, we use the (undocumented) ScriptApp.getResource function, which can only access code in its own project script. Since CodeLocator is implemented as a library, you need to pass a function it can use to retrieve code from your script. 

After importing CodeLocator, but before doing anything else, you'll need to do this if you want to return the code associated with a line in your own script. This is optional - without it will still report the line number and file name info, but won't be able to reproduce the underlying code.


````
CodeLocator.setGetResource (getResourceFunction)
````


| parameter | type | default | description |
| --------- | ---- | ------- | ----------- |
|getResourceFunction|function|| Mandatory in Apps Script if you want code displayed - pass ScriptApp.getScriptId |

#### returns

function - the function you set

### getGetResource (id)

This only applies to Apps Script. Ignored in Node.


#### returns

function - the function you set

### setScriptId (id)

Only required for the edge case described below:

In the unlikely event you are using multiple libraries and want to report on them too, AND those libraries happen to have scripts with the same name, you'll need to provide a scriptId as well as a getResource function so that the caching algorithm can distingush between them

Remember also, the ScriptApp should belong to the script containing the code (which won't be yours if you are trying to extract code from a library so may not be available anyway)

As follows - this is optional and to handle a very specific edge case.
````
CodeLocator.setScriptId (ScriptApp.getScriptId())
````

| parameter | type | default | description |
| --------- | ---- | ------- | ----------- |
|id|string|'default'| A unique id, preferably the scriptId returned by ScriptApp.getScriptId() |

#### returns

string - the scriptId you set

### getScriptId (id)

Only required for the edge case described at the beginning of these docs

#### returns

string - the scriptId you set with setScriptId

### Types

#### CodeLocation

Describes a line extracted from the stack
````
/**
 * CodeLocation
 * @typedef CodeLocation
 * @property {number} depth the stack depth this came from
 * @property {string} file the file name the error was at
 * @property {number} line the line number it occurred at
 */
````

#### CodeLocationFormatOptions

Controls formatting of code reporting

````
  /**
   * @typedef CodeLocationFormatOptions
   * @property {number} [lineOffset=0] offset from line - to point at for example the line before use -1
   * @property {number} [surroundBefore=2] how many lines to show before the target line
   * @property {number} [surroundAfter=2] how many lines to show after the target line
   * @property {boolean} [showFileName=true] whether to show the filename
   * @property {boolean} [showLineNumber=true] whether to show line numbers
   * @property {boolean} [brief=false] brief only prints the target line and igmores sourround params and uses a concise format
   * @property {number}  [lineNumberWidth=4] width of line number space
   * @property {string} [pointer='--> '] point at target line
   */
````

#### CodeReport

A printable report on the selected code
````
/**
 * CodeReport
 * @typedef CodeReport
 * @property {CodeLocation} location report was created from
 * @property {string} formatted a printable string constructed according to the CodeLocationFormatOptions
 */
````

#### CodeContent

A line of code from a given filename

````
/**
 * CodeContent
 * @typedef CodeContent
 * @property {number} lineNumber 1 based line number in file
 * @property {string} text the code text
 */
 ````


## Examples

My original motivation for this was for enhancing my [unit tester](https://github.com/brucemcpherson/unit), but you can also use it anywhere you want to report which line of code made a call. Let's look at this example. I want to report on which line(s) of code make invalid calls to the math funcion.

````

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

````

We get this result
````
/home/bruce/bm/code-locator/test/test.js
  13:    
  14:      math ("sqrt", 2)
  15:-->   math ("rubbish", 0)
  16:      math ("pow", 2, 3)
  17:      math ("nonsense")
/home/bruce/bm/code-locator/test/test.js
  15:      math ("rubbish", 0)
  16:      math ("pow", 2, 3)
  17:-->   math ("nonsense")
  18:      math ("round", 1.3)
  19:  
````

Here's the same thing but with the 'brief' option.
````
      CodeLocator.whoCalled(1, {
        brief: true
      })
````
gives
````
  36:[/home/bruce/bm/code-locator/test/test.js]-->   math ("rubbish", 0)
  38:[/home/bruce/bm/code-locator/test/test.js]-->   math ("nonsense")
````

Using depth 2 gives one level higher - so not so useful in this case.

````
      CodeLocator.whoCalled(2, {
        brief: true
      })
````
gives
````
  61:[/home/bruce/bm/code-locator/test/test.js]--> if (!CodeLocator.isGas) test4()
  61:[/home/bruce/bm/code-locator/test/test.js]--> if (!CodeLocator.isGas) test4()
````

Depth 0 shows the line that's actually calling for the reports, so again not usually very useful

````
      CodeLocator.whoCalled(0, {
        brief: true
      })
````
gives

````
  26:[/home/bruce/bm/code-locator/test/test.js]-->       CodeLocator.whoCalled(0, {
  26:[/home/bruce/bm/code-locator/test/test.js]-->       CodeLocator.whoCalled(0, {
````

#### Acknowledgement
The intial idea for this came from https://github.com/hapijs/pinpoint