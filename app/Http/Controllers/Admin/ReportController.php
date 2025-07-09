<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;   
use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Order;
use App\Models\Tenant;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(Report::with('order.tenant')->orderBy('created_at', 'desc')->get());
        return Inertia::render('admin/report/report-index', [
            'reports' => Report::with('order.tenant')->orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        // dd($id);
        // dd(Report::with('order.tenant')
        //         ->where('id', $id)
        //         ->orderBy('created_at', 'desc')
        //         ->get());
        return Inertia::render('admin/report/report-show', [
            'report' => Report::with('order.tenant')
                ->where('id', $id)
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
