using Microsoft.Azure.Workflows.ServiceProviders.Abstractions;
using Microsoft.WindowsAzure.ResourceStack.Common.Collections;
using Microsoft.WindowsAzure.ResourceStack.Common.Swagger.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace hellocustomconnect.Providers
{
    public static class HelloWorldApiOperationDataProvider
    {
        internal const string OperationId = "HelloWorld";

        internal static readonly ServiceOperationManifest OperationManifest; 

        static HelloWorldApiOperationDataProvider()
        {
            OperationManifest = new ServiceOperationManifest()
            {
                ConnectionReference = new ConnectionReferenceFormat
                {
                    ReferenceKeyFormat = ConnectionReferenceKeyFormat.ServiceProvider,
                },
                Settings = new OperationManifestSettings()
                {
                    SecureData = new OperationManifestSettingWithOptions<SecureDataOptions>(),
                    TrackedProperties = new OperationManifestSetting()
                    {
                        Scopes = new OperationScope[] { OperationScope.Action }
                    },
                    RetryPolicy = new OperationManifestSetting()
                    {
                        Scopes = new OperationScope[] { OperationScope.Action }
                    }
                },
                InputsLocation = new InputsLocation[]
                {
                    InputsLocation.Inputs,
                    InputsLocation.Parameters,
                },
                Inputs = new SwaggerSchema
                {
                    Type = SwaggerSchemaType.Object,
                    Properties = new OrdinalDictionary<SwaggerSchema>
                    {
                        {
                            "content", new SwaggerSchema
                            {
                                Type = SwaggerSchemaType.String,
                                Title = "Content",
                                Description = "Content",
                            }
                        },
                        {
                            "url", new SwaggerSchema
                            {
                                Type = SwaggerSchemaType.String,
                                Title = "url",
                                Description = "url",
                            }
                        }
                    },
                    Required = new string[]
                    {
                        "content",
                        "url"
                    },
                },
                Outputs = new SwaggerSchema
                {
                    Type = SwaggerSchemaType.Object,
                    Properties = new OrdinalDictionary<SwaggerSchema>
                    {
                        {
                            "message", new SwaggerSchema
                            {
                                Type = SwaggerSchemaType.String,
                                Title = "message",
                                Description = "message",
                            }
                        },
                    },
                },
                Connector = customconnectApiProvider.GetServiceOperationApi()
            };
        }


        internal static readonly ServiceOperation Operation = new ServiceOperation()
        {
            Name = "HelloWorld",
            Id = "HelloWorld",
            Type = "HelloWorld",
            Properties = new ServiceOperationProperties()
            {
                Api = customconnectApiProvider.GetServiceOperationApi().GetFlattenedApi(),
                Summary = "Hello world action",
                Description = "Hello world action",
                Visibility = Visibility.Important,
                OperationType = OperationType.ServiceProvider,
                BrandColor = customconnectApiProvider.GetServiceOperationApi().Properties.BrandColor,
                IconUri = customconnectApiProvider.GetServiceOperationApi().Properties.IconUri,
                Annotation = new ServiceOperationAnnotation()
                {
                    Status = StatusAnnotation.Preview,
                    Family = "/serviceProviders/customconnect",
                }
            }
        };

    }
}