CREATE TABLE [dbo].[RoomViews] (
    [Id] INT IDENTITY (1,1) NOT NULL,
    [RoomId] INT NOT NULL,
    [AccountId] INT NOT NULL,
    [ExpireTime] SMALLDATETIME NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([RoomId]) REFERENCES [dbo].[Rooms](Id) ON DELETE CASCADE,
    FOREIGN KEY ([AccountId]) REFERENCES [dbo].[Accounts]([Id]) ON DELETE CASCADE
)
