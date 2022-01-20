CREATE TABLE [dbo].[FacilityOrder] (
    [Id] INT IDENTITY (1,1) NOT NULL,
    [OrderId] INT NOT NULL,
    [FacilityId] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Orders](Id) ON DELETE CASCADE,
    FOREIGN KEY ([FacilityId]) REFERENCES [dbo].[Facilities](Id)
)
