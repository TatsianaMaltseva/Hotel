CREATE TABLE [dbo].[Hotels] (
    [Id] INT IDENTITY (1, 1) NOT NULL,
    [Name] NVARCHAR(60) NOT NULL,
    [Country] NVARCHAR(56) NOT NULL,
    [City] NVARCHAR(85) NOT NULL,
    [Address] NVARCHAR(155) NOT NULL,
    [Description] NVARCHAR(3000) NULL,
    [MainImageId] INT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY (MainImageId) REFERENCES [dbo].[Images](Id) on delete set null
);