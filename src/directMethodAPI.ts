/*
 *  Direct Method API
 *  Invokable methods for facilitating cloud-to-device communication. It provides
 *  a convenient interface for calling remote actions on the device from Cloud Platform.
 */

import { cloud, stateManager } from ".";
import { app_getApplicationInfo, app_restartApplication, app_stopApplication } from "./application";
import { system_getApplicationInfo, system_getWirelessAddress, system_getWirelessSSID, system_restart, system_updateApplication } from "./system";


/*
 *  Connectivity Direct API
 *  All features involving device-to-cloud connectivity
 */
export function initializeDirectMethodAPI(){
    /* Get the connection parameters */
    cloud.registerDirectMethod('getConnectionParameters',(req:any, res:any)=>{
        return res.send( cloud.getConnectionParameters() );
    });

    /* Update the connection parameters */
    cloud.registerDirectMethod('updateConnectionParameters', async(req:any, res:any)=>{
        // Check for the presence of the parameters in the payload
        if( !req.body )
        return res.status(400).send({message:'No request body'});
    
        try{
            const body = JSON.parse(req.body);
            if( !body.parameters ) return res.status(400).send({message:'No parameters'});
    
            await cloud.updateConnectionParameters( body.parameters );
            return res.send({message:'Successfully updated the connection parameters'});
        } catch(err){
            return res.status(500).send({message:err});
        }
    });

    /* Get the provisioning parameters */
    cloud.registerDirectMethod('getProvisioningParameters',(req:any, res:any)=>{
        return res.send( cloud.getProvisioningParameters() );
    });

    /* Update the provisioning parameters */
    cloud.registerDirectMethod('updateProvisioningParameters', async(req:any, res:any)=>{
        // Check for the presence of the parameters in the payload
        if( !req.body )
        return res.status(400).send({message:'No request body'});

        try{
            const body = JSON.parse(req.body);
            if( !body.parameters ) return res.status(400).send({message:'No parameters'});

            await cloud.updateProvisioningParameters( body.parameters );
            return res.send({message:'Successfully updated the provisioning parameters'});
        } catch(err){
            return res.status(500).send({message:err});
        }
    });

    /*
    *  System Direct API
    *  All functionality related to system operations.
    */

    /* Restart system */
    cloud.registerDirectMethod('reboot',async(req:any, res:any)=>{
        if( system_restart(2000) )
        return res.send({message:'Restarting system'});
        return res.status(500).send({message:'System restart failed'});
    });

    /* Identify System  */
    cloud.registerDirectMethod('identify',async(req:any, res:any)=>{
        stateManager.interruptIndicators('identify');
        return res.send({message:'Identifying system'});
    });

    /* Get system application info */
    cloud.registerDirectMethod('getSystemApplicationInfo', (req:any, res:any)=>{
        system_getApplicationInfo()
            .then((appInfo:any)=>{
                return res.send(appInfo);
            })
            .catch((err)=>{
                return res.status(500).send({message:err});
            });
    });

    /* Request system application update */
    cloud.registerDirectMethod('updateSystemApplication', (req:any, res:any)=>{
        system_updateApplication()
            .then((message)=>{
                return res.send({message:message});
            })
            .catch((err)=>{
                return res.status(500).send({message:err});
            });
    });

    /* Get system network info */
    cloud.registerDirectMethod('getSystemNetworkInfo', async(req:any, res:any)=>{
        try{
            const settings = {
                ssid: await system_getWirelessSSID(),
                ipAddress: await system_getWirelessAddress('wlan0')
            }
            return res.send(settings);
        }
        catch( err ){
            return res.status(500).send({message:err});
        }
    });

    /*
     *  Application
     */

    /* Get the system application info */
    cloud.registerDirectMethod('getApplicationInfo', async(req:any, res:any)=>{
        app_getApplicationInfo()
            .then((appInfo:any)=>{
                return res.send(appInfo);
            })
            .catch((err)=>{
                return res.status(500).send({message:err});
            });
    });

    /* Update the system application */
    cloud.registerDirectMethod('updateApplication', async(req:any, res:any)=>{
        return res.send({message:'TODO: implementation'});
    });

    /* Restart the application */
    cloud.registerDirectMethod('restartApplication', async(req:any, res:any)=>{
        try{
            const result = await app_restartApplication();
            return res.send({message:result});
        } catch( err ){
            return res.status(500).send({message:err});
        }
    });

    /* Stop the application */
    cloud.registerDirectMethod('stopApplication', async(req:any, res:any)=>{
        try{
            const result = await app_stopApplication();
            return res.send({message:result});
        } catch( err ){
            return res.status(500).send({message:err});
        }
    });

}