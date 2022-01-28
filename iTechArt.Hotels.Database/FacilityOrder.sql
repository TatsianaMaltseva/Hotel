CREATE TABLE [dbo].[FacilityOrder] (
    [Id] INT IDENTITY (1,1) NOT NULL,
    [OrdersId] INT NOT NULL,
    [FacilitiesId] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([OrdersId]) REFERENCES [dbo].[Orders](Id) ON DELETE CASCADE,
    FOREIGN KEY ([FacilitiesId]) REFERENCES [dbo].[Facilities](Id)
)
