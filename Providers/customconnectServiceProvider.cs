using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs.Description;
using Microsoft.Azure.WebJobs.Host.Config;
using Microsoft.Azure.Workflows.ServiceProviders.Abstractions;
using System;
using System.Collections.Generic;
using System.Text;

namespace hellocustomconnect.Providers
{
    [Extension("customconnectServiceProvider", configurationSection: "customconnectServiceProvider")]
    public class customconnectServiceProvider : IExtensionConfigProvider
    {
        public customconnectServiceProvider(
            ServiceOperationsProvider serviceOperationsProvider,
            customconnectServiceOperationProvider operationsProvider)
        {
            serviceOperationsProvider.RegisterService(serviceName: customconnectServiceOperationProvider.ServiceName, serviceOperationsProviderId: customconnectServiceOperationProvider.ServiceId, serviceOperationsProviderInstance: operationsProvider);
        }
        public void Initialize(ExtensionConfigContext context)
        {
            
        }
    }
}