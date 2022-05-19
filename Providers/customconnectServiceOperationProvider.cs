using Microsoft.Azure.Workflows.ServiceProviders.Abstractions;
using Microsoft.Azure.Workflows.ServiceProviders.WebJobs.Abstractions.Providers;
using Microsoft.WindowsAzure.ResourceStack.Common.Collections;
using Microsoft.WindowsAzure.ResourceStack.Common.Extensions;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace hellocustomconnect.Providers
{
    [ServiceOperationsProvider(Id = customconnectServiceOperationProvider.ServiceId, Name = customconnectServiceOperationProvider.ServiceName)]
    public class customconnectServiceOperationProvider : IServiceOperationsProvider
    {
        public const string ServiceName = "customconnect";

        public const string ServiceId = "/serviceProviders/customconnect";

        private readonly List<ServiceOperation> serviceOperationsList;

        private readonly InsensitiveDictionary<ServiceOperation> apiOperationsList;


        public customconnectServiceOperationProvider()
        {
            serviceOperationsList = new List<ServiceOperation>();
            apiOperationsList = new InsensitiveDictionary<ServiceOperation>();

            this.apiOperationsList.AddRange(new InsensitiveDictionary<ServiceOperation>
            {
                { "HelloWorld", helloworldcustomconnectProvider.Operation },
            });

            this.serviceOperationsList.AddRange(new List<ServiceOperation>
            {
                {  helloworldcustomconnectProvider.Operation.CloneWithManifest(helloworldcustomconnectProvider.OperationManifest) }
            });
        }
        

        string IServiceOperationsProvider.GetBindingConnectionInformation(string operationId, InsensitiveDictionary<JToken> connectionParameters)
        {
            return ServiceOperationsProviderUtilities
                    .GetRequiredParameterValue(
                        serviceId: ServiceId,
                        operationId: operationId,
                        parameterName: "connectionString",
                        parameters: connectionParameters)?
                    .ToValue<string>();
        }

        IEnumerable<ServiceOperation> IServiceOperationsProvider.GetOperations(bool expandManifest)
        {
            return expandManifest ? serviceOperationsList : GetApiOperations();
        }

        ServiceOperationApi IServiceOperationsProvider.GetService()
        {
            return customconnectApiProvider.GetServiceOperationApi();
        }

        Task<ServiceOperationResponse> IServiceOperationsProvider.InvokeOperation(string operationId, InsensitiveDictionary<JToken> connectionParameters, ServiceOperationRequest serviceOperationRequest)
        {
            HttpResponseMessage response;

            customerconnectParams mycustomconnectparams = new customerconnectParams(connectionParameters, serviceOperationRequest);

            using (var client = new HttpClient())
            {
                var content = new StringContent(mycustomconnectparams.Content);
                response = client.PostAsync(mycustomconnectparams.Url, content).Result;
            }

            return Task.FromResult((ServiceOperationResponse)new customconnectResponse(JObject.FromObject(new { message = "Message sent" }), System.Net.HttpStatusCode.OK));

        }

        private IEnumerable<ServiceOperation> GetApiOperations()
        {
            return this.apiOperationsList.Values;
        }

    }
}