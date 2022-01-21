CREATE TABLE [dbo].[Orders] (
    [Id] INT IDENTITY (1,1) NOT NULL,
    [RoomId] INT NOT NULL,
    [AccountId] INT NOT NULL,
    [Price] DECIMAL(19,4) NOT NULL,
    [CheckInDate] DATE NOT NULL,
    [CheckOutDate] DATE NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([AccountId]) REFERENCES [dbo].[Accounts]([Id]) ON DELETE CASCADE,
    FOREIGN KEY ([RoomId]) REFERENCES [dbo].[Rooms]([Id]) 
)
