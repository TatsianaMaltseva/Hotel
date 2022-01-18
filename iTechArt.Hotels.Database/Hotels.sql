CREATE TABLE [dbo].[Hotels] (
    [Id] INT IDENTITY (1, 1) NOT NULL,
    [Name] NVARCHAR(150) NOT NULL,
    [Country] NVARCHAR(150) NOT NULL,
    [City] NVARCHAR(200) NOT NULL,
    [Address] NVARCHAR(250) NOT NULL,
    [Description] NVARCHAR(3000) NULL,
    [MainImageId] INT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY (MainImageId) REFERENCES [dbo].[Images](Id) ON DELETE SET NULL
);