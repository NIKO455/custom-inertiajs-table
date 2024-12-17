<?php

use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    $query = User::query();

    if ($request->input('search') && strlen($request->input('search')) >= 3) {
        $query->where(function ($query) use ($request) {
            $query->where('name', 'like', '%' . $request->input('search') . '%')
                ->orWhere('email', 'like', '%' . $request->input('search') . '%')
                ->orWhere('unique_id', 'like', '%' . $request->input('search') . '%');
        });
    }

    $sortableColumns = ['name', 'email', 'unique_id', 'status'];
    if ($request->input('sort')) {
        $sortField = $request->input('sort');
        $direction = 'asc';

        if (str_starts_with($sortField, '-')) {
            $direction = 'desc';
            $sortField = substr($sortField, 1);
        }

        if (in_array($sortField, $sortableColumns)) {
            $query->orderBy($sortField, $direction);
        }
    }

    $perPage = $request->input('perPage', 15);
    $page = $request->input('page', 1);

    Log::info($query->toSql(), $query->getBindings());

    $users = $query->paginate($perPage)->withQueryString();

    return Inertia::render('Welcome', [
        'users' => $users->isEmpty() ? [] : $users,
    ]);
});




Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__ . '/auth.php';
