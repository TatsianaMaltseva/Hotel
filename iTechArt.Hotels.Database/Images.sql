CREATE TABLE [dbo].[Images] (
    [Id] INT IDENTITY (1,1) NOT NULL,
    [HotelId] INT NOT NULL,
    [Path] VARCHAR(2000) NOT NULL, 
    [IsOuterLink] BIT NOT NULL,
    [RoomId] INT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([HotelId]) REFERENCES [dbo].[Hotels]([Id]) ON DELETE CASCADE,
    FOREIGN KEY ([RoomId]) REFERENCES [dbo].[Rooms]([Id]) ON DELETE CASCADE
);