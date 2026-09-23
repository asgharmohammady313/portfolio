<?php

require 'vendor/autoload.php';

$app = require 'bootstrap/app.php';

$app->bootstrapWith([
    Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables::class,
    Illuminate\Foundation\Bootstrap\LoadConfiguration::class,
]);

echo "CACHE_DEFAULT=" . $app['config']['cache.default'] . PHP_EOL;

$filesystemProvider = new Illuminate\Filesystem\FilesystemServiceProvider($app);
$filesystemProvider->register();

echo "FILESYSTEM_PROVIDER_REGISTERED" . PHP_EOL;

$cacheProvider = new Illuminate\Cache\CacheServiceProvider($app);
$cacheProvider->register();

echo "CACHE_PROVIDER_REGISTERED" . PHP_EOL;

echo "TRYING_CACHE_STORE..." . PHP_EOL;

$store = $app['cache.store'];

echo "CACHE_STORE_CREATED" . PHP_EOL;
echo "STORE_CLASS=" . get_class($store) . PHP_EOL;
