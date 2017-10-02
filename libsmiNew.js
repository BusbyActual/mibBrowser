const util = require('util');
const ref = require('ref');
const ffi = require('ffi');
const StructType = require('ref-struct');
const union = require('ref-union');
const ArrayType = require('ref-array');
const Enum = require('enum');
const fs = require('fs');
const resolve = require('path').resolve;
const CircularJSON = require('circular-json');
/* SmiLanguage -- language of an actual MIB module                           */
const SmiLanguage = new Enum({
  SMI_LANGUAGE_UNKNOWN: 0 /* should not occur            */,
  SMI_LANGUAGE_SMIV1: 1,
  SMI_LANGUAGE_SMIV2: 2,
  SMI_LANGUAGE_SMING: 3,
  SMI_LANGUAGE_SPPI: 4,
});

/* SmiBasetype -- base types of all languages                                */
const SmiBasetype = new Enum({
  SMI_BASETYPE_UNKNOWN: 0 /* should not occur            */,
  SMI_BASETYPE_INTEGER32: 1 /* also SMIv1/v2 INTEGER       */,
  SMI_BASETYPE_OCTETSTRING: 2,
  SMI_BASETYPE_OBJECTIDENTIFIER: 3,
  SMI_BASETYPE_UNSIGNED32: 4,
  SMI_BASETYPE_INTEGER64: 5 /* SMIng and SPPI              */,
  SMI_BASETYPE_UNSIGNED64: 6 /* SMIv2, SMIng and SPPI       */,
  SMI_BASETYPE_FLOAT32: 7 /* only SMIng                  */,
  SMI_BASETYPE_FLOAT64: 8 /* only SMIng                  */,
  SMI_BASETYPE_FLOAT128: 9 /* only SMIng                  */,
  SMI_BASETYPE_ENUM: 10,
  SMI_BASETYPE_BITS: 11 /* SMIv2, SMIng and SPPI       */,
  SMI_BASETYPE_POINTER: 12 /* only SMIng                  */,
});

/* SmiStatus -- values of status levels                                      */
const SmiStatus = new Enum({
  SMI_STATUS_UNKNOWN: 0 /* should not occur                     */,
  SMI_STATUS_CURRENT: 1 /* only SMIv2, SMIng and SPPI           */,
  SMI_STATUS_DEPRECATED: 2 /* SMIv1, SMIv2, SMIng and SPPI         */,
  SMI_STATUS_MANDATORY: 3 /* only SMIv1                           */,
  SMI_STATUS_OPTIONAL: 4 /* only SMIv1                           */,
  SMI_STATUS_OBSOLETE: 5 /* SMIv1, SMIv2, SMIng and SPPI         */,
});

/* SmiAccess -- values of access levels                                      */
const SmiAccess = new Enum({
  SMI_ACCESS_UNKNOWN: 0 /* should not occur                     */,
  SMI_ACCESS_NOT_IMPLEMENTED: 1 /* only for agent capability variations */,
  SMI_ACCESS_NOT_ACCESSIBLE: 2 /* the values 2 to 5 are allowed to be  */,
  SMI_ACCESS_NOTIFY: 3 /* compared by relational operators.    */,
  SMI_ACCESS_READ_ONLY: 4,
  SMI_ACCESS_READ_WRITE: 5,
  SMI_ACCESS_INSTALL: 6 /* these three entries are only valid   */,
  SMI_ACCESS_INSTALL_NOTIFY: 7 /* for SPPI                             */,
  SMI_ACCESS_REPORT_ONLY: 8,
  SMI_ACCESS_EVENT_ONLY: 9 /* this entry is valid only for SMIng	 */,
});

/* SmiNodekind -- type or statement that leads to a definition               */
const SmiNodekind = ref.types.uint;
const SMI_NODEKIND_UNKNOWN = 0x0000; /* should not occur             */
const SMI_NODEKIND_NODE = 0x0001;
const SMI_NODEKIND_SCALAR = 0x0002;
const SMI_NODEKIND_TABLE = 0x0004;
const SMI_NODEKIND_ROW = 0x0008;
const SMI_NODEKIND_COLUMN = 0x0010;
const SMI_NODEKIND_NOTIFICATION = 0x0020;
const SMI_NODEKIND_GROUP = 0x0040;
const SMI_NODEKIND_COMPLIANCE = 0x0080;
const SMI_NODEKIND_CAPABILITIES = 0x0100;
const SMI_NODEKIND_ANY = 0xffff;

const SmiNodekindEnum = new Enum({
  SMI_NODEKIND_UNKNOWN: 0x0000 /* should not occur             */,
  SMI_NODEKIND_NODE: 0x0001,
  SMI_NODEKIND_SCALAR: 0x0002,
  SMI_NODEKIND_TABLE: 0x0004,
  SMI_NODEKIND_ROW: 0x0008,
  SMI_NODEKIND_COLUMN: 0x0010,
  SMI_NODEKIND_NOTIFICATION: 0x0020,
  SMI_NODEKIND_GROUP: 0x0040,
  SMI_NODEKIND_COMPLIANCE: 0x0080,
  SMI_NODEKIND_CAPABILITIES: 0x0100,
  SMI_NODEKIND_ANY: 0xffff,
});

/* SmiDecl -- type or statement that leads to a definition                   */
const SmiDecl = new Enum({
  SMI_DECL_UNKNOWN: 0 /* should not occur                    */,
  /* SMIv1/v2 ASN.1 statements and macros */
  SMI_DECL_IMPLICIT_TYPE: 1,
  SMI_DECL_TYPEASSIGNMENT: 2,
  SMI_DECL_IMPL_SEQUENCEOF: 4 /* this will go away */,
  SMI_DECL_VALUEASSIGNMENT: 5,
  SMI_DECL_OBJECTTYPE: 6 /* values >= 6 are assumed to be */,
  SMI_DECL_OBJECTIDENTITY: 7 /* registering an OID, see check.c */,
  SMI_DECL_MODULEIDENTITY: 8,
  SMI_DECL_NOTIFICATIONTYPE: 9,
  SMI_DECL_TRAPTYPE: 10,
  SMI_DECL_OBJECTGROUP: 11,
  SMI_DECL_NOTIFICATIONGROUP: 12,
  SMI_DECL_MODULECOMPLIANCE: 13,
  SMI_DECL_AGENTCAPABILITIES: 14,
  SMI_DECL_TEXTUALCONVENTION: 15,
  SMI_DECL_MACRO: 16,
  SMI_DECL_COMPL_GROUP: 17,
  SMI_DECL_COMPL_OBJECT: 18,
  SMI_DECL_IMPL_OBJECT: 19 /* object label in sth like "iso(1)" */,
  /* SMIng statements */
  SMI_DECL_MODULE: 33,
  SMI_DECL_EXTENSION: 34,
  SMI_DECL_TYPEDEF: 35,
  SMI_DECL_NODE: 36,
  SMI_DECL_SCALAR: 37,
  SMI_DECL_TABLE: 38,
  SMI_DECL_ROW: 39,
  SMI_DECL_COLUMN: 40,
  SMI_DECL_NOTIFICATION: 41,
  SMI_DECL_GROUP: 42,
  SMI_DECL_COMPLIANCE: 43,
  SMI_DECL_IDENTITY: 44,
  SMI_DECL_CLASS: 45,
  SMI_DECL_ATTRIBUTE: 46,
  SMI_DECL_EVENT: 47,
});

/* SmiIndexkind -- actual kind of a table row's index method                 */
const SmiIndexkind = new Enum({
  SMI_INDEX_UNKNOWN: 0,
  SMI_INDEX_INDEX: 1,
  SMI_INDEX_AUGMENT: 2,
  SMI_INDEX_REORDER: 3,
  SMI_INDEX_SPARSE: 4,
  SMI_INDEX_EXPAND: 5,
});

const SmiModule = StructType({
  name: 'string',
  path: 'string',
  organization: 'string',
  contactinfo: 'string',
  description: 'string',
  reference: 'string',
  language: 'int',
  conformance: 'int',
});

const SmiModulePtr = ref.refType(SmiModule);

const SmiValue = StructType({
  basetype: 'int',
  len: 'int',
  value: union({
    unsigned64: 'ulonglong',
    integer64: 'longlong',
    unsigned32: 'ulong',
    integer32: 'long',
    float32: 'float',
    float64: 'double',
    float128: 'longlong',
    oid: 'uint*',
    ptr: 'char*',
  }),
});

const SmiValuePtr = ref.refType(SmiValue);

/* SmiNamedNumber -- a named number; for enumeration and bitset types        */
const SmiNamedNumber = StructType({
  name: 'string',
  value: SmiValue,
});

const SmiNamedNumberPtr = ref.refType(SmiNamedNumber);

/* SmiRange -- a min-max value range; for subtyping of sizes or numbers      */
const SmiRange = StructType({
  minValue: SmiValue,
  maxValue: SmiValue,
});

const SmiRangePtr = ref.refType(SmiRange);

/* SmiRevision -- content of a single module's revision clause               */
const SmiRevision = StructType({
  date: 'longlong',
  description: 'string',
});

const SmiRevisionPtr = ref.refType(SmiRevision);

/* SmiImport -- an imported descriptor                                       */
const SmiImport = StructType({
  module: 'string',
  name: 'string',
});

const SmiImportPtr = ref.refType(SmiImport);

/* SmiMacro -- the main structure of a SMIv1/v2 macro or SMIng extension     */
const SmiMacro = StructType({
  name: 'string',
  decl: 'int',
  status: 'int',
  description: 'string',
  reference: 'string',
  abnf: 'string' /* only for SMIng */,
});

const SmiMacroPtr = ref.refType(SmiMacro);

/* SmiIdentity -- the main structure of a SMIng Identity.		     */
/* NOTE: Not to be confused with SMIv2 MODULE-IDENTITY */
const SmiIdentity = StructType({
  name: 'string',
  decl: 'int',
  status: 'int',
  description: 'string',
  reference: 'string',
});

const SmiIdentityPtr = ref.refType(SmiIdentity);

/* SmiType -- the main structure of a type definition (also base types)      */
/* also SMIng attributes      */
const SmiType = StructType({
  name: 'string',
  basetype: 'int',
  decl: 'int',
  format: 'string',
  value: SmiValue,
  units: 'string',
  status: 'int',
  description: 'string',
  reference: 'string',
});

const SmiTypePtr = ref.refType(SmiType);

/* SmiNode -- the main structure of any clause that defines a node           */
const SmiNode = StructType({
  name: 'string',
  oidlen: 'uint',
  oid: 'uint*',
  decl: 'int',
  access: 'int',
  status: 'int',
  format: 'string',
  value: SmiValue,
  units: 'string',
  description: 'string',
  reference: 'string',
  indexkind: 'int',
  implied: 'int',
  create: 'int',
  nodekind: SmiNodekind,
});

const SmiNodePtr = ref.refType(SmiNode);

/* SmiElement -- an item in a list (row index column, notification object)   */
const SmiElement = StructType(
  {
    /* no visible attributes */
  },
);

const SmiElementPtr = ref.refType(SmiElement);

/* SmiOption -- an optional group in a compliance statement                  */
const SmiOption = StructType({
  description: 'string',
});

const SmiOptionPtr = ref.refType(SmiOption);

/* SmiRefinement -- a refined object in a compliance statement               */
const SmiRefinement = StructType({
  access: 'int',
  description: 'string',
});

const SmiRefinementPtr = ref.refType(SmiRefinement);

/* SmiClass -- main structure for SMIng class statement               */
const SmiClass = StructType({
  name: 'string',
  decl: 'int',
  status: 'int',
  description: 'string',
  reference: 'string',
});

const SmiClassPtr = ref.refType(SmiClass);

/* SmiClass -- main structure for class attribute               */
const SmiAttribute = StructType({
  name: 'string',
  basetype: 'int',
  decl: 'int',
  format: 'string',
  value: SmiValue,
  units: 'string',
  status: 'int',
  description: 'string',
  reference: 'string',
  access: 'int',
});

const SmiAttributePtr = ref.refType(SmiAttribute);

/* SmiEvent -- the main structure of a SMIng Event(part of class definition). */
const SmiEvent = StructType({
  name: 'string',
  decl: 'int',
  status: 'int',
  description: 'string',
  reference: 'string',
});

const SmiEventPtr = ref.refType(SmiEvent);

console.log('Pre-Bind');

// binding to a few "libsmi" functions...
const SMILib = ffi.Library('./libsmi-0.4.8/build/libsmi.dll', {
  smiInit: ['int', ['string']],
  smiExit: ['void', ['void']],
  smiGetPath: ['string', []],
  smiSetPath: ['int', ['string']],
  smiLoadModule: ['string', ['string']],
  smiIsLoaded: ['int', ['string']],
  smiGetFirstModule: [SmiModulePtr, []],
  smiGetNextModule: [SmiModulePtr, [SmiModulePtr]],
  smiGetFirstNode: [SmiNodePtr, [SmiModulePtr, 'uint']],
  smiGetNextNode: [SmiNodePtr, [SmiNodePtr, 'uint']],
  smiGetNode: [SmiNodePtr, [SmiModulePtr, 'String']],
  smiGetNodeModule: [SmiModulePtr, [SmiNodePtr]],
  smiGetNodeType: [SmiTypePtr, [SmiNodePtr]],
  smiGetRelatedNode: [SmiNodePtr, [SmiNodePtr]],
  smiGetParentNode: [SmiNodePtr, [SmiNodePtr]],
  smiGetNodeLine: ['int', [SmiNodePtr]],
  smiGetFirstRange: [SmiRangePtr, [SmiTypePtr]],
  smiGetNextRange: [SmiRangePtr, [SmiRangePtr]],
  smiGetMinMaxRange: ['int', [SmiTypePtr, SmiValue, SmiValue]],
  smiGetFirstNamedNumber: [SmiNamedNumberPtr, [SmiTypePtr]],
  smiGetNextNamedNumber: [SmiNamedNumberPtr, [SmiNamedNumberPtr]],
  smiGetFirstElement: [SmiElementPtr, [SmiNodePtr]],
  smiGetNextElement: [SmiElementPtr, [SmiElementPtr]],
  smiGetElementNode: [SmiNodePtr, [SmiElementPtr]],
  smiGetFirstRefinement: [SmiRefinementPtr, [SmiNodePtr]],
  smiGetNextRefinement: [SmiRefinementPtr, [SmiRefinementPtr]],
});

function smiValue2String(smiValue) {
  let vValue;

  switch (smiValue.basetype) {
    case 1: // SMI_BASETYPE_INTEGER32: //              = 1,  /* also SMIv1/v2 INTEGER       */
      vValue = smiValue.value.integer32;
      break;
    case 2: // SMI_BASETYPE_OCTETSTRING: //            = 2,
    case 11: // SMI_BASETYPE_BITS: //					 = 11  /* SMIv2, SMIng and SPPI       */
      // CreateSafeArray(reinterpret_cast<BYTE*>(smiValue.value.ptr), smiValue.len, &vValue);
      break;
    case 3: // SMI_BASETYPE_OBJECTIDENTIFIER: //       = 3,
      vValue = new Uint32Array(
        smiValue.value.oid.reinterpret(smiValue.len * ref.sizeof.uint).buffer,
      ).join('.');
      break;
    case 4: // SMI_BASETYPE_UNSIGNED32: //             = 4,
      vValue = smiValue.value.unsigned32;
      break;
    case 5: // SMI_BASETYPE_INTEGER64: //              = 5,  /* SMIng and SPPI              */
      vValue = smiValue.value.integer64;
      break;
    case 6: // SMI_BASETYPE_UNSIGNED64: //             = 6,  /* SMIv2, SMIng and SPPI       */
      vValue = smiValue.value.unsigned64;
      break;
    case 7: // SMI_BASETYPE_FLOAT32: //                = 7,  /* only SMIng                  */
      vValue = smiValue.value.float32;
      break;
    case 8: // SMI_BASETYPE_FLOAT64: //                = 8,  /* only SMIng                  */
      vValue = smiValue.value.float64;
      break;
    case 9: // SMI_BASETYPE_FLOAT128: //               = 9,  /* only SMIng                  */
      vValue = smiValue.value.float128;
      break;
    case 10: // SMI_BASETYPE_ENUM: //                   = 10,
      break;
  }

  return vValue;
}

console.log('Pre-Init');

const ret = SMILib.smiInit('Test');

console.log('smiInit - %d', ret);

SMILib.smiSetPath('C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/ietf;C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/iana;C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/irtf;C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/site;C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/tubs;C:/Data/Projects/libsmi/libsmi-0.4.8/mibs/test');


console.log('smiGetPath - %s', SMILib.smiGetPath());


  let mibLoader = function  (mibs) {
    /*
      Load default mibs
    */
    console.log('smiLoadModule - %s', SMILib.smiLoadModule('SNMPV2-SMI'));
    console.log('smiLoadModule - %s', SMILib.smiLoadModule('SNMPV2-TC'));
    console.log('smiLoadModule - %s', SMILib.smiLoadModule('SNMPV2-CONF'));
    console.log('smiLoadModule - %s', SMILib.smiLoadModule('RFC1155-SMI'));
    console.log('smiLoadModule - %s', SMILib.smiLoadModule('RFC-1212'));
    console.log('smiLoadModule - %s', SMILib.smiLoadModule('RFC-1215'));
    console.log('smiLoadModule - %s', SMILib.smiLoadModule('RFC1213-MIB'));

    /*
      Load user's mibs
    */
    for (let i = 0; i < mibs.length; i++) {
      console.log('smiLoadModule - %s', SMILib.smiLoadModule(mibs[i]));
    }

  }

// figure out how to determine first meaningful node?
let getData = function () {
  let data = [];
  // let buff = SMILib.smiGetNode(ref.NULL, '1.3.6.1.4.1.2566');

  // original method: get all nodes + misc mib junk
  let buff = SMILib.smiGetFirstModule();
  
  while (buff.length > 0) {
    let smiModule = buff.deref();
    // let nodeBuff =  SMILib.smiGetNode(ref.NULL, '1.3.6.1.4.1.2566');

    // original method: get all nodes + misc mib junk
    let nodeBuff = SMILib.smiGetFirstNode(buff, SMI_NODEKIND_ANY);

    while (nodeBuff.length > 0) {
      let smiNode = nodeBuff.deref();
      let oid  = new Uint32Array(smiNode.oid.reinterpret(smiNode.oidlen * 4).buffer).join('.');
      let smiDecl = SmiDecl.get(smiNode.decl).key;
      let smiAccess = SmiAccess.get(smiNode.access).key;
      let smiStatus = SmiStatus.get(smiNode.status).key;
      let smiNodeKind = SmiNodekindEnum.get(smiNode.nodekind).key;
      

    // split cuts off read only 
      data.push({
        'Node' : smiNode.name,
        'address' : oid,
        'SmiDecl' : smiDecl.split('_').pop(),
        'SmiAccess' : smiAccess.split('_').pop(),
        'SmiStatus' : smiStatus.split('_').pop(),
        'SmiNodekind' : smiNodeKind.split('_').pop(),
        'Description' : smiNode.description,
        'Format' : smiNode.format,
        'children': []
      });

      
      nodeBuff = SMILib.smiGetNextNode(nodeBuff, SMI_NODEKIND_ANY);
    }
    buff = SMILib.smiGetNextModule(buff);
  } 

  return data;
}


mibLoader([]) 
  
  // remote dupes if any and null defaults
  let polish = function(arr) {
    let dictionary = {'0': 1, '0.0': 1};
    
    let data = arr.filter(function(item) {
      if (!dictionary[item.address]) {
          dictionary[item.address] = 1;
          return item;
        }
    })
    
   // sortSubroutine(data);

    return data;
  }
  
  // order by mib OIDS
  let sortSubroutine = function(arr) {
          
    
  };

  let formatSubroutine = function(arr) {
    
    let base = arr[0];
    base.size = arr[0].address.split('.').length;
    

    for (let n = 1; n < arr.length; n++) {
      let address = arr[n].address.split('.').slice(0, base.size).join('.');
      let len = arr[n].address.split('.').length;
      let small = len < base.size ? len : base.size;

      // Compare address roots
      if (address === base.address) {
        let temp = arr.splice(n, 1)[0];
        base.children.push(temp);
        n--;

        // change to new oid  ex 1.2 => 1.3, 1.3.6.1 => 1.3.7
      } else { 
        base = arr[n];
        base.size = len;
      } 
      
    }

    // recurse and sort children
    for (let z = 0; z < arr.length; z++) {
      if (arr[z].children.length) {
        formatSubroutine(arr[z].children)
      }
    }
    
  }


module.exports = {

  mibLoader: mibLoader,
  getData: getData,
  sortSubroutine: sortSubroutine,
  formatSubroutine: formatSubroutine,
  polish: polish

}