using System;
using System.Collections.Generic;
using System.Text;

using Microsoft.Azure.Workflows.ServiceProviders.Abstractions;
using Microsoft.WindowsAzure.ResourceStack.Common.Collections;
using Microsoft.WindowsAzure.ResourceStack.Common.Extensions;
using Newtonsoft.Json.Linq;

namespace hellocustomconnect
{
    internal class customerconnectParams
    {
        private InsensitiveDictionary<JToken> connectionParameters;
        private ServiceOperationRequest serviceOperationRequest;

        public string Content { get; }

        public string Url { get; }

        public customerconnectParams(InsensitiveDictionary<JToken> connectionParameters, ServiceOperationRequest serviceOperationRequest)
        {
            this.connectionParameters = connectionParameters;
            this.serviceOperationRequest = serviceOperationRequest;

            Content = ServiceOperationsProviderUtilities.GetParameterValue("content", serviceOperationRequest.Parameters).ToValue<string>();
            Url = ServiceOperationsProviderUtilities.GetParameterValue("url", serviceOperationRequest.Parameters).ToValue<string>();
        }
    }
}