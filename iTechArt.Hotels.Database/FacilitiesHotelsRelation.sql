CREATE TABLE [dbo].[FacilitiesHotelsRelation]
(
    [FacilityID] INT NOT NULL,
    [HotelID] INT NOT NULL,
    FOREIGN KEY ([FacilityID]) REFERENCES [dbo].[Facilities]([FacilityId]), 
    FOREIGN KEY ([HotelID]) REFERENCES [dbo].[Hotels]([HotelId]),
    UNIQUE ([FacilityID], [HotelID])
);