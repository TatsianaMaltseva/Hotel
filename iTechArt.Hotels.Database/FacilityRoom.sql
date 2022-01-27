CREATE TABLE [dbo].[FacilityRoom] (
    [Id] INT IDENTITY (1,1) NOT NULL,
    [RoomId] INT NOT NULL,
    [FacilityId] INT NOT NULL,
    [Price] DECIMAL(19,4) NOT NULL,
    FOREIGN KEY ([RoomId]) REFERENCES [dbo].[Rooms](Id) ON DELETE CASCADE,
    FOREIGN KEY ([FacilityId]) REFERENCES [dbo].[Facilities](Id) ON DELETE CASCADE
)
