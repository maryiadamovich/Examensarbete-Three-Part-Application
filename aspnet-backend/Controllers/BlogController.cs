using Microsoft.AspNetCore.Mvc;

namespace AspnetBackend.Controllers;

public class BlogController : Controller
{
    public IActionResult Index() => View();
}
