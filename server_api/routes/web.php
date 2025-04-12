<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
use App\Http\Controllers\PostController;
Route::get('/posts', [PostController::class, 'index']);