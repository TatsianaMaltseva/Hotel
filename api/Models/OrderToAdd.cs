﻿using System;
using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Models
{
    public class OrderToAdd
    {
        [Required]
        public Room Room { get; set; }

        [Required]
        public Hotel Hotel { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }
    }
}