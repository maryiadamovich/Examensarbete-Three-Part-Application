using Microsoft.AspNetCore.Mvc;

namespace AspnetBackend.Controllers;

public class UsersController : Controller
{
    public IActionResult Index() => View();
}
