/*
 * This Java file has been generated by smidump 0.4.5. Do not edit!
 * It is intended to be used within a Java AgentX sub-agent environment.
 *
 * $Id: AuthenticationFailure.java 4432 2006-05-29 16:21:11Z strauss $
 */

import jax.AgentXOID;
import jax.AgentXVarBind;
import jax.AgentXNotification;
import java.util.Vector;

public class AuthenticationFailure extends AgentXNotification
{

    private final static long[] authenticationFailure_OID = {1, 3, 6, 1, 6, 3, 1, 1, 5, 5};
    private static AgentXVarBind snmpTrapOID_VarBind =
        new AgentXVarBind(snmpTrapOID_OID,
                          AgentXVarBind.OBJECTIDENTIFIER,
                          new AgentXOID(authenticationFailure_OID));



    public AuthenticationFailure() {
        AgentXOID oid;
        AgentXVarBind varBind;

        // add the snmpTrapOID object
        varBindList.addElement(snmpTrapOID_VarBind);
    }

    public Vector getVarBindList() {
        return varBindList;
    }

}

