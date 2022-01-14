CREATE TABLE [dbo].[FacilityHotel] (
    [Id] INT IDENTITY (1,1) NOT NULL,
    [HotelId] INT NOT NULL,
    [FacilityId] INT NOT NULL,
    FOREIGN KEY ([HotelId]) REFERENCES [dbo].[Hotels](Id) ON DELETE CASCADE,
    FOREIGN KEY ([FacilityId]) REFERENCES [dbo].[Facilities](Id) ON DELETE CASCADE
)
