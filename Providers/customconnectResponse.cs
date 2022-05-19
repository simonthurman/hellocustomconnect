using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Azure.Workflows.ServiceProviders.Abstractions;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Threading.Tasks;

namespace hellocustomconnect.Providers
{
    public class customconnectResponse : ServiceOperationResponse
    {
        
        public customconnectResponse(JToken body, HttpStatusCode statusCode)
            : base(body, statusCode)
        {
        }

        /// <summary>
        /// Completes the operation.
        /// </summary>
        public override Task CompleteOperation()
        {
            return Task.FromResult<object>(null);
        }

        /// <summary>
        /// Fails the operation.
        /// </summary>
        public override Task FailOperation()
        {
            return Task.FromResult<object>(null);
        }
    }
}