<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::all();
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        $project = Project::create($validated);
        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        $project->update($validated);
        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(null, 204);
    }
}
