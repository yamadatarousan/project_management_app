<?php

namespace App\Http\Controllers\API;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->projects(); // ログインユーザーのプロジェクトのみ

        // フィルタリングの処理
        $status = $request->query('status');
        if ($status && in_array($status, ['in_progress', 'completed'])) {
            $query->where('status', $status);
        }

        // ソートの処理
        $sort = $request->query('sort', 'title');
        $order = $request->query('order', 'asc');

        $allowedSorts = ['title', 'due_date', 'created_at'];
        $sort = in_array($sort, $allowedSorts) ? $sort : 'title';

        $allowedOrders = ['asc', 'desc'];
        $order = in_array($order, $allowedOrders) ? $order : 'asc';

        $query->orderBy($sort, $order);

        if ($sort === 'due_date') {
            $query->orderByRaw('ISNULL(due_date) ' . ($order === 'asc' ? 'ASC' : 'DESC'));
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|in:in_progress,completed',
        ]);

        $project = $request->user()->projects()->create($validated);

        return $project;
    }

    public function show($id)
    {
        $project = $request->user()->projects()->findOrFail($id);
        return $project;
    }

    public function update(Request $request, $id)
    {
        $project = $request->user()->projects()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|in:in_progress,completed',
        ]);

        $project->update($validated);

        return $project;
    }

    public function destroy(Request $request, $id)
    {
        $project = $request->user()->projects()->findOrFail($id);
        $project->delete();

        return response()->noContent();
    }
}