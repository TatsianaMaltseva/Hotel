CREATE TABLE [dbo].[Rooms] (
    [Id] INT IDENTITY (1,1) NOT NULL,
    [MainImageId] INT NULL,
    [Name] VARCHAR(150) NOT NULL,
    [Sleeps] INT NOT NULL,
    [HotelId] INT NOT NULL,
    [Number] INT NOT NULL,
    [Price] DECIMAL(19,4) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([HotelId]) REFERENCES [dbo].[Hotels]([Id]) ON DELETE CASCADE,
    FOREIGN KEY ([MainImageId]) REFERENCES [dbo].[Images]([Id]) ON DELETE SET NULL
);
