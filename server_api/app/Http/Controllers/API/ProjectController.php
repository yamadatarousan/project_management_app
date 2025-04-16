<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query();

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
            'status' => 'nullable|in:in_progress,completed', // ステータスをバリデーション
        ]);

        return Project::create($validated);
    }

    public function show($id)
    {
        return Project::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|in:in_progress,completed',
        ]);

        $project->update($validated);

        return $project;
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->noContent();
    }
}
