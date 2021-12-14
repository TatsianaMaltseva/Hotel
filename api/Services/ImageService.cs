using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Services
{
    public class ImageService
    {
        private string FolderName 
        {
            get { return Path.Combine("Resources", "Images"); }
        }

        private string PathToSave
        {
            get { return Path.Combine(Directory.GetCurrentDirectory(), FolderName); }
        }

        public async Task<string> AddImageToPath(IFormFile file)
        {
            string fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            string fullPath = Path.Combine(PathToSave, fileName);
            string dbPath = Path.Combine(FolderName, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return dbPath;
        }
    }
}