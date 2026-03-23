using System.Text.Json;

namespace AspnetBackend.Helpers;

public static class ReactHelper
{
    private static Dictionary<string, string>? _manifest;
    private static readonly object _lock = new();

    // Loads the webpack manifest.json from wwwroot/dist/ and resolves a
    // bundle name (e.g. "home.js") to its hashed path (e.g. "/dist/home.abc123.js").
    public static string GetBundlePath(IWebHostEnvironment env, string name)
    {
        EnsureManifestLoaded(env);

        if (_manifest != null && _manifest.TryGetValue(name, out var path))
        {
            return path;
        }

        // Fallback: return an unhashed path so the page still renders
        // (useful when running before the first webpack build).
        return $"/dist/{name}";
    }

    private static void EnsureManifestLoaded(IWebHostEnvironment env)
    {
        if (_manifest != null)
            return;

        lock (_lock)
        {
            if (_manifest != null)
                return;

            var manifestPath = Path.Combine(env.WebRootPath, "dist", "manifest.json");

            if (!File.Exists(manifestPath))
            {
                _manifest = new Dictionary<string, string>();
                return;
            }

            var json = File.ReadAllText(manifestPath);
            _manifest = JsonSerializer.Deserialize<Dictionary<string, string>>(json)
                        ?? new Dictionary<string, string>();
        }
    }

    // Returns true when the manifest contains an entry for the given name.
    // Use this to conditionally load optional split chunks (e.g. "common.js").
    public static bool HasBundle(IWebHostEnvironment env, string name)
    {
        EnsureManifestLoaded(env);
        return _manifest != null && _manifest.ContainsKey(name);
    }

    // Call this to force-reload the manifest (useful during development).
    public static void InvalidateCache() => _manifest = null;
}
