CREATE TABLE [dbo].[Accounts]
(
    [Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Email] VARCHAR(40) NOT NULL, 
    [Password] VARCHAR(20) NOT NULL
)
