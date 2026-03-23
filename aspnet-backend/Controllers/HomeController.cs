using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace AspnetBackend.Controllers;

public class HomeController : Controller
{
    public IActionResult Index() => View();

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
        ViewData["RequestId"] = HttpContext.TraceIdentifier;
        ViewData["ErrorPath"] = exceptionFeature?.Path;
        ViewData["ErrorMessage"] = exceptionFeature?.Error?.Message;
        return View();
    }
}
