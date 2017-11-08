// read the mainifest json
var manifest = JSON.parse(require('fs').readFileSync('./manifest', "utf8"));

// Shared env vars in all environments 
var shared = {
    version : manifest.version,
    serviceBase: process.env.SERVICE_BASE || '',
    apiUrl: process.env.API_URL || '/api/v1',
    apiToken: process.env.API_TOKEN || '/api/v1/token',
    debug: (process.env.DEBUG === 'true') || false,
    build: process.env.BUILD_NUMBER || 0,
    svnRevision: process.env.SVN_REVISION || 0,
    mibPath: process.env.MIB_PATH || ['C:/Data/Projects/SLSCloudControls/mibHub/libsmi-0.4.8/mibs/ietf',
    'C:/Data/Projects/SLSCloudControls/mibHub/libsmi-0.4.8/mibs/iana',
    'C:/Data/Projects/SLSCloudControls/mibHub/libsmi-0.4.8/mibs/irtf',
    'C:/Data/Projects/SLSCloudControls/mibHub/libsmi-0.4.8/mibs/site',
    'C:/Data/Projects/SLSCloudControls/mibHub/libsmi-0.4.8/mibs/tubs',
    'C:/Data/Projects/SLSCloudControls/mibHub/libsmi-0.4.8/mibs/test'],
    mibOrder: process.env.MIB_ORDER || ['SNMPV2-SMI', 'SNMPV2-TC', 'SNMPV2-CONF', 'RFC1155-SMI', 
    'RFC-1212', 'RFC-1215', 'RFC1213-MIB', 'RS-COMMON-MIB', 'RS-XX9-SMI-MIB', 'RS-XX9-COMMON-MIB', 
    'RS-XX9-TC-MIB', 'RS-XX9-AIR-COOLING-MIB', 'RS-XX9-ATSC-MIB', 'RS-XX9-ATV-MIB', 'RS-XX9-DAB-MIB'],
    secret: process.env.SECRET || 'superSecretSecret',
    port: process.env.PORT || 3000,
    tokenExpireTime: process.env.TOKEN_EXPIRE_TIME || '1h'
};


var environments = {
    development: shared,
    staging: shared,
    production: shared
};

module.exports = environments; 