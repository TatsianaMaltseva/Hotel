﻿using System.ComponentModel.DataAnnotations;

namespace iTechArt.Hotels.Api.Entities
{
    public class ImageEntity
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(2000)]
        public string Path { get; set; }
        public bool IsOuterLink { get; set; }
        public int HotelId { get; set; }
        public HotelEntity Hotel { get; set; }
    }
}