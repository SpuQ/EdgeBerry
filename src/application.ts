/*
 *  Application
 *  Interaction with application related features
 */
const pm2 = require('pm2');

// Get system application info
// Using PM2
export function app_getApplicationInfo():Promise<string|any>{
    return new Promise<string|any>((resolve, reject)=>{
        pm2.connect((err:any)=>{
            if (err) return reject(err.toString());
            pm2.list((err:any, processes:any) => {
                if (err) return reject(err);
                // Loop through processes
                processes.forEach((process:any) => {
                    if(process.name === 'Edge_Gateway_Application'){
                        const data = {
                            name: process.pm2_env.axm_options.module_name,
                            version: process.pm2_env.version,
                            cpuUsage: process.monit.cpu+'%',
                            memUsage: Math.round(parseInt(process.monit.memory)/100000)+' MB',
                            status: process.pm2_env.status
                        }
                        pm2.disconnect();
                        return resolve( data );
                    }
                });
                reject('Application not found');
                pm2.disconnect();
            });
        })
    });
}

// Restart the application
export function app_restartApplication():Promise<string>{
    return new Promise<string>((resolve, reject)=>{
        pm2.connect((err:any)=>{
            if(err){
                pm2.disconnect();
                return reject(err.toString());
            }
            // Restart the PM2 process
            pm2.restart('Edge_Gateway_Application', (err:any, process:any)=>{
                if(err){
                    pm2.disconnect();
                    return reject(err.toString());
                }
                pm2.disconnect();
                resolve('Application restarted');
            });
        });
    });
}

// Stop the application
export function app_stopApplication():Promise<string>{
    return new Promise<string>((resolve, reject)=>{
        pm2.connect((err:any)=>{
            if(err){
                pm2.disconnect();
                return reject(err.toString());
            }
            // Restart the PM2 process
            pm2.stop('Edge_Gateway_Application', (err:any, process:any)=>{
                if(err){
                    pm2.disconnect();
                    return reject(err.toString());
                }
                pm2.disconnect();
                resolve('Application stopped');
            });
        });
    });
}
