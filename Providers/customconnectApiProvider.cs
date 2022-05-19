using Microsoft.Azure.Workflows.ServiceProviders.Abstractions;


namespace hellocustomconnect.Providers
{
    public static class customconnectApiProvider
    {
        public static ServiceOperationApi GetServiceOperationApi()
        {
            return new ServiceOperationApi()
            {
                Name = "customconnect",
                Id = "/serviceProviders/customconnect",
                Type = DesignerApiType.ServiceProvider,
                Properties = new ServiceOperationApiProperties
                {
                    BrandColor = 4282545600,
                    IconUri = new Uri ("https://docs.microsoft.com/en-us/shows/hello-world/media/helloworld_383x215.png",UriKind.Absolute),
                    Description = "Custom Connect Provider",
                    DisplayName = "Custom Connect Provider",
                    Capabilities = new ApiCapability[] {ApiCapability.Actions},
                    ConnectionParameters = new ConnectionParameters
                    {
                        ConnectionString = new ConnectionStringParameters
                        {
                            Type = ConnectionStringType.SecureString,
                            ParameterSource = ConnectionParameterSource.AppConfiguration,
                            UIDefinition = new UIDefinition
                            {
                                DisplayName = "Connection String",
                                Description = "Connection String",
                                Tooltip = "Connection String",
                                Constraints = new Constraints
                                {
                                    Required = "true",
                                },
                            },
                        },
                    },
                },
            };
        }
    }
}