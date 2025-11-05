'use strict';

/**
 * Eureka Helper Utilities
 *
 * Provides helper functions to interact with Eureka client
 * and retrieve service instance information.
 */

/**
 * Get service URL from Eureka registry
 * @param {Object} eurekaClient - The Eureka client instance
 * @param {string} serviceName - The name of the service (e.g., 'USER-SERVICE')
 * @returns {string|null} The service URL (http://host:port) or null if not found
 */
function getServiceUrl(eurekaClient, serviceName) {
    try {
        // Get all instances of the service from Eureka
        const instances = eurekaClient.getInstancesByAppId(serviceName.toUpperCase());

        if (!instances || instances.length === 0) {
            console.warn(`[Eureka Helper] No instances found for service: ${serviceName}`);
            return null;
        }

        // Get the first available instance (simple load balancing could be added here)
        const instance = instances[0];

        // Build the service URL
        const protocol = instance.securePort?.['@enabled'] ? 'https' : 'http';
        const host = instance.ipAddr || instance.hostName;
        const port = instance.port?.['$'] || instance.port;

        const serviceUrl = `${protocol}://${host}:${port}`;

        console.log(`[Eureka Helper] Resolved ${serviceName} -> ${serviceUrl}`);
        return serviceUrl;

    } catch (error) {
        console.error(`[Eureka Helper] Error resolving service ${serviceName}:`, error.message);
        return null;
    }
}

/**
 * Get all instances of a service
 * @param {Object} eurekaClient - The Eureka client instance
 * @param {string} serviceName - The name of the service
 * @returns {Array} Array of service instances
 */
function getServiceInstances(eurekaClient, serviceName) {
    try {
        const instances = eurekaClient.getInstancesByAppId(serviceName.toUpperCase());
        return instances || [];
    } catch (error) {
        console.error(`[Eureka Helper] Error getting instances for ${serviceName}:`, error.message);
        return [];
    }
}

/**
 * Check if a service is available in Eureka
 * @param {Object} eurekaClient - The Eureka client instance
 * @param {string} serviceName - The name of the service
 * @returns {boolean} True if service is available
 */
function isServiceAvailable(eurekaClient, serviceName) {
    const instances = getServiceInstances(eurekaClient, serviceName);
    return instances.length > 0;
}

module.exports = {
    getServiceUrl,
    getServiceInstances,
    isServiceAvailable
};
