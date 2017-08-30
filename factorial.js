var ffi = require('ffi')
var ref = require('ref');
var StructType  = require('ref-struct');


const SmiModule = StructType();
const SmiModulePtr = ref.refType(SmiModule);

SmiModule.defineProperty('name', 'string');
SmiModule.defineProperty('path', 'string');
SmiModule.defineProperty('organization', 'string');
SmiModule.defineProperty('contactinfo', 'string');
SmiModule.defineProperty('description', 'string');
SmiModule.defineProperty('reference', 'string');
SmiModule.defineProperty('language', 'int');
SmiModule.defineProperty('conformance', 'int');


var libfactorial = ffi.Library(__dirname + '/libfactorial.dll', {
  'factorial': [ 'uint64', [ 'int' ] ],
  'GetSmiModule': [ SmiModulePtr, [] ]
})

var smimod = libfactorial.GetSmiModule();

console.log('Your output: ', smimod, smimod.language, smimod.conformance);

if (process.argv.length < 3) {
  console.log('Arguments: ' + process.argv[0] + ' ' + process.argv[1] + ' <max>')
  process.exit()
}

var output = libfactorial.factorial(parseInt(process.argv[2]))

console.log('Your output: ' + output);