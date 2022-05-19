using System;
using System.Collections.Generic;
using System.Text;

[assembly: Microsoft.Azure.WebJobs.Hosting.WebJobsStartup(typeof(hellocustomconnect.Startup.customconnectStartup))]

namespace hellocustomconnect.Startup
{
    using hellocustomconnect.Providers;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Hosting;
    using Microsoft.Extensions.DependencyInjection.Extensions;
    public class customconnectStartup : IWebJobsStartup
    {
        public void Configure(IWebJobsBuilder builder)
        {
            builder.AddExtension<customconnectServiceProvider>();
            builder.Services.TryAddSingleton<customconnectServiceOperationProvider>();
        }
    }
}