CREATE TABLE [dbo].[Accounts] (
    [Id] INT IDENTITY (1, 1) NOT NULL,
    [Email] VARCHAR (125) NOT NULL,
    [Password] VARCHAR (20) NOT NULL,
    [Role] VARCHAR (25) NOT NULL
    PRIMARY KEY CLUSTERED ([Id] ASC)
);