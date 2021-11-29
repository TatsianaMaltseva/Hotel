﻿CREATE TABLE [dbo].[Hotels] (
    [HotelId] INT IDENTITY (1, 1) NOT NULL,
    [Name] VARCHAR(60) NOT NULL,
    [Country] VARCHAR(60) NOT NULL,
    [City] VARCHAR(60) NOT NULL,
    [Address] VARCHAR(155) NOT NULL,
    PRIMARY KEY CLUSTERED ([HotelId] ASC)
);