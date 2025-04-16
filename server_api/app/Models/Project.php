<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['title', 'description', 'due_date', 'status', 'user_id'];

    protected $casts = [
        'due_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // プロジェクトを所有するユーザー
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}