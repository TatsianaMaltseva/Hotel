CREATE TABLE [dbo].[Facilities] (
    [Id] INT IDENTITY (1,1) NOT NULL,
    [Name] NVARCHAR (60) NOT NULL,
    [Realm] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
)
