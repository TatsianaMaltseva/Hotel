CREATE TABLE [dbo].[Facilities]
(
    [FacilityId] INT IDENTITY (1, 1) NOT NULL, 
    [Name] VARCHAR(35) NOT NULL,
    PRIMARY KEY CLUSTERED ([FacilityId] ASC)
);