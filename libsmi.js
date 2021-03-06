debugger;

var util = require('util');
var ref = require('ref');
var ffi = require('ffi');
var StructType  = require('ref-struct');
var union = require('ref-union');
var ArrayType = require('ref-array');
var Enum = require('enum');

/* SmiLanguage -- language of an actual MIB module                           */
const SmiLanguage  = new Enum(
{   'SMI_LANGUAGE_UNKNOWN'              : 0,  /* should not occur            */
    'SMI_LANGUAGE_SMIV1'                : 1,
    'SMI_LANGUAGE_SMIV2'                : 2,
    'SMI_LANGUAGE_SMING'                : 3,
    'SMI_LANGUAGE_SPPI'                 : 4
});

/* SmiBasetype -- base types of all languages                                */
const SmiBasetype = new Enum(
{
    'SMI_BASETYPE_UNKNOWN'                : 0,  /* should not occur            */
    'SMI_BASETYPE_INTEGER32'              : 1,  /* also SMIv1/v2 INTEGER       */
    'SMI_BASETYPE_OCTETSTRING'            : 2,
    'SMI_BASETYPE_OBJECTIDENTIFIER'       : 3,
    'SMI_BASETYPE_UNSIGNED32'             : 4,
    'SMI_BASETYPE_INTEGER64'              : 5,  /* SMIng and SPPI              */
    'SMI_BASETYPE_UNSIGNED64'             : 6,  /* SMIv2, SMIng and SPPI       */
    'SMI_BASETYPE_FLOAT32'                : 7,  /* only SMIng                  */
    'SMI_BASETYPE_FLOAT64'                : 8,  /* only SMIng                  */
    'SMI_BASETYPE_FLOAT128'               : 9,  /* only SMIng                  */
    'SMI_BASETYPE_ENUM'                   : 10,
    'SMI_BASETYPE_BITS'                   : 11, /* SMIv2, SMIng and SPPI       */
    'SMI_BASETYPE_POINTER'            		: 12  /* only SMIng                  */
});

/* SmiStatus -- values of status levels                                      */
const SmiStatus = new Enum(
{
    'SMI_STATUS_UNKNOWN'          : 0, /* should not occur                     */
    'SMI_STATUS_CURRENT'          : 1, /* only SMIv2, SMIng and SPPI           */
    'SMI_STATUS_DEPRECATED'       : 2, /* SMIv1, SMIv2, SMIng and SPPI         */
    'SMI_STATUS_MANDATORY'        : 3, /* only SMIv1                           */
    'SMI_STATUS_OPTIONAL'         : 4, /* only SMIv1                           */
    'SMI_STATUS_OBSOLETE'         : 5  /* SMIv1, SMIv2, SMIng and SPPI         */
});

/* SmiAccess -- values of access levels                                      */
const SmiAccess = new Enum(
{
    'SMI_ACCESS_UNKNOWN'          : 0, /* should not occur                     */
    'SMI_ACCESS_NOT_IMPLEMENTED'  : 1, /* only for agent capability variations */
    'SMI_ACCESS_NOT_ACCESSIBLE'   : 2, /* the values 2 to 5 are allowed to be  */
    'SMI_ACCESS_NOTIFY'           : 3, /* compared by relational operators.    */
    'SMI_ACCESS_READ_ONLY'        : 4,
    'SMI_ACCESS_READ_WRITE'       : 5,
    'SMI_ACCESS_INSTALL'          : 6, /* these three entries are only valid   */
    'SMI_ACCESS_INSTALL_NOTIFY'   : 7, /* for SPPI                             */
    'SMI_ACCESS_REPORT_ONLY'      : 8,
    'SMI_ACCESS_EVENT_ONLY'      	: 9	 /* this entry is valid only for SMIng	 */
});

/* SmiNodekind -- type or statement that leads to a definition               */
const SmiNodekind = ref.types.uint;
const SMI_NODEKIND_UNKNOWN      = 0x0000     /* should not occur             */
const SMI_NODEKIND_NODE         = 0x0001
const SMI_NODEKIND_SCALAR       = 0x0002
const SMI_NODEKIND_TABLE        = 0x0004
const SMI_NODEKIND_ROW          = 0x0008
const SMI_NODEKIND_COLUMN       = 0x0010
const SMI_NODEKIND_NOTIFICATION = 0x0020
const SMI_NODEKIND_GROUP        = 0x0040
const SMI_NODEKIND_COMPLIANCE   = 0x0080
const SMI_NODEKIND_CAPABILITIES = 0x0100
const SMI_NODEKIND_ANY          = 0xffff

const SmiNodekindEnum = new Enum(
{
  'SMI_NODEKIND_UNKNOWN'      : 0x0000,     /* should not occur             */
  'SMI_NODEKIND_NODE'         : 0x0001,
  'SMI_NODEKIND_SCALAR'       : 0x0002,
  'SMI_NODEKIND_TABLE'        : 0x0004,
  'SMI_NODEKIND_ROW'          : 0x0008,
  'SMI_NODEKIND_COLUMN'       : 0x0010,
  'SMI_NODEKIND_NOTIFICATION' : 0x0020,
  'SMI_NODEKIND_GROUP'        : 0x0040,
  'SMI_NODEKIND_COMPLIANCE'   : 0x0080,
  'SMI_NODEKIND_CAPABILITIES' : 0x0100,
  'SMI_NODEKIND_ANY'          : 0xffff
});

/* SmiDecl -- type or statement that leads to a definition                   */
const SmiDecl = new Enum(
{
    'SMI_DECL_UNKNOWN'            : 0,  /* should not occur                    */
    /* SMIv1/v2 ASN.1 statements and macros */
    'SMI_DECL_IMPLICIT_TYPE'      : 1,
    'SMI_DECL_TYPEASSIGNMENT'     : 2,
    'SMI_DECL_IMPL_SEQUENCEOF'    : 4,	/* this will go away */
    'SMI_DECL_VALUEASSIGNMENT'    : 5,
    'SMI_DECL_OBJECTTYPE'         : 6,    /* values >= 6 are assumed to be */
    'SMI_DECL_OBJECTIDENTITY'     : 7,    /* registering an OID, see check.c */
    'SMI_DECL_MODULEIDENTITY'     : 8,
    'SMI_DECL_NOTIFICATIONTYPE'   : 9,
    'SMI_DECL_TRAPTYPE'           : 10,
    'SMI_DECL_OBJECTGROUP'        : 11, 
    'SMI_DECL_NOTIFICATIONGROUP'  : 12,
    'SMI_DECL_MODULECOMPLIANCE'   : 13,
    'SMI_DECL_AGENTCAPABILITIES'  : 14,
    'SMI_DECL_TEXTUALCONVENTION'  : 15,
    'SMI_DECL_MACRO'	            : 16,
    'SMI_DECL_COMPL_GROUP'        : 17,
    'SMI_DECL_COMPL_OBJECT'       : 18,
    'SMI_DECL_IMPL_OBJECT'        : 19,	/* object label in sth like "iso(1)" */
    /* SMIng statements */
    'SMI_DECL_MODULE'             : 33,
    'SMI_DECL_EXTENSION'          : 34,
    'SMI_DECL_TYPEDEF'            : 35,
    'SMI_DECL_NODE'               : 36,
    'SMI_DECL_SCALAR'             : 37,
    'SMI_DECL_TABLE'              : 38,
    'SMI_DECL_ROW'                : 39,
    'SMI_DECL_COLUMN'             : 40,
    'SMI_DECL_NOTIFICATION'       : 41,
    'SMI_DECL_GROUP'              : 42,
    'SMI_DECL_COMPLIANCE'         : 43,
    'SMI_DECL_IDENTITY'	          : 44,
    'SMI_DECL_CLASS'	            : 45,
    'SMI_DECL_ATTRIBUTE'	        : 46,
    'SMI_DECL_EVENT'		          : 47
});

/* SmiIndexkind -- actual kind of a table row's index method                 */
const SmiIndexkind = new Enum(
{
    'SMI_INDEX_UNKNOWN'           : 0, 
    'SMI_INDEX_INDEX'             : 1,
    'SMI_INDEX_AUGMENT'           : 2,
    'SMI_INDEX_REORDER'           : 3,
    'SMI_INDEX_SPARSE'            : 4,
    'SMI_INDEX_EXPAND'            : 5
});


const SmiModule = StructType({
  'name': 'string',
  'path': 'string',
  'organization': 'string',
  'contactinfo': 'string',
  'description': 'string',
  'reference': 'string',
  'language': 'int',
  'conformance': 'int'
});

const SmiModulePtr = ref.refType(SmiModule);

const SmiValue = StructType({
    'basetype' : 'int',
    'len' : 'int',
    'value' : union({
        'unsigned64' : 'ulonglong',
        'integer64' : 'longlong',
        'unsigned32' : 'ulong',
        'integer32' : 'long',
        'float32' : 'float',
        'float64' : 'double',
        'float128' : 'longlong',
        'oid' : ref.refType('uint'),
        'ptr' : ref.refType('char')
    }) 
});

const SmiValuePtr = ref.refType(SmiValue);

/* SmiNode -- the main structure of any clause that defines a node           */
const SmiNode = StructType({
    'name' : 'string',
    'oidlen' : 'uint',
    'oid' : 'uint*',
    'decl' : 'int',
    'access' : 'int',
    'status' : 'int',
    'format' : 'string',
    'value' : SmiValue,
    'units' : 'string',
    'description' : 'string',
    'reference' : 'string',
    'indexkind' : 'int',   
    'implied' : 'int',      
    'create' : 'int',    
    'nodekind' : SmiNodekind
});

const SmiNodePtr = ref.refType(SmiNode);


console.log('Pre-Bind');

// binding to a few "libsmi" functions...
var SMILib = ffi.Library('./libsmi-0.4.8/build/libsmi.dll', {
  'smiInit': [ 'int', [ 'string' ] ],
  'smiExit': [ 'void', [ 'void' ] ],
  'smiGetPath': [ 'string', [ ] ],
  'smiSetPath': [ 'int', [ 'string' ] ],
  'smiLoadModule': [ 'string', [ 'string' ] ],
  'smiIsLoaded': [ 'int', [ 'string' ] ],
  'smiGetFirstModule' : [ SmiModulePtr, [ ] ],
  'smiGetNextModule' : [ SmiModulePtr, [ SmiModulePtr ] ],
  'smiGetFirstNode' : [ SmiNodePtr, [ SmiModulePtr, 'uint' ] ],
  'smiGetNextNode' : [ SmiNodePtr, [ SmiNodePtr, 'uint' ] ],
});

  console.log('Pre-Init');

  var ret = SMILib.smiInit('Test');

  console.log('smiInit - %d', ret);

  SMILib.smiSetPath('C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/ietf;C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/iana;C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/irtf;C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/site;C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/tubs;C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/test');

  console.log('smiGetPath - %s', SMILib.smiGetPath());

  console.log('smiLoadModule - %s', SMILib.smiLoadModule('SNMPV2-SMI'));
  console.log('smiLoadModule - %s', SMILib.smiLoadModule('SNMPV2-TC'));
  console.log('smiLoadModule - %s', SMILib.smiLoadModule('SNMPV2-CONF'));
  console.log('smiLoadModule - %s', SMILib.smiLoadModule('RFC1155-SMI'));
  console.log('smiLoadModule - %s', SMILib.smiLoadModule('RFC-1212'));
  console.log('smiLoadModule - %s', SMILib.smiLoadModule('RFC-1215'));
  console.log('smiLoadModule - %s', SMILib.smiLoadModule('RFC1213-MIB'));
  console.log('smiLoadModule - %s', SMILib.smiLoadModule('RS-COMMON-MIB'));
  // console.log('smiLoadModule - %s', SMILib.smiLoadModule('RFC1213-MIB'));

  // break;
  var buff = SMILib.smiGetFirstModule();
  
  while (buff.length > 0) {
    var smiModule = buff.deref();
    console.log('Module - %s, %d', smiModule.name, smiModule.conformance);
    var nodeBuff = SMILib.smiGetFirstNode(buff, SMI_NODEKIND_ANY);
    while (nodeBuff.length > 0) {
      var smiNode = nodeBuff.deref();
      
      console.log('   Node - ' + smiNode.name);
      console.log('   OID->' + new Uint32Array(smiNode.oid.reinterpret(smiNode.oidlen * 4).buffer).join('.'));
      console.log('   SmiDecl->' + SmiDecl.get(smiNode.decl).key);
      console.log('   SmiAccess->' + SmiAccess.get(smiNode.access).key);
      console.log('   SmiStatus->' + SmiStatus.get(smiNode.status).key);
      console.log('   SmiNodekind->' + SmiNodekindEnum.get(smiNode.nodekind).key);
      console.log('   Description->' + smiNode.description);
      console.log('   Format->' + smiNode.format);
      
      nodeBuff = SMILib.smiGetNextNode(nodeBuff, SMI_NODEKIND_ANY);
    }
    buff = SMILib.smiGetNextModule(buff);
  }
