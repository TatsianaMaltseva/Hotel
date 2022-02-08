using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace iTechArt.Hotels.Api.Services
{
    public class DbCleaningHostedService : IHostedService, IDisposable
    {
        private Timer _timer = null!;
        private readonly IServiceScopeFactory _scopeFactory;

        public DbCleaningHostedService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(5));

            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var _hotelDb = scope.ServiceProvider.GetRequiredService<HotelsDatabaseContext>();
                var viewsToDelete = _hotelDb.Views.Where(view => view.ExpireTime < DateTime.Now);
                _hotelDb.Views.RemoveRange(viewsToDelete);
                _hotelDb.SaveChanges();
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer.Dispose();
        }
    }
}
